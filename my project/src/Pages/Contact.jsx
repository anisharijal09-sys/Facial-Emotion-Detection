import React from "react";
import anisha from "../assets/anisha.jpeg";
import matina from "../assets/matina.jpg";
import aarya from "../assets/aarya.jpeg";
import nandika from "../assets/nandika.jpg";
import videoBg from "../assets/Video1.mp4"; // your video path
const Contact = () => {
  const contacts = [
    {
      name: "Nandika Rana",
      img: nandika,
      email: "nandikarana9898@gmail.com",
      instagram: "@nandikarana",
      instaLink: "https://www.instagram.com/nandika.rana",
    },
    {name: "Anisha Rijal",
      img: anisha,
      email: "anisharijal09@gmail.com",
      instagram: "@anisha.rij",
      instaLink: "https://www.instagram.com/anisha.rij",
      
    },
    {
      name: "Aarya Maghaia",
      img: aarya,
      email: "aaryamaghaia11@gmail.com",
      instagram: "@aaryyaa",
      instaLink: "https://www.instagram.com/__aaryyaa__",
    },
    {name: "Matina Rajkarnikar",
      img: matina,
      email: "matinarajkarnikar2024@gmail.com",
      instagram: "@rajkarnikar_matina",
      instaLink: "https://www.instagram.com/rajkarnikar_matina",
      
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoBg} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Centered Glass Panel */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div
          className="
            max-w-6xl w-full
            bg-white/20 backdrop-blur-md
            border border-white/20
            rounded-2xl p-10
            shadow-[0_0_40px_rgba(0,255,200,0.15)]
            flex flex-row justify-evenly
          "
        >
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-4 bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg min-w-[200px] transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <img
                src={contact.img}
                alt={contact.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="flex flex-col items-center gap-2 text-center text-white">
                <i className="fa fa-envelope text-xl text-white"></i>
                <span>{contact.email}</span>
                <i className="fa-brands fa-instagram text-xl text-white"></i>
                <a
                  href={contact.instaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-pink-500 transition-colors"
                >
                  {contact.instagram}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;