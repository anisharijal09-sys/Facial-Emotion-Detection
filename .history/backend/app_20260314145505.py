import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import io
import numpy as np
from PIL import Image
from ultralytics import YOLO

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
try:
    model = YOLO("C:\Users\sampada\OneDrive\Desktop\Facial-Emotion-Recognition\backend\best_1.pt")
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ MODEL FAILED TO LOAD: {e}")
    model = None

# 4. DATA MODEL
class ImageData(BaseModel):
    image: str

# 5. ROUTES
@app.get("/")
def home():
    return {"status": "Backend is Online", "model_loaded": model is not None}

@app.post("/predict")
def predict(data: ImageData):
    print("-> Frame received", end=" | ") 
    if model is None:
        return {"emotion": "Neutral"}

    try:
        # 1. Decode
        header, encoded = data.image.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = np.array(image)

        # 2. Run AI
        results = model(img, verbose=False) # Using model() instead of model.predict()

        # 3. Handle Classification (Top1 Probabilities)
        if hasattr(results[0], 'probs') and results[0].probs is not None:
            top_idx = int(results[0].probs.top1)
            confidence = float(results[0].probs.top1conf)
            emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
            detected = emotion_labels[top_idx]
            print(f"✅ CLASS: {detected} ({confidence:.2%})")
            return {"emotion": detected}

        # 4. Handle Detection (Bounding Boxes)
        # If your model was trained to "Detect" faces with labels
        if hasattr(results[0], 'boxes') and len(results[0].boxes) > 0:
            # Get the label of the first box detected
            top_box_cls = int(results[0].boxes.cls[0])
            names = model.names # Gets labels directly from the model file
            detected = names[top_box_cls]
            print(f"✅ DETECT: {detected}")
            return {"emotion": detected}

        print("❓ Model ran but result was empty")
        return {"emotion": "Neutral"}

    except Exception as e:
        print(f"🔥 ERROR: {str(e)}")
        return {"emotion": "Neutral"}
# app.py
if __name__ == "__main__":
    # Use 'app' instead of '"app:app"' to make it simpler
    uvicorn.run(app, host="127.0.0.1", port=8888, log_level="info")