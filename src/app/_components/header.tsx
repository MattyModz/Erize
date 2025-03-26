"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed left-1/2 top-4 z-50 flex w-[90%] -translate-x-1/2 transform items-center justify-between rounded-2xl bg-white/30 px-6 py-3 shadow-lg backdrop-blur-lg md:w-[80%] lg:w-[70%]">
      {/* Logo with Animation */}
      <div className="flex items-center gap-2">
        <motion.img
          src="/Logo.png"
          alt="Logo"
          className="h-10 w-10"
          animate={{
            rotate: [0, 360], // Continuous rotation
            y: [0, -5, 0], // Bouncing effect
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <span className="text-xl font-bold text-gray-900">
          Cholera Uncovered
        </span>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden gap-6 md:flex">
        <a
          href="#"
          className="font-medium text-gray-800 transition hover:text-blue-600"
        >
          Home
        </a>
        <a
          href="#"
          className="font-medium text-gray-800 transition hover:text-blue-600"
        >
          About
        </a>
        <a
          href="#"
          className="font-medium text-gray-800 transition hover:text-blue-600"
        >
          Contact
        </a>
      </nav>

      {/* Mobile Menu Button (SVG Icons) */}
      <button
        className="text-gray-900 md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      <div
        className={`text-lg fixed inset-0 flex transform flex-col items-center justify-center gap-6 bg-black/50 text-white backdrop-blur-md transition-all duration-300 ${
          menuOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-90 opacity-0"
        }`}
      >
        <button
          className="absolute right-6 top-6"
          onClick={() => setMenuOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-10 w-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <a
          href="#"
          className="hover:text-blue-400"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </a>
        <a
          href="#"
          className="hover:text-blue-400"
          onClick={() => setMenuOpen(false)}
        >
          About
        </a>
        <a
          href="#"
          className="hover:text-blue-400"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </a>
      </div>
    </header>
  );
};

export default Header;
