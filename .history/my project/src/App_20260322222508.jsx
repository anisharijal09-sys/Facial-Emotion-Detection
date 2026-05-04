import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Contact from "./Pages/Contact";
import Aboutus from "./Pages/Aboutus";
import Prediciton from "./Pages/Prediction";
import Navbar from "./components/Navbar";
import LoginRegisterGlassSlow from "./components/loginregister.jsx";
import FakeBackend from "./Pages/Fakebackend";

const App = () => {
  return (
    <BrowserRouter> {/* ✅ Wrap everything in BrowserRouter */}
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Aboutus" element={<Aboutus />} />
          <Route path="/Prediction" element={<Prediciton />} />
          <Route path="/login" element={<LoginRegisterGlassSlow />} />
          <Route path="/fake-backend" element={<FakeBackend />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;