import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import io
import numpy as np
import librosa
import tensorflow as tf
import joblib
from PIL import Image
from ultralytics import YOLO
import os

# 1. SETUP APP
app = FastAPI()

# 2. NUCLEAR CORS (Allow Everything)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows localhost:5173, 5174, etc.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. LOAD MODEL SAFELY
print("Loading AI Model... Please wait...")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "best (1).pt")

MODEL_PATH = "backend/emotion_cnn_model_2.keras"
LABEL_ENCODER_PATH = "backend/label_encoder.pkl"
FEATURE_LEN = 180

try:
    image_model = YOLO(model_path)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ MODEL FAILED TO LOAD: {e}")
    image_model = None

audio_model = tf.keras.models.load_model(MODEL_PATH)
le = joblib.load(LABEL_ENCODER_PATH)

# 4. DATA MODEL
class ImageData(BaseModel):
    image: str

class AudioChunk(BaseModel):
    samples: list[float]
    sample_rate: int

def extract_feature(y, sr):
    mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40).T, axis=0)
    chroma = np.mean(librosa.feature.chroma_stft(y=y, sr=sr).T, axis=0)
    mel = np.mean(librosa.feature.melspectrogram(y=y, sr=sr).T, axis=0)
    features = np.hstack([mfcc, chroma, mel])[:FEATURE_LEN]
    return features.reshape(1, FEATURE_LEN, 1)

# 5. ROUTES
@app.get("/")
def home():
    return {"status": "Backend is Online", "model_loaded": image_model is not None}

# ================= IMAGE EMOTION (UNCHANGED) =================
@app.post("/predict")
def predict(data: ImageData):
    print("-> Frame received", end=" | ")

    if image_model is None:
        return {"emotion": "Neutral", "boxes": []}

    try:
        header, encoded = data.image.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = np.array(image)

        results = image_model(img, verbose=False, conf=0.15)

        boxes_list = []

        if hasattr(results[0], "boxes") and results[0].boxes is not None:
            boxes = results[0].boxes

            for i in range(len(boxes)):
                x1, y1, x2, y2 = boxes.xyxy[i].tolist()
                cls_id = int(boxes.cls[i])
                conf = float(boxes.conf[i])
                conf = max(0.0, min(conf, 1.0))

                label = image_model.names[cls_id] if image_model.names else str(cls_id)

                boxes_list.append({
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "label": label,
                    "confidence": round(conf, 3)
                })

            if len(boxes_list) > 0:
                top_emotion = boxes_list[0]["label"]
                print(f"✅ DETECTED {len(boxes_list)} face(s), Top: {top_emotion}")

                return {
                    "emotion": top_emotion,
                    "boxes": boxes_list
                }

        # fallback
        if hasattr(results[0], "probs") and results[0].probs is not None:
            top_idx = int(results[0].probs.top1)
            confidence = float(results[0].probs.top1conf)

            emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
            detected = emotion_labels[top_idx]

            print(f"✅ CLASS: {detected} ({confidence:.2%})")

            return {
                "emotion": detected,
                "boxes": []
            }

        print("❓ No detections")
        return {"emotion": "Neutral", "boxes": []}

    except Exception as e:
        print(f"🔥 ERROR: {str(e)}")
        return {"emotion": "Neutral", "boxes": []}
    
@app.post("/predict/audio")
async def predict_audio(chunk: AudioChunk):
    y = np.array(chunk.samples, dtype=np.float32)

    if len(y) < chunk.sample_rate:  # < 1 second
        return {"error": "Audio too short"}

    feature = extract_feature(y, chunk.sample_rate)
    preds = audio_model.predict(feature, verbose=0)[0]

    idx = int(np.argmax(preds))
    emotion = le.inverse_transform([idx])[0]
    confidence = float(preds[idx])

    return {
        "emotion": emotion,
        "confidence": confidence
    }
# app.py
if __name__ == "__main__":
    # Use 'app' instead of '"app:app"' to make it simpler
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
