import React from "react";
import logo from "../assets/ixglogo.png";
import { useNavigate, useLocation } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
const location = useLocation();
  

  const quickLinks = [
  { name: "Home", href: "#home", type: "scroll" },
  { name: "Runs", href: "#runs", type: "scroll" },
  { name: "Gallery", href: "/gallery", type: "route" },
  { name: "Merchandise", href: "/merchandise", type: "route" },
  { name: "Brands that ran with us", href: "/partners", type: "route" },
];
const communityLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/ixg_runclub?igsh=dnl0M2hzb25jd2x5",
  },
  {
    name: "WhatsApp",
    href: "https://chat.whatsapp.com/EX4eHkOuP9d8saoLDeCEOB",
  },
  {
    name: "Strava",
    href: "https://www.strava.com",
  },
];

 const handleLinkClick = (e, link) => {
  e.preventDefault(); // add this line, unconditionally, at the top

  if (link.type === "route") {
    navigate(link.href);
    return;
  }

  if (location.pathname !== "/") {
    navigate("/");
    setTimeout(() => {
      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return;
  }

  document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
};

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      id="footer"
      className="relative overflow-hidden bg-gray-950 px-6 pt-20 lg:px-8"
    >
      <div className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
             <img
  src={logo}
  alt="IXG Run Club Logo"
  className="h-11 w-11 rounded-xl object-cover"
/>

              <span className="text-lg font-extrabold tracking-tight text-white">
                IXG Run Club
              </span>
            </div>

            <p className="mt-4 text-sm font-medium italic text-white/50">
              Where Sport Meets Society.
            </p>

            
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
              Quick Links
            </p>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                   onClick={(e) => handleLinkClick(e, link)}
                    className="group inline-flex items-center text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    <span className="mr-0 h-px w-0 bg-blue-700 transition-all duration-200 group-hover:mr-2 group-hover:w-3" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
                    {/* Community */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
              Community
            </p>

            <ul className="mt-5 space-y-3">
              {communityLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    <span className="mr-0 h-px w-0 bg-blue-700 transition-all duration-200 group-hover:mr-2 group-hover:w-3" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">
              Contact
            </p>

            <ul className="mt-5 space-y-3">
              
              <li>
                <a
                  href="mailto:hello@ixgrunclub.com"
                  className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-white"
                >
                  <span>📞</span>
                  9113817253
                </a>
              </li>

              <li className="flex items-center gap-2 text-sm text-white/60">
                <span>🕖</span>
                Every Sunday • 7:00 AM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 sm:flex-row">
          <p className="text-center text-xs text-white/40 sm:text-left">
            © 2026 IXG Run Club. Built for the running community by Taha Sajan
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition-all duration-200 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400"
          >
            Back to Top
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}