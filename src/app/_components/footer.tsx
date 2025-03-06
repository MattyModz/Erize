"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 flex w-full flex-col items-center justify-center bg-white/30 py-6 shadow-lg backdrop-blur-lg">
      {/* Logo */}
      <img
        src="/Logo.png"
        alt="Logo"
        className="mb-3 h-12 w-12 animate-bounce"
      />

      {/* Social Links */}
      <div className="flex gap-6"></div>

      {/* Copyright */}
      <p className="mt-3 text-sm text-gray-700">
        &copy; {new Date().getFullYear()} An Erize Breeze Website 😎.
      </p>
    </footer>
  );
};

export default Footer;
