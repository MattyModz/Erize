"use client";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------
 * 1) ProkaryoteModel: Loads the GLTF scene & handles loading state
 * ----------------------------------------------------------------*/
interface ProkaryoteModelProps {
  onLoaded: () => void;
  onNodeClick: (position: THREE.Vector3, name: string) => void;
}

const ProkaryoteModel: React.FC<ProkaryoteModelProps> = ({
  onLoaded,
  onNodeClick,
}) => {
  const { scene } = useGLTF("/scene.gltf", true); // ✅ Triggers `onLoaded` when model loads

  React.useEffect(() => {
    if (scene) {
      onLoaded();
    }
  }, [scene, onLoaded]);

  const handlePointerDown = (e: THREE.Event & { object: THREE.Mesh }): void => {
    (e as unknown as React.MouseEvent).stopPropagation();
    const pos = new THREE.Vector3();
    e.object.getWorldPosition(pos);
    onNodeClick(pos, e.object.name);
  };

  return <primitive object={scene} onPointerDown={handlePointerDown} />;
};

/* ------------------------------------------------------------------
 * 2) Scene: Main component with loading state
 * ----------------------------------------------------------------*/
const Scene: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedDesc, setSelectedDesc] = useState<string | null>(null);

  // When a part is clicked, update selection
  const handleFocusOnNode = (nodePosition: THREE.Vector3, nodeName: string) => {
    setSelectedPart(nodeName);
    setSelectedDesc(
      `Description of ${nodeName}`, // Replace with your actual descriptions
    );
  };

  return (
    <>
      {/* ✅ Show Loading Screen While Model Loads */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <img
            src="/logo.png"
            alt="Loading..."
            className="h-24 w-24 animate-spin"
          />
        </div>
      )}

      {/* 3D Canvas */}
      <div style={{ position: "relative", width: "100%", height: "100vh" }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          {/* ✅ Pass `setLoading(false)` when model is fully loaded */}
          <ProkaryoteModel
            onLoaded={() => setLoading(false)}
            onNodeClick={handleFocusOnNode}
          />

          {/* 🎯 Enable free camera movement */}
          <OrbitControls
            enablePan
            enableRotate
            enableZoom
            minDistance={2}
            maxDistance={10}
          />
        </Canvas>

        {/* Bottom Info Panel */}
        {selectedPart && (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              transform: "translateY(0%)",
              transition: "transform 0.3s ease-in-out",
              background: "#fff",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
              padding: "20px",
              maxHeight: "40%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Drag Handle */}
            <div
              style={{
                width: "50px",
                height: "5px",
                backgroundColor: "#ccc",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            />

            <h3 style={{ margin: "0 0 10px" }}>{selectedPart}</h3>
            <p style={{ margin: 0, textAlign: "center" }}>{selectedDesc}</p>
            <button
              style={{
                marginTop: "20px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0070f3",
                color: "#fff",
                cursor: "pointer",
                border: "none",
              }}
              onClick={() => {
                setSelectedPart(null);
                setSelectedDesc(null);
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Scene;
