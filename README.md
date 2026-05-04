# 🎭 Facial Emotion Detection + Chatbot System

A deep learning-based real-time Facial Emotion Recognition system integrated with a chatbot. The system detects human emotions from facial expressions using a trained CNN model and responds intelligently through a chatbot interface.

---

## 🚀 Features

- 🎥 Real-time facial emotion detection using webcam  
- 🧠 CNN-based deep learning model for emotion classification  
- 💬 Integrated chatbot for interactive responses  
- ⚡ FastAPI backend served using Uvicorn  
- 📊 Detects multiple emotions (Happy, Sad, Angry, Neutral, etc.)  
- 🌐 Modular structure for backend, model, and testing  

---

## 🛠️ Tech Stack

- Python 🐍  
- TensorFlow / Keras 🤖  
- OpenCV 👁️  
- FastAPI ⚡  
- Uvicorn 🚀  
- NumPy  
- HTML/CSS  
- JavaScript  

---

## 📁 Project Structure

- backend/ → FastAPI backend  
- my_project/ → Emotion detection pipeline  
- test_model/ → Model testing scripts  
- model/ → Trained CNN model  
- static/ → CSS, JS, images  
- templates/ → HTML files  
- README.md → Documentation  

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Facial-Emotion-Detection.git
cd Facial-Emotion-Detection
```

### 2. Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate   # Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Application

### 🔹 Run FastAPI Backend
```bash
uvicorn backend.main:app --reload
```

### 🔹 Run Chatbot
```bash
python cbapp.py
```

### 🔹 Run Frontend (if applicable)
```bash
npm install
npm run dev
```

---

## 🧪 Run Order

1. Start backend  
2. Run chatbot  
3. Start frontend (optional)  
