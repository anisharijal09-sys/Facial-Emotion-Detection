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
- HTML/CSS (if frontend used)
- JavaScript (if chatbot UI exists)

---


## 📁 Project Structure

- **backend/** → FastAPI backend handling API requests and chatbot logic  
- **my_project/** → Core facial emotion detection pipeline  
- **test_model/** → Scripts for testing and evaluating model performance  
- **model/** → Pre-trained CNN model files  
- **static/** → Frontend static files (CSS, JavaScript, images)  
- **templates/** → HTML templates for web interface  
- **README.md** → Project documentation  

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Facial-Emotion-Detection.git
cd Facial-Emotion-Detection
```

---

### 2. Create Virtual environment
```bash
python -m venv venv
venv\Scripts\activate   # Windows
```
---

### 3. Intsall Dependencies
```bash
pip install -r requirements.txt
```
---
## ▶️ Running the Application

### 🔹 Run FastAPI Backend
```bash
uvicorn backend.main:app --reload
```

---

### 🔹 Run Chatbot (Python Script)
```bash
python cbapp.py
```

---

### 🔹 Run Frontend (if using Node.js)
```bash
npm install
npm run dev
```





