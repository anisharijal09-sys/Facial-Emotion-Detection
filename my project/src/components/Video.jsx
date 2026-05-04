// // import  { useEffect, useRef }from "react";
// // import { gsap } from "gsap";
// // const Video = () => {
// //   const textRef = useRef([]);

// //   useEffect(() => {
// //     gsap.from(textRef.current, {
// //       x: -150,
// //       duration: 4,
// //       stagger: 0.3,
// //       ease: "power3.out",
// //     });
// //   }, []);
// //   return (
// //     <div className="relative w-full h-screen overflow-hidden">
      
     
// //       <video
// //         className="absolute top-0 left-0 w-full h-full object-cover"
// //         autoPlay
// //         loop
// //         muted
// //         playsInline
// //       >
// //         <source src="/src/assets/Video1.mp4" />
// //       </video>

     
// //       <div className="absolute inset-0 "></div>

     
// //       <div className="relative  flex flex-col    serif font-bold mt-18 translate-x-16 translate-y-8 ">
// //         {["BHAWANA:", "THE","AI", "THAT ", "SENSES","YOU"].map((word, index) => (
// //           <h1
// //             key={index}
// //             ref={(el) => (textRef.current[index] = el)}
// //             className="text-7xl text-white text-left   "
// //           >
// //             {word}
// //           </h1>
// //         ))}
// //       </div>

// //     </div>
// //   )
// // }

// // export default Video
// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";

// const Video = () => {
//   const textRef = useRef([]);

//   useEffect(() => {
//     gsap.from(textRef.current, {
//       x: -150,
//       duration: 4,
//       stagger: 0.2,
//       ease: "power3.out",
//     });
//   }, []);

//   return (
//     <div className="relative w-full h-screen overflow-hidden">
//       <video
//         className="absolute top-0 left-0 w-full h-full object-cover"
//         autoPlay
//         loop
//         muted
//         playsInline
//       >
//         <source src="/src/assets/Video1.mp4" />
//       </video>

//       <div className="relative serif font-bold translate-x-16 translate-y-52 text-white">
        
//         {/* BHAWANA */}
//         <h1
//           ref={(el) => (textRef.current[0] = el)}
//           className="text-7xl mb-6"
//         >
//           BHAWANA:
//         </h1>

//         {/* THE AI */}
//         <div className="flex gap-x-4 mb-3">
//           {["THE", "AI"].map((word, index) => (
//             <h2
//               key={index}
//               ref={(el) => (textRef.current[index + 1] = el)}
//               className="text-5xl sm:text-4xl md:text-5xl"
//             >
//               {word}
//             </h2>
//           ))}
//         </div>

//         {/* THAT SENSES YOU */}
//         <div className="flex gap-x-4">
//           {["THAT", "SENSES", "YOU"].map((word, index) => (
//             <h2
//               key={index}
//               ref={(el) => (textRef.current[index + 3] = el)}
//               className="text-3xl sm:text-4xl md:text-5xl"
//             >
//               {word}
//             </h2>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Video;
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Video = () => {
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const taglineRefs = useRef([]);

  useEffect(() => {
    gsap.from(titleRef.current, {
      y: 40,
      opacity: 0,
      duration: 1.6,
      ease: "power3.out",
    });

    gsap.from(lineRef.current, {
      scaleX: 0,
      transformOrigin: "left",
      duration: 1,
      delay: 0.4,
      ease: "power3.out",
    });

    gsap.from(taglineRefs.current, {
      y: 20,
      opacity: 0,
      stagger: 0.2,
      duration: 1.2,
      delay: 0.8,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/src/assets/Video1.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Glassmorphism Content */}
      <div className="relative z-10 h-full flex items-center justify-center">

        <div
           
                className="
                  max-w-lg           /* slightly wider than before */
                  bg-white/10 backdrop-blur-md
                  border border-white/20
                  rounded-2xl p-10   /* slightly more padding */
                  shadow-[0_0_40px_rgba(0,255,200,0.15)]"
  
                  >
          {/* Title */}
          <h1
            ref={titleRef}
            className="text-7xl font-bold uppercase tracking-widest
            bg-gradient-to-r from-cyan-400 to-violet-400
            bg-clip-text text-transparent"
          >
            BHAWANA
          </h1>

          {/* Divider */}
          <div
            ref={lineRef}
            className="w-20 h-[2px] bg-cyan-400 my-5"
          ></div>

          {/* Tagline Line 1 */}
          <div className="flex gap-3">
            {["THE", "AI"].map((word, index) => (
              <h2
                key={index}
                ref={(el) => (taglineRefs.current[index] = el)}
                className="text-3xl md:text-4xl font-semibold text-white/80"
              >
                {word}
                {word === "AI" && (
                  <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse ml-2"></span>
                )}
              </h2>
            ))}
          </div>

          {/* Tagline Line 2 */}
          <div className="flex gap-3 mt-1">
            {["THAT", "SENSES", "YOU"].map((word, index) => (
              <h2
                key={index}
                ref={(el) =>
                  (taglineRefs.current[index + 2] = el)
                }
                className="text-3xl md:text-4xl font-semibold text-white/60"
              >
                {word}
              </h2>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
