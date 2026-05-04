import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";

/* ---------------- CONFIG ---------------- */
const CONFIDENCE_THRESHOLD = 0.3;
const DETECTION_INTERVAL = 1000;

const FakeBackend = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [emotion, setEmotion] = useState(null);
  const [loadingEmotion, setLoadingEmotion] = useState(false);
  const intervalRef = useRef(null);
const offscreenRef = useRef(null);


const audioContextRef = useRef(null);
const mediaStreamRef = useRef(null);
const processorRef = useRef(null);
const pcmBufferRef = useRef([]);
const [audioEmotion, setAudioEmotion] = useState(null);
const getFinalEmotion = () => {
  if (!emotion && !audioEmotion) return "Detecting...";

  if (emotion && !audioEmotion) return emotion.label;
  if (!emotion && audioEmotion) return audioEmotion.label;

  const faceWeight = 0.6;
  const audioWeight = 0.4;

  const faceScore = emotion.confidence * faceWeight;
  const audioScore = audioEmotion.confidence * audioWeight;

  return faceScore > audioScore
    ? emotion.label
    : audioEmotion.label;
};
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 💙 I’m here to listen. How are you feeling right now?" },
  ]);
  const [input, setInput] = useState("");

  /* ---------------- REFS FOR STABILITY ---------------- */
    const lastBoxesRef = useRef([]);
    const lastCallTimeRef = useRef(0);
    const lastEmotionRef = useRef(null);
    const stableCountRef = useRef(0);

  /* ---------------- AUDIO ---------------- */
  const startAudioRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();

    audioContextRef.current = audioContext;
    mediaStreamRef.current = stream;

    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    processorRef.current = processor;

    processor.onaudioprocess = async (e) => {
      const input = e.inputBuffer.getChannelData(0);
      pcmBufferRef.current.push(...input);

      const TARGET_SR = audioContext.sampleRate;

      if (pcmBufferRef.current.length < TARGET_SR * 5) return;

      let samples = pcmBufferRef.current.slice(0, TARGET_SR * 5);
      pcmBufferRef.current = pcmBufferRef.current.slice(TARGET_SR * 2);

      try {
        const res = await axios.post("http://127.0.0.1:8000/predict/audio", {
          samples,
          sample_rate: TARGET_SR,
        });

        if (res.data?.emotion) {
          
            setAudioEmotion({
  label: res.data.emotion,
  confidence: res.data.confidence
});
          
        }
      } catch (err) {
        console.error("Audio error:", err.message);
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);
  };

  const stopAudioRecording = () => {
    if (processorRef.current) processorRef.current.disconnect();
    if (mediaStreamRef.current)
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();

    pcmBufferRef.current = [];
  };

  /* ---------------- CAMERA ---------------- */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();

        // ✅ FIX: canvas size
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        startDetectionLoop();
        startAudioRecording();
      };

    } catch (err) {
  console.error("Camera error:", err);
  alert("Camera/Microphone permission denied OR not working");
}
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      videoRef.current.srcObject = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    stopAudioRecording();
  };

  /* ---------------- CAPTURE ---------------- */
  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return null;

    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement("canvas");
    }

    const oc = offscreenRef.current;
    oc.width = video.videoWidth;
    oc.height = video.videoHeight;

    const ctx = oc.getContext("2d");
    ctx.drawImage(video, 0, 0);

    return oc.toDataURL("image/jpeg");
  };

  /* ---------------- DRAW ---------------- */
  const drawBoxes = (boxes) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const video = videoRef.current;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ✅ SCALE FACTOR
  const scaleX = canvas.width / video.videoWidth;
  const scaleY = canvas.height / video.videoHeight;

  boxes.forEach(box => {
    let [x1, y1, x2, y2] = box.bbox;

    // ✅ APPLY SCALING
    x1 *= scaleX;
    y1 *= scaleY;
    x2 *= scaleX;
    y2 *= scaleY;

    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    ctx.fillStyle = "lime";
    ctx.font = "16px Arial";
    ctx.fillText(
      `${box.label} ${(box.confidence * 100).toFixed(1)}%`,
      x1,
      y1 - 5
    );
  });
};

  /* ---------------- DETECTION ---------------- */
  const detectEmotion = async () => {
    const now = Date.now();

    if (now - lastCallTimeRef.current < DETECTION_INTERVAL) return;
    lastCallTimeRef.current = now;

    if (!videoRef.current || videoRef.current.readyState !== 4) return;

    const image = captureImage();
    if (!image) return;

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", { image });

      const data = res.data;
      console.log("IMAGE:", data);

      let boxes = data.boxes || [];
      boxes = boxes.filter(b => b.confidence >= CONFIDENCE_THRESHOLD);
      console.log("BOXES:", boxes);

      if (boxes.length > 0) {
        drawBoxes(boxes);

        const detectedEmotion = boxes[0].label;

        if (detectedEmotion === lastEmotionRef.current) {
          stableCountRef.current++;
        } else {
           lastEmotionRef.current = detectedEmotion;
  
          stableCountRef.current = 1;
        }

        if (stableCountRef.current >= 2) {
          // lastEmotionRef.current = detectedEmotion;
          setEmotion({
  label: detectedEmotion,
  confidence: boxes[0].confidence});
        }

      } else {
        drawBoxes([]);
      }

    } catch (err) {
      console.error("AI Error:", err.message);
    }
  };

  const startDetectionLoop = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      detectEmotion();
    }, 1500);
  };
  useEffect(() => {
  console.log("FakeBackend loaded");
  // startCamera();
}, []);
/* ---------------- chat ---------------- */

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

      <div className="w-full max-w-6xl h-[90vh] flex gap-6">

        {/* CAMERA */}
        <div className="flex-1 bg-white/20 backdrop-blur-lg rounded-3xl p-6 flex flex-col relative">
          <h2 className="text-white text-xl font-bold mb-4">Live Camera</h2>

          <div className="relative flex-1">
            <video
              ref={videoRef}
              muted
              playsInline
              className="w-full h-full bg-black rounded-xl border-4 border-green-400 object-contain"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          </div>

          <div className="flex gap-4 mt-4 justify-center">
            <button onClick={startCamera} className="px-4 py-2 bg-green-500 text-white rounded-lg">Start</button>
            <button onClick={stopCamera} className="px-4 py-2 bg-red-500 text-white rounded-lg">Stop</button>
          </div>

          <div className="mt-3 text-center">
            <span className="px-4 py-1 bg-black/40 text-white rounded-full text-sm">
              Image Emotion: {emotion ? `${emotion.label} (${(emotion.confidence * 100).toFixed(1)}%)` : "Detecting..."}
            </span>
          </div>

          <div className="mt-2 text-center">
            <span className="px-4 py-1 bg-black/40 text-white rounded-full text-sm">
              Audio Emotion: {audioEmotion ? `${audioEmotion.label} (${(audioEmotion.confidence * 100).toFixed(1)}%)` : "Listening..."}
            </span>
          </div>
          <div className="mt-3 text-center">
  <span className="px-4 py-2 bg-green-600 text-white rounded-full text-lg font-bold">
    Final Emotion: {getFinalEmotion()}
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
            <button 
  onClick={handleSend}
  className="px-4 py-2 bg-green-500 text-white rounded-lg">
  Send
</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FakeBackend;