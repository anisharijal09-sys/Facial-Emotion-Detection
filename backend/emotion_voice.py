import sounddevice as sd
import numpy as np
import librosa
import tensorflow as tf
import joblib
import queue
import sys

# ======================
# CONFIG (MATCH MODEL)
# ======================
SAMPLE_RATE = 22050
DURATION = 4                # seconds → ~176 frames
MAX_LEN = 176
ENERGY_THRESHOLD = 0.01

# ======================
# LOAD MODEL & LABELS
# ======================
model = tf.keras.models.load_model("emotion_cnn_model.keras")
le = joblib.load("label_encoder.pkl")

# ======================
# AUDIO QUEUE
# ======================
audio_queue = queue.Queue()

# ======================
# FEATURE EXTRACTION
# ======================
def extract_features(y):
    # RMS energy (1 feature per timestep)
    rms = librosa.feature.rms(y=y)[0]  # (time,)

    # Pad / trim to 176
    if len(rms) < MAX_LEN:
        rms = np.pad(rms, (0, MAX_LEN - len(rms)))
    else:
        rms = rms[:MAX_LEN]

    return rms.reshape(-1, 1)  # (176, 1)

# ======================
# AUDIO CALLBACK
# ======================
def audio_callback(indata, frames, time, status):
    if status:
        print(status, file=sys.stderr)
    audio_queue.put(indata.copy())

# ======================
# START STREAM
# ======================
print("Real-time Emotion Detection Started")
print("Speak clearly into the microphone")
print("Press CTRL+C to stop\n")

try:
    with sd.InputStream(
        samplerate=SAMPLE_RATE,
        channels=1,
        callback=audio_callback
    ):
        buffer = np.empty((0, 1), dtype=np.float32)

        while True:
            buffer = np.vstack((buffer, audio_queue.get()))

            if len(buffer) >= SAMPLE_RATE * DURATION:
                chunk = buffer[:SAMPLE_RATE * DURATION]
                buffer = buffer[SAMPLE_RATE * DURATION:]

                y = chunk.flatten()

                # Silence check
                if np.mean(np.abs(y)) < ENERGY_THRESHOLD:
                    print("Silence")
                    continue

                features = extract_features(y)
                x = np.expand_dims(features, axis=0)  # (1, 176, 1)

                preds = model.predict(x, verbose=0)[0]
                idx = np.argmax(preds)

                emotion = le.inverse_transform([idx])[0]
                confidence = preds[idx] * 100

                print(f"Emotion: {emotion.upper():<8} | Confidence: {confidence:5.2f}%")

except KeyboardInterrupt:
    print("\n Stopped")
