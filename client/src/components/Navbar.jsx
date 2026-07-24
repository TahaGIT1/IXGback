import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/ixglogo.png";

export default function Navbar({ onRegister }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Runs", to: "/#runs" },
    { name: "Gallery", to: "/gallery" },
    { name: "About", to: "/about" },
    { name: "Merch", to: "/merchandise" },
    { name: "Collaborations", to: "/partners" },
    { name: "FAQ", to: "/faq" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img
            src={logo}
            alt="IXG Run Club Logo"
            className="h-11 w-11 rounded-xl"
          />
          <span className="text-lg font-extrabold tracking-tight text-black">
            IXG Run Club
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="text-sm font-medium text-black transition hover:text-black"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-gray-800 hover:text-white hover:shadow-lg hover:shadow-black/20"
          >
            Admin Login
          </Link>

          <button
            type="button"
            onClick={onRegister}
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black/20"
          >
            Join Next Run
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          )}
        </button>
      </nav>

      <div
        className={`overflow-hidden bg-white shadow-lg transition-all duration-300 ease-in-out lg:hidden ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={closeMenu}
              className="rounded-md px-3 py-2.5 text-base font-medium text-gray-800 transition hover:bg-gray-100"
            >
              {link.name}
            </Link>
          ))}

          <Link
            to="/login"
            onClick={closeMenu}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Admin Login
          </Link>

          <button
            type="button"
            onClick={() => {
              closeMenu();
              onRegister();
            }}
            className="mt-3 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Join Next Run
          </button>
        </div>
      </div>
    </header>
  );
}