import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import base64
import io
import numpy as np
from PIL import Image

from ultralytics import YOLO
import librosa
import tensorflow as tf
import joblib

# ---------------- APP ----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- LOAD MODELS ----------------
import os

print(os.path.exists("backend\\emotion_cnn_model_2.keras"))
print(os.path.getsize("backend\\emotion_cnn_model_2.keras"))
print("Loading Models...")

# Face model
face_model = YOLO("backend/best_1.pt")

# Voice model
VOICE_MODEL_PATH = "backend\\emotion_cnn_model_2.keras"
LABEL_ENCODER_PATH = "backend\\label_encoder.pkl"

voice_model = tf.keras.models.load_model(VOICE_MODEL_PATH)
le = joblib.load(LABEL_ENCODER_PATH)

FEATURE_LEN = 180

print("✅ Models Loaded")

# ---------------- DATA MODELS ----------------

class ImageData(BaseModel):
    image: str

class AudioChunk(BaseModel):
    samples: list[float]
    sample_rate: int


# ---------------- FEATURE EXTRACTION ----------------

def extract_feature(y, sr):
    mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40).T, axis=0)
    chroma = np.mean(librosa.feature.chroma_stft(y=y, sr=sr).T, axis=0)
    mel = np.mean(librosa.feature.melspectrogram(y=y, sr=sr).T, axis=0)

    features = np.hstack([mfcc, chroma, mel])[:FEATURE_LEN]

    return features.reshape(1, FEATURE_LEN, 1)


# ---------------- FACE EMOTION ----------------

@app.post("/predict-face")
def predict_face(data: ImageData):

    header, encoded = data.image.split(",", 1)
    image_bytes = base64.b64decode(encoded)

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = np.array(image)

    results = face_model(img, verbose=False)

    if hasattr(results[0], "boxes") and results[0].boxes is not None:

        boxes = results[0].boxes
        cls_id = int(boxes.cls[0])

        emotion = face_model.names[cls_id]

        return {"emotion": emotion}

    return {"emotion": "Neutral"}


# ---------------- VOICE EMOTION ----------------

@app.post("/predict-voice")
async def predict_voice(chunk: AudioChunk):

    y = np.array(chunk.samples, dtype=np.float32)

    if len(y) < chunk.sample_rate:
        return {"error": "audio too short"}

    feature = extract_feature(y, chunk.sample_rate)

    preds = voice_model.predict(feature, verbose=0)[0]

    idx = int(np.argmax(preds))

    emotion = le.inverse_transform([idx])[0]
    confidence = float(preds[idx])

    return {
        "emotion": emotion,
        "confidence": confidence
    }


# ---------------- RUN SERVER ----------------

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)