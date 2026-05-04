import React from "react";
import { motion } from "framer-motion";

import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpeg";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const imageAnim = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1 },
  },
};

const glass =
  "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-10 break-words leading-relaxed";

const Aboutus = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="src/assets/Video1.mp4" type="video/mp4" />
      </video>

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-10"></div>

      {/* Page Content */}
      <div className="relative z-20 text-white">
        <div className="mt-50 flex"></div>

        {/* Section 1 */}
            <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto w-[60vw] max-w-[1000px] min-h-[260px]
             bg-white/10 backdrop-blur-xl border border-white/20
             rounded-2xl shadow-2xl p-10 break-words leading-relaxed text-center"
>
             <h1 className="text-5xl font-bold">
             What is Emotion Detection?
             </h1>

              <h2 className="mt-6 text-justify">
              Emotion detection is a field of artificial intelligence 
              focused on identifying human emotional states through observable behavioral signals. 
              Our system analyzes facial expressions and speech patterns together to improve accuracy and reliability, 
              recognizing that emotions are often expressed through multiple channels simultaneously.

              Beyond just recognizing emotions, our platform offers real-time emotion detection, allowing immediate understanding of a person’s emotional state as it happens. Additionally, we provide an interactive chatbot designed to support mental well-being—offering stress relief, coping advice, and emotional guidance when sadness or anxiety is detected. By combining advanced AI with real-time responses and empathetic interaction, our system aims to not only detect emotions but also help users manage and improve their emotional health effectively.

              </h2>
             </motion.div>



        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent my-20"></div>

        {/* Section 2 */}
        <div className="flex justify-between mt-60">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`w-130 translate-x-30 min-h-[320px] ${glass}`}
          >
            <h1 className="text-5xl font-bold">
              The Value Of Detecting <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                EMOTIONS
              </span>
            </h1>

            <h2 className="mt-8 text-justify">
              In today’s fast-paced world, being aware of one’s emotions is crucial for mental health and overall well-being. Emotion detection helps identify stress, sadness, or anxiety early, providing timely insights into our emotional state. By offering personalized guidance, coping strategies, and supportive feedback, our system empowers users to manage emotions effectively, reduce stress, and build lasting emotional resilience.
            </h2>
          </motion.div>

          <motion.div
            variants={imageAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-150 -translate-x-22 -translate-y-15"
          >
            <img
              src={image1}
              className="rounded-md transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
              alt=""
            />
          </motion.div>
        </div>

        {/* Section 3 */}
        <div className="w-320 flex mt-10">
          <motion.div
            variants={imageAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-60 px-40 w-400"
          >
            <img
              src={image2}
              className="rounded-md h-100 w-200 -translate-y-20 transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
              alt=""
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`mt-60 w-300 min-h-[320px] -translate-y-3 ${glass}`}
          >
            <h1 className="text-5xl font-bold">Classifying Emotions.</h1>

            <h2 className="mt-8 text-justify">
              Emotion recognition analyzes both how something is said and how it is expressed visually. In speech-based detection, key acoustic features such as pitch, energy, speech rate, and Mel-Frequency Cepstral Coefficients (MFCCs) capture emotional variations in the voice. Simultaneously, facial expression analysis processes images or video frames to detect subtle cues using facial landmarks, muscle movements, and micro-expressions. By combining these modalities, deep learning models—such as LSTMs for temporal audio patterns and CNNs for spatial facial features—can classify emotions with high precision, providing a more accurate and holistic understanding of a person’s emotional state.
            </h2>
          </motion.div>
        </div>

        {/* Section 4 */}
        <div className="mt-120 flex">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`w-120 translate-x-40 min-h-[300px] ${glass}`}
          >
            <h1 className="text-5xl font-bold">Future Uses</h1>

            <h2 className="mt-8 text-justify">
             Multimodal emotion recognition will enable technologies that truly understand human feelings. Future applications include personal mental health support, adaptive learning, empathetic virtual assistants, smarter customer service, and immersive gaming. By combining speech and facial cues, these systems can enhance well-being, improve interactions, and respond with greater empathy.

            </h2>
          </motion.div>

          <motion.div
            variants={imageAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-150"
          >
            <img
              src={image3}
              className="rounded-md h-80 w-140 translate-x-80 -translate-y-8 transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
              alt=""
            />
          </motion.div>
        </div>

        {/* Section 5 */}
        <div className="flex mt-80">
          <motion.div
            variants={imageAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <img
              src={image4}
              className="h-80 w-140 translate-x-40 transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
              alt=""
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`w-120 translate-x-70 min-h-[300px] ${glass}`}
          >
            <h1 className="text-5xl font-bold">Object Size</h1>

            <h2 className="mt-8 text-justify">
              Emotion detection performance is influenced by factors such as subject distance,
              camera resolution, and environmental conditions. Detecting smaller or distant
              faces presents additional challenges but allows the system to operate with
              cost-effective hardware.

              Our approach supports experimentation with multiple models to balance accuracy,
              efficiency, and real-world deployment constraints.

            </h2>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
