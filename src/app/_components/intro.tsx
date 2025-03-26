"use client";
import { useState } from "react";
import Scene from "../_components/scene";

export default function Intro() {
  const [showModel, setShowModel] = useState(false);

  const handleToggleModel = () => {
    setShowModel((prev) => !prev);
  };

  return (
    <main className="mx-auto flex h-screen flex-col items-center justify-center">
      <button
        onClick={handleToggleModel}
        className="rounded-full bg-green-400 px-6 py-3 text-white hover:bg-green-700"
      >
        {showModel ? "Hide 3d Model" : "Show 3d Model"}
      </button>
      {showModel && <Scene />}
    </main>
  );
}
