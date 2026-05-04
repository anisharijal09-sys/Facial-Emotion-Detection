import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";


const LoginRegisterGlassSlow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  const closePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 700); // match the duration-700 transition
  };

  const toggleForm = () => setIsRegister(!isRegister);

  const handleLogin = async (e) => {
  e.preventDefault();

  const email = e.target.Email.value;
  const password = e.target.Password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/fake-backend"); // pretend backend success
  } catch (error) {
    alert(error.message);
  }
};


  const handleRegister = async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registration successful 🎉 Please login");
    setIsRegister(false);
  } catch (error) {
    alert(error.message);
  }
};

const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden">

      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="src/assets/Video1.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

      {/* Trigger Button with Neon Glass & Pulse */}
      <button
        onClick={openPopup}
        className="relative z-10 px-12 py-4 text-white font-bold text-xl rounded-xl 
                   bg-white/20 backdrop-blur-md border border-white/30 shadow-lg
                   hover:bg-white/30 hover:scale-110 hover:shadow-2xl
                   animate-[pulse-slow_2.5s_ease-in-out_infinite]
                   before:absolute before:inset-0 before:rounded-xl
                   before:bg-gradient-to-r before:from-purple-500 before:to-pink-500
                   before:blur-2xl before:opacity-60 before:-z-10
                   transition-transform duration-500"
      >
        {isRegister ? "Register" : "Login"}
      </button>

      {/* Glass Panel */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className={`relative bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl w-96 p-8 border border-white/30 transform transition-all duration-700
              ${isClosing ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-white text-2xl font-bold"
            >
              ✖
            </button>

            {/* Login Form */}
            {!isRegister && (
              <>
                <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4 text-white">
                  <div className="relative">
                    <input
                      type="email"
                      name="Email"
                      required
                      className="w-full border-b-2 border-white/50 bg-transparent outline-none py-2 pr-10 placeholder-white/70 focus:border-blue-400"
                      placeholder="Email"
                    />
                    <span className="absolute right-2 top-2 text-white/70">📧</span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      name="Password"
                      required
                      className="w-full border-b-2 border-white/50 bg-transparent outline-none py-2 pr-10 placeholder-white/70 focus:border-blue-400"
                      placeholder="Password"
                    />
                    <span className="absolute right-2 top-2 text-white/70">🔒</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-1 accent-blue-400" /> Remember me
                    </label>
                    <a href="#" className="hover:underline">Forgot Password?</a>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition">
                    Login
                  </button>
                  <p className="text-center mt-4 text-white/80">
                    Don't have an account?{" "}
                    <span onClick={toggleForm} className="text-blue-400 font-semibold cursor-pointer hover:underline">
                      Register
                    </span>
                  </p>
                </form>
              </>
            )}

            {/* Register Form */}
            {isRegister && (
              <>
                <h2 className="text-2xl font-bold text-center text-white mb-6">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4 text-white">
                  <div className="relative">
                    <input
                      type="text"
                      name="Username"
                      required
                      className="w-full border-b-2 border-white/50 bg-transparent outline-none py-2 pr-10 placeholder-white/70 focus:border-green-400"
                      placeholder="Username"
                    />
                    <span className="absolute right-2 top-2 text-white/70">👤</span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full border-b-2 border-white/50 bg-transparent outline-none py-2 pr-10 placeholder-white/70 focus:border-green-400"
                      placeholder="Email"
                    />
                    <span className="absolute right-2 top-2 text-white/70">📧</span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full border-b-2 border-white/50 bg-transparent outline-none py-2 pr-10 placeholder-white/70 focus:border-green-400"
                      placeholder="Password"
                    />
                    <span className="absolute right-2 top-2 text-white/70">🔒</span>
                  </div>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-1 accent-green-400" /> I agree to the terms & conditions
                  </label>
                  <button type="submit" className="w-full bg-green-600 py-2 rounded-lg hover:bg-green-700 transition">
                    Register
                  </button>
                  <p className="text-center mt-4 text-white/80">
                    Already have an account?{" "}
                    <span onClick={toggleForm} className="text-green-400 font-semibold cursor-pointer hover:underline">
                      Login
                    </span>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pulse Animation Keyframes */}
      <style>
        {`
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(255,255,255,0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(255,255,255,0.6); }
          }
        `}
      </style>
    </div>
  );
};

export default LoginRegisterGlassSlow;

