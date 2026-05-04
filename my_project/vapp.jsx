import { useState, useRef } from "react";

function App() {
  const [status, setStatus] = useState("Idle");
  const [result, setResult] = useState("—");
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const emotionBufferRef = useRef([]);

  const TARGET_SR = 22050; // backend expected sample rate

  const startRecording = async () => {
    setStatus("Listening 🎙️");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext(); // Use default sample rate
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);

    analyserRef.current = audioContext.createAnalyser();
    analyserRef.current.fftSize = 2048;
    source.connect(analyserRef.current);

    drawWaveform();

    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    let pcmBuffer = [];

    processor.onaudioprocess = async (e) => {
      const input = e.inputBuffer.getChannelData(0);
      pcmBuffer.push(...input);

      // Predict every ~1 second
      if (pcmBuffer.length >= audioContext.sampleRate) {
        let samples = [...pcmBuffer.slice(0, audioContext.sampleRate)];
        pcmBuffer = [];

        // 🔁 Downsample if needed
        const factor = Math.floor(audioContext.sampleRate / TARGET_SR);
        if (factor > 1) {
          samples = samples.filter((_, i) => i % factor === 0);
        }
        
        console.log("Sending to backend:", {
          samples: samples.slice(0,10), // first 10 for sanity
          sample_rate: parseInt(TARGET_SR)
        });


        try {
          const body = {
            samples: samples.map(x => Number(x)), // ensure floats
            sample_rate: parseInt(TARGET_SR)      // ensure integer
          };

          const res = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });


          const data = await res.json();
          if (!data.emotion || data.confidence < 0.5) {
            emotionBufferRef.current = [];
            return;
          }

          // 🧠 Emotion smoothing
          emotionBufferRef.current.push(data.emotion);
          if (emotionBufferRef.current.length > 5)
            emotionBufferRef.current.shift();

          const counts = {};
          emotionBufferRef.current.forEach(
            e => (counts[e] = (counts[e] || 0) + 1)
          );

          const smoothEmotion = Object.keys(counts)
            .reduce((a, b) => counts[a] > counts[b] ? a : b);

          setResult(
            `${smoothEmotion.toUpperCase()} (${(data.confidence * 100).toFixed(1)}%)`
          );

        } catch (err) {
          console.error(err);
        }
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);
  };

  const stopRecording = () => {
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    setStatus("Idle");
    emotionBufferRef.current = [];
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    const dataArray = new Uint8Array(analyser.fftSize);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 2;
      ctx.beginPath();

      let x = 0;
      const sliceWidth = canvas.width / dataArray.length;

      for (let i = 0; i < dataArray.length; i++) {
        const y = (dataArray[i] / 128.0) * canvas.height / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.stroke();
    };

    draw();
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Live Emotion Detection 🎧</h1>

      <button onClick={startRecording} disabled={status !== "Idle"}>
        Start
      </button>
      <button onClick={stopRecording} disabled={status === "Idle"}>
        Stop
      </button>

      <p>Status: {status}</p>
      <h2>{result}</h2>

      <canvas
        ref={canvasRef}
        width={600}
        height={150}
        style={{ background: "#111", marginTop: 20 }}
      />
    </div>
  );
}

export default App;
