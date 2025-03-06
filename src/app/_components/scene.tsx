"use client";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------
 * 1) Mesh Properties & Descriptions
 * ----------------------------------------------------------------*/
interface MeshProperties {
  visible: boolean;
  texture?: string;
}

// ✅ Hide extra flagella, keeping only one visible
const meshLookup: Record<string, MeshProperties> = {
  Prokaryotes_Prokaryotes_0: { visible: true },
  cytoplasm_001_cytoplasm_001_0: { visible: true },
  cell_wall_cell_wall_0: { visible: true },
  plasma_membrane_plasma_membrane_0: { visible: true },

  // ✅ Keep only one flagellum visible (for cholera bacteria)
  flagellum_001_flagellum_001_0: { visible: true },
  flagellum_002_flagellum_002_0: { visible: false },
  flagellum_003_flagellum_003_0: { visible: false },
  flagellum_004_flagellum_004_0: { visible: false },

  pili_pili_0: { visible: true },
  pili_pili_0_1: { visible: true },
  plasmid_001_plasmid_001_0: { visible: true },
  plasmid_002_plasmid_002_0: { visible: true },
  Ribosomes_Ribosomes_0: { visible: true },
  chromosome_chromosome_0: { visible: true },
};

const partDescriptions: Record<string, string> = {
  chromosome_chromosome_0:
    "The bacterial chromosome contains the essential genetic information required for cell function.",
  cell_wall_cell_wall_0:
    "The cell wall maintains the cell's shape and provides protection against external stresses.",
  flagellum_001_flagellum_001_0:
    "The single flagellum enables the cholera bacterium to move efficiently in aquatic environments.",
  pili_pili_0:
    "Pili help the bacterium attach to surfaces and exchange genetic material.",
};

/* ------------------------------------------------------------------
 * 2) ProkaryoteModel: Loads the GLTF scene & applies visibility settings
 * ----------------------------------------------------------------*/
interface ProkaryoteModelProps {
  onLoaded: () => void;
  onNodeClick: (position: THREE.Vector3, name: string) => void;
}

const ProkaryoteModel: React.FC<ProkaryoteModelProps> = ({
  onLoaded,
  onNodeClick,
}) => {
  const { scene } = useGLTF("/scene.gltf", true);

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const lookup = meshLookup[child.name];
      if (lookup) {
        child.visible = lookup.visible;
      }
    }
  });

  const handlePointerDown = (e: THREE.Event & { object: THREE.Mesh }): void => {
    (e as unknown as React.MouseEvent).stopPropagation();
    const pos = new THREE.Vector3();
    e.object.getWorldPosition(pos);
    onNodeClick(pos, e.object.name);
  };

  return <primitive object={scene} onPointerDown={handlePointerDown} />;
};

/* ------------------------------------------------------------------
 * 3) Scene: Main component with loading state inside the 3D area
 * ----------------------------------------------------------------*/
const Scene: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedDesc, setSelectedDesc] = useState<string | null>(null);

  const handleFocusOnNode = (nodePosition: THREE.Vector3, nodeName: string) => {
    setSelectedPart(nodeName);
    setSelectedDesc(partDescriptions[nodeName] ?? "No description available.");
  };

  return (
    <>
      {/* 3D Canvas with Loading State */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "80vh",
          marginTop: "10vh",
        }}
      >
        {/* ✅ Loading logo inside the model area */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <img
              src="/logo.png"
              alt="Loading..."
              className="h-24 w-24 animate-spin"
            />
          </div>
        )}

        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          {/* ✅ Model with loading state */}
          <ProkaryoteModel
            onLoaded={() => setLoading(false)}
            onNodeClick={handleFocusOnNode}
          />

          {/* ✅ Free camera movement */}
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
              maxHeight: "30%",
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
