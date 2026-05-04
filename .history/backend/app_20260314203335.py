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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. LOAD MODEL SAFELY
print("Loading AI Model... Please wait...")
try:
    model = YOLO("backend/best_1.pt")
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
        return {"emotion": "Neutral", "boxes": []}

    try:
        # 1. Decode
        header, encoded = data.image.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = np.array(image)

        results = model(img, verbose=False)

        boxes_list = []

        # Check if model provides boxes
        if hasattr(results[0], "boxes") and results[0].boxes is not None:
            boxes = results[0].boxes
            for i in range(len(boxes)):
                x1, y1, x2, y2 = boxes.xyxy[i].tolist()
                cls_id = int(boxes.cls[i])
                conf = float(boxes.conf[i])
                label = model.names[cls_id] if model.names else str(cls_id)

                boxes_list.append({
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "label": label,
                    "confidence": round(conf * 100, 2)
                })

            # Return top detected emotion (first box) + all boxes
            top_emotion = boxes_list[0]["label"] if boxes_list else "Neutral"
            print(f"✅ DETECTED {len(boxes_list)} face(s), Top: {top_emotion}")
            return {"emotion": top_emotion, "boxes": boxes_list}

        # Fallback: classification
        if hasattr(results[0], "probs") and results[0].probs is not None:
            top_idx = int(results[0].probs.top1)
            confidence = float(results[0].probs.top1conf)
            emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
            detected = emotion_labels[top_idx]
            print(f"✅ CLASS: {detected} ({confidence:.2%})")
            return {"emotion": detected, "boxes": []}

        print("❓ Model ran but result was empty")
        return {"emotion": "Neutral", "boxes": []}

    except Exception as e:
        print(f"🔥 ERROR: {str(e)}")
        return {"emotion": "Neutral", "boxes": []}


if __name__ == "__main__":
   uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")