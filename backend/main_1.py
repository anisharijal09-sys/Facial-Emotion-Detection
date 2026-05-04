from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import librosa
import tensorflow as tf
import joblib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "backend\\emotion_cnn_model_2.keras"
LABEL_ENCODER_PATH = "backend\\label_encoder.pkl"
FEATURE_LEN = 180

model = tf.keras.models.load_model(MODEL_PATH)
le = joblib.load(LABEL_ENCODER_PATH)

class AudioChunk(BaseModel):
    samples: list[float]
    sample_rate: int

def extract_feature(y, sr):
    mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40).T, axis=0)
    chroma = np.mean(librosa.feature.chroma_stft(y=y, sr=sr).T, axis=0)
    mel = np.mean(librosa.feature.melspectrogram(y=y, sr=sr).T, axis=0)
    features = np.hstack([mfcc, chroma, mel])[:FEATURE_LEN]
    return features.reshape(1, FEATURE_LEN, 1)

@app.get("/")
def home():
    return {"message": "Emotion detection API running"}

@app.post("/predict")
async def predict(chunk: AudioChunk):
    y = np.array(chunk.samples, dtype=np.float32)

    if len(y) < chunk.sample_rate:  # < 1 second
        return {"error": "Audio too short"}

    feature = extract_feature(y, chunk.sample_rate)
    preds = model.predict(feature, verbose=0)[0]

    idx = int(np.argmax(preds))
    emotion = le.inverse_transform([idx])[0]
    confidence = float(preds[idx])

    return {
        "emotion": emotion,
        "confidence": confidence
    }
