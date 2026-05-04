import React from 'react'
import LoginRegister from '../components/loginregister'

const Prediction = () => {
  return (
    <div>
      <LoginRegister />
    </div>
  )
}

export default Prediction
// import React, { useState } from "react";
// import Camera from "../components/Camera";

// const Prediction = () => {
//   const [emotion, setEmotion] = useState("None");

//   const handleFrame = async (base64Image) => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ image: base64Image }),
//       });
//       const data = await response.json();
//       if (data.emotion) setEmotion(data.emotion);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Detected Emotion: {emotion}</h2>
//       <Camera onFrameCapture={handleFrame} />
//     </div>
//   );
// };

// export default Prediction;
