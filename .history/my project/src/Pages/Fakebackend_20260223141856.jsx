import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";

const FakeBackend = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  /* ---------------- STATES ---------------- */
  const [emotion, setEmotion] = useState(null);
  const [loadingEmotion, setLoadingEmotion] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 💙 I’m here to listen. How are you feeling right now?",
    },
  ]);
  const [input, setInput] = useState("");

  /* ---------------- CAMERA ---------------- */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      videoRef.current.srcObject = null;
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    auth.signOut().then(() => navigate("/prediction"));
  };

  /* ---------------- CAPTURE IMAGE ---------------- */
  const captureImage = () => {
    if (!videoRef.current) return null;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    return canvas.toDataURL("image/jpeg");
  };

  /* ---------------- EMOTION ADVICE ---------------- */
  const emotionAdvice = (emo) => {
    switch (emo) {
      case "Sad":
        return "I sense sadness 💙. You don’t have to go through it alone. Want to talk about what’s been bothering you?";
      case "Angry":
        return "I notice some anger. Let’s slow down for a second — what triggered this feeling?";
      case "Fear":
        return "You may be feeling anxious. Try grounding yourself by noticing your breathing. What’s worrying you most?";
      case "Happy":
        return "You look happy 😊. That’s wonderful — what made you feel this way?";
      case "Surprise":
        return "That looks unexpected 😮. Do you want to tell me what just happened?";
      case "Neutral":
        return "I’m here with you 💙. How are you feeling emotionally right now?";
      default:
        return "I’m here to listen 💭. What’s on your mind?";
    }
  };

  /* ---------------- EMOTION DETECTION ---------------- */
  const detectEmotion = async () => {
    // If we are already loading or camera is off, don't do anything
    if (loadingEmotion || !streamRef.current || !videoRef.current) return;

    const image = captureImage();
    if (!image) return;

    try {
      setLoadingEmotion(true);
     // OLD: "http://127.0.0.1:8000/predict"
      // NEW: Use the proxy path
    const res = await axios.post(
  "/api/predict", // This matches the proxy in vite.config.js
  { image },
  { timeout: 30000 } 
);

      if (res.data && res.data.emotion) {
        const detectedEmotion = res.data.emotion;
        
        // Only update if it's a new emotion to avoid chat spam
        if (detectedEmotion !== emotion) {
          setEmotion(detectedEmotion);
          
          setMessages(prev => [
            ...prev,
            {
              sender: "bot",
              text: emotionAdvice(detectedEmotion),
            },
          ]);
        }
      }
    } catch (err) {
      // Log the specific error to the console so we can see if it's CORS or something else
      console.error("AI Error:", err.response?.data || err.message);
    } finally {
      setLoadingEmotion(false);
    }
  };
  /* ---------------- REAL-TIME LOOP ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      detectEmotion();
    }, 1500); // ✅ real-time interval

    return () => clearInterval(interval);
  }, [emotion, loadingEmotion]);

  /* ---------------- CHAT SEND ---------------- */
  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    setInput("");
  };

  /* ---------------- UI ---------------- */
  return (
    <div
      className="w-screen h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
    >
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 px-4 py-2 bg-yellow-500 text-white rounded-lg"
      >
        Log Out
      </button>

      <div className="w-full max-w-6xl h-[90vh] flex gap-6">
        {/* CAMERA PANEL */}
        <div className="flex-1 bg-white/20 backdrop-blur-lg rounded-3xl p-6 flex flex-col">
          <h2 className="text-white text-xl font-bold mb-4">Live Camera</h2>

          <video
            ref={videoRef}
            muted
            playsInline
            className="flex-1 bg-black rounded-xl border-4 border-green-400"
          />

          <div className="flex gap-4 mt-4 justify-center">
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Start
            </button>

            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Stop
            </button>
          </div>

          <div className="mt-3 text-center">
            <span className="px-4 py-1 bg-black/40 text-white rounded-full text-sm">
              Live Emotion: {emotion || "Detecting..."}
            </span>
          </div>
        </div>

        {/* CHAT PANEL */}
        <div className="w-[380px] bg-white/20 backdrop-blur-lg rounded-3xl p-6 flex flex-col">
          <h2 className="text-white text-xl font-bold mb-4">
            Emotional Support 💬
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-sm max-w-[85%] ${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type how you feel..."
              className="flex-1 px-3 py-2 rounded-lg outline-none"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeBackend;
