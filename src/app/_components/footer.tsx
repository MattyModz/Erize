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
      <div className="flex gap-6">
        <a href="#" className="text-gray-800 transition hover:text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 2h-3a6 6 0 00-6 6v3H6v4h3v8h4v-8h3l1-4h-4V8a2 2 0 012-2h2V2z"
            />
          </svg>
        </a>
        <a href="#" className="text-gray-800 transition hover:text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M23 3a10.9 10.9 0 01-3.14 1A4.48 4.48 0 0012 7v1a10.66 10.66 0 01-9.5-5S1 6 2 8a4.48 4.48 0 01-2-2s0 6 6 8a12.64 12.64 0 01-7 2c8 5 17 2 17-10v-1A7.72 7.72 0 0023 3z"
            />
          </svg>
        </a>
        <a href="#" className="text-gray-800 transition hover:text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM9 19H6V9h3v10zm-1.5-11.3a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM20 19h-3v-5.3c0-3-3-2.7-3 0V19h-3V9h3v1.6c1.3-2.3 6-2.5 6 2.2V19z"
            />
          </svg>
        </a>
      </div>

      {/* Copyright */}
      <p className="mt-3 text-sm text-gray-700">
        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
