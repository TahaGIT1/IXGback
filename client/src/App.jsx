import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UpcomingRun from "./components/UpcomingRun";
import Gallery from "./components/Gallery";
import About from "./components/About";
import Partners from "./components/Partners";
import Merchandise from "./components/Merchandise";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import RegisterModal from "./components/RegisterModal";

function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    
    if (hash) {
      const el = document.querySelector(hash);
     
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return null;
}

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState(null);

  const handleRegister = (run) => {
    setSelectedRun(run || null);
    setIsRegisterOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterOpen(false);
    setSelectedRun(null);
  };

  const Home = () => (
    <>
      <Hero />
      <UpcomingRun onRegister={handleRegister} />
    </>
  );

  return (
    <>
      <ScrollToHash />
      <Navbar onRegister={handleRegister} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/merchandise" element={<Merchandise />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>

      <Footer />
      <Toaster />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeRegisterModal}
        runId={selectedRun?._id}
      />
    </>
  );
}

export default App;