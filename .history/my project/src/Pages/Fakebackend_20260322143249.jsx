import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
/* ---------------- CONFIG ---------------- */
const CONFIDENCE_THRESHOLD = 0.6;
const DETECTION_INTERVAL = 1000;

const FakeBackend = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [emotion, setEmotion] = useState(null);
  const [loadingEmotion, setLoadingEmotion] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 💙 I’m here to listen. How are you feeling right now?" },
  ]);
  const [input, setInput] = useState("");

  /* ---------------- REFS FOR STABILITY ---------------- */
    const lastBoxesRef = useRef([]);
    const lastCallTimeRef = useRef(0);
    const lastEmotionRef = useRef(null);
    const stableCountRef = useRef(0);
  

  /* ---------------- CAMERA ---------------- */
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    videoRef.current.srcObject = stream;

    videoRef.current.onloadedmetadata = () => {
      videoRef.current.play();

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
    };
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  
   /* ---------------- LOGOUT ---------------- */
    const handleLogout = () => {
      stopCamera();
      auth.signOut().then(() => navigate("/prediction"));
    };

  /* ---------------- CAPTURE IMAGE ---------------- */
  const captureImage = () => {
  if (!videoRef.current || !canvasRef.current) return null;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  // Ensure video has valid dimensions
  if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) return null;

  ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg");
};
/* ---------------- SMOOTH BOXES ---------------- */
  const smoothBoxes = (newBoxes) => {
    if (!lastBoxesRef.current.length) {
      lastBoxesRef.current = newBoxes;
      return newBoxes;
    }

    return newBoxes.map((box, i) => {
      const prev = lastBoxesRef.current[i];
      if (!prev) return box;

      const smooth = (a, b) => a * 0.7 + b * 0.3;

      return {
        ...box,
        bbox: box.bbox.map((v, idx) => smooth(v, prev.bbox[idx]))
      };
    });
  };


  /* ---------------- DRAW BOUNDING BOXES ---------------- */
  const drawBoxes = (boxes) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    boxes.forEach(box => {
      const [x1, y1, x2, y2] = box.bbox;
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      ctx.fillStyle = "lime";
      ctx.font = "16px Arial";
      ctx.fillText(`${box.label} ${box.confidence}`, x1, y1 - 5);
    });
  };

  /* ---------------- EMOTION DETECTION ---------------- */
  const detectEmotion = async () => {
      const now = Date.now();
  
      if (now - lastCallTimeRef.current < DETECTION_INTERVAL) return;
      lastCallTimeRef.current = now;
  
      if (!videoRef.current) return;
  
      const image = captureImage();
  
      try {
        const res = await axios.post("http://127.0.0.1:8888/predict", { image });
  
        if (res.data) {
          let boxes = res.data.boxes || [];
  
          /* ✅ FILTER LOW CONFIDENCE */
          boxes = boxes.filter(b => b.confidence >= CONFIDENCE_THRESHOLD);
  
          if (boxes.length > 0) {
            const smoothed = smoothBoxes(boxes);
            lastBoxesRef.current = smoothed;
            drawBoxes(smoothed);
  
            const detectedEmotion = smoothed[0].label;
  
            /* ✅ STABILITY CHECK */
            if (detectedEmotion === lastEmotionRef.current) {
              stableCountRef.current++;
            } else {
              stableCountRef.current = 0;
            }
  
            if (stableCountRef.current >= 2) {
              if (detectedEmotion !== lastEmotionRef.current) {
                lastEmotionRef.current = detectedEmotion;
  
                setEmotion(detectedEmotion);
  
                setMessages(prev => [
                  ...prev,
                  { sender: "bot", text: emotionAdvice(detectedEmotion) }
                ]);
              }
            }
          } else {
            drawBoxes([]);
          }
        }
      } catch (err) {
        console.error("AI Error:", err.message);
      }
    };
  
    /* ---------------- LOOP ---------------- */
    useEffect(() => {
      let animationFrame;
  
      const loop = () => {
        detectEmotion();
        animationFrame = requestAnimationFrame(loop);
      };
  
      loop();
  
      return () => cancelAnimationFrame(animationFrame);
    }, []);
  
    /* ---------------- CHAT ---------------- */
    const handleSend = async () => {
      if (!input.trim()) return;
  
      const userText = input;
      setMessages(prev => [...prev, { sender: "user", text: userText }]);
      setInput("");
  
      try {
        const res = await axios.post("http://127.0.0.1:5000/chat", { message: userText });
        if (res.data.reply) {
          setMessages(prev => [...prev, { sender: "bot", text: res.data.reply }]);
        }
      } catch (err) {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Sorry — I couldn't respond right now 💙" }
        ]);
      }
    };
  
    
  
    /* ---------------- UI ---------------- */
    return (
      <div className="w-screen h-screen flex items-center justify-center p-6"
        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
  
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 px-4 py-2 bg-yellow-500 text-white rounded-lg">
          Log Out
        </button>
  
        <div className="w-full max-w-6xl h-[90vh] flex gap-6">
  
          {/* CAMERA */}
          <div className="flex-1 bg-white/20 backdrop-blur-lg rounded-3xl p-6 flex flex-col relative">
            <h2 className="text-white text-xl font-bold mb-4">Live Camera</h2>
  
            <div className="relative flex-1">
              <video
                ref={videoRef}
                muted
                playsInline
                className="w-full h-full bg-black rounded-xl border-4 border-green-400 object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
            </div>
  
            <div className="flex gap-4 mt-4 justify-center">
              <button onClick={startCamera} className="px-4 py-2 bg-green-500 text-white rounded-lg">Start</button>
              <button onClick={stopCamera} className="px-4 py-2 bg-red-500 text-white rounded-lg">Stop</button>
            </div>
  
            <div className="mt-3 text-center">
              <span className="px-4 py-1 bg-black/40 text-white rounded-full text-sm">
                Live Emotion: {emotion || "Detecting..."}
              </span>
            </div>
          </div>
  
          {/* CHAT */}
          <div className="w-[380px] bg-white/20 backdrop-blur-lg rounded-3xl p-6 flex flex-col">
            <h2 className="text-white text-xl font-bold mb-4">Emotional Support 💬</h2>
  
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((msg, i) => (
                <div key={i}
                  className={`p-3 rounded-xl text-sm max-w-[85%] ${
                    msg.sender === "user"
                      ? "ml-auto bg-blue-500 text-white"
                      : "mr-auto bg-gray-200 text-black"
                  }`}>
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
              <button onClick={handleSend} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                Send
              </button>
            </div>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default FakeBackend;