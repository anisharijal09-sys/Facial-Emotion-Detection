from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import cv2
import numpy as np
from ultralytics import YOLO
import asyncio
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5176/fake-backend"
    ""],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

model = YOLO("best_1.pt")
executor = ThreadPoolExecutor(max_workers=1)

class Frame(BaseModel):
    image: str

@app.get("/")
def root():
    return {"status": "FastAPI YOLO server running"}

def run_yolo(img):
    results = model(img, conf=0.5, imgsz=416)  # adjust imgsz for faster/slower

    detections = []

    # DEBUG LOG
    print(f"[YOLO] Frame size: {img.shape}, detections: {len(results[0].boxes)}")

    for box in results[0].boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cls = int(box.cls[0])
        conf = float(box.conf[0])
        detections.append({
            "x1": x1,
            "y1": y1,
            "x2": x2,
            "y2": y2,
            "class": model.names[cls],
            "confidence": conf
        })
        print(f"[YOLO] Detected {model.names[cls]} with confidence {conf:.2f}")

    return detections

@app.post("/detect")
async def detect(frame: Frame):
    img_bytes = base64.b64decode(frame.image.split(",")[1])
    np_img = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    # Convert to RGB if needed
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    loop = asyncio.get_event_loop()
    detections = await loop.run_in_executor(executor, run_yolo, img)

    return {"detections": detections}