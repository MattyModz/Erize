"use client";
import React, { useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------
 * 1) Mesh Properties & Descriptions
 * ----------------------------------------------------------------*/
interface MeshProperties {
  visible: boolean;
  texture?: string;
}

// If you still want to control visibility or apply textures, you can
// define them here. But we're omitting forced "color" to let the model
// keep its default colors from the GLTF file.
const meshLookup: Record<string, MeshProperties> = {
  Prokaryotes_Prokaryotes_0: {
    visible: true,

    texture: "/textures/prokaryotes.jpg",
  },
  cytoplasm_001_cytoplasm_001_0: {
    visible: true,

    texture: "/textures/cytoplasm.jpg",
  },
  cell_wall_cell_wall_0: {
    visible: true,

    texture: "/textures/cellwall.png",
  },
  plasma_membrane_plasma_membrane_0: {
    visible: true,

    texture: "/textures/plasma_membrane.png",
  },
  flagellum_003_flagellum_003_0: {
    visible: false,

    texture: "/textures/flagellum.png",
  },
  flagellum_001_flagellum_001_0: {
    visible: true,

    texture: "/textures/Flagellum__Detail_001_normal.png",
  },
  flagellum_002_flagellum_002_0: {
    visible: false,

    texture: "/textures/flagellum.png",
  },
  pili_pili_0: {
    visible: true,

    texture: "/textures/pili.png",
  },
  pili_pili_0_1: {
    visible: true,

    texture: "/textures/pili.png",
  },
  Flagellum__Detail_001_Flagellum__Detail_001_0: {
    visible: true,

    texture: "/textures/flagellum_detail.png",
  },
  Flagellum__Detail_002_Flagellum__Detail_002_0: {
    visible: false,

    texture: "/textures/flagellum_detail.png",
  },
  plasmid_001_plasmid_001_0: {
    visible: true,
    texture: "/textures/plasmid.png",
  },
  plasmid_002_plasmid_002_0: {
    visible: true,

    texture: "/textures/plasmid.png",
  },
  flagellum_004_flagellum_004_0: {
    visible: false,

    texture: "/textures/flagellum.png",
  },
  Ribosomes_Ribosomes_0: {
    visible: true,
    // light salmon for ribosomes
    texture: "/textures/ribosomes.png",
  },
  Ribosomes_Ribosomes_0_1: {
    visible: true,

    texture: "/textures/ribosomes.png",
  },
  chromosome_chromosome_0: {
    visible: true,

    texture: "/textures/chromosome.png",
  },
  cytoplasm_002_cytoplasm_002_0: {
    visible: false,

    texture: "/textures/cytoplasm.jpg",
  },
};

const partDescriptions: Record<string, string> = {
  chromosome_chromosome_0:
    "The bacterial chromosome contains the essential genetic information required for cell function.",
  cell_wall_cell_wall_0:
    "The cell wall maintains the cell's shape and provides protection against external stresses.",
  flagellum_001_flagellum_001_0:
    "The flagellum is a whip-like appendage that enables cell movement.",
  pili_pili_0:
    "Pili are fine hair-like structures that assist with adhesion and genetic exchange.",
  // Add more descriptions as needed…
};

/* ------------------------------------------------------------------
 * 2) ProkaryoteModel: Loads the GLTF scene & applies any needed visibility
 * ----------------------------------------------------------------*/
interface ProkaryoteModelProps {
  onNodeClick: (position: THREE.Vector3, name: string) => void;
}

const ProkaryoteModel: React.FC<ProkaryoteModelProps> = ({ onNodeClick }) => {
  const { scene } = useGLTF("/scene.gltf");

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const lookup = meshLookup[child.name];
        if (lookup) {
          // Keep the model's default color/material from GLTF
          // but optionally apply a texture or visibility from the lookup.
          if (lookup.texture) {
            const material = new THREE.MeshStandardMaterial();
            textureLoader.load(lookup.texture, (texture) => {
              material.map = texture;
              material.needsUpdate = true;
            });
            child.material = material;
          }
          child.visible = lookup.visible;
        }
      }
    });
  }, [scene]);

  // Handle mesh clicks by getting its world position
  const handlePointerDown = (e: THREE.Event & { object: THREE.Mesh }): void => {
    (e as unknown as React.MouseEvent).stopPropagation();
    const pos = new THREE.Vector3();
    e.object.getWorldPosition(pos);
    onNodeClick(pos, e.object.name);
  };

  return <primitive object={scene} onPointerDown={handlePointerDown} />;
};

/* ------------------------------------------------------------------
 * 3) PartIndicator: Transparent, clean-looking circle for each part
 * ----------------------------------------------------------------*/
interface PartIndicatorProps {
  meshName: string;
  label?: string;
  onClick: (position: THREE.Vector3, meshName: string) => void;
}

const PartIndicator: React.FC<PartIndicatorProps> = ({
  meshName,
  label,
  onClick,
}) => {
  const { scene } = useGLTF("/scene.gltf");
  const [indicatorPos, setIndicatorPos] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0),
  );

  useEffect(() => {
    const targetMesh = scene.getObjectByName(meshName);
    if (targetMesh) {
      const box = new THREE.Box3().setFromObject(targetMesh);
      const center = new THREE.Vector3();
      box.getCenter(center);
      setIndicatorPos(center);
    }
  }, [scene, meshName]);

  return (
    <Html position={indicatorPos}>
      <div
        onClick={() => onClick(indicatorPos, meshName)}
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          borderRadius: "50%",
          border: "2px solid rgba(255, 255, 255, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: "bold",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
        }}
      >
        {label ?? ""}
      </div>
    </Html>
  );
};

/* ------------------------------------------------------------------
 * 4) CameraController: Smoothly moves the camera to a target
 * ----------------------------------------------------------------*/
interface CameraControllerProps {
  targetPosition: THREE.Vector3;
  autoMove: boolean;
}

const CameraController: React.FC<CameraControllerProps> = ({
  targetPosition,
  autoMove,
}) => {
  const { camera } = useThree();
  useFrame(() => {
    if (autoMove) {
      camera.position.lerp(targetPosition, 0.1);
      camera.lookAt(0, 0, 0);
    }
  });
  return null;
};

/* ------------------------------------------------------------------
 * 5) Scene: Main component with bottom slider panel
 * ----------------------------------------------------------------*/
const Scene: React.FC = () => {
  const [camTarget, setCamTarget] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 5),
  );
  const [autoMove, setAutoMove] = useState<boolean>(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedDesc, setSelectedDesc] = useState<string | null>(null);

  // When a part is clicked, move camera & show slider panel
  const handleFocusOnNode = (nodePosition: THREE.Vector3, nodeName: string) => {
    setCamTarget(
      new THREE.Vector3(
        nodePosition.x + 2,
        nodePosition.y + 2,
        nodePosition.z + 2,
      ),
    );
    setAutoMove(true);
    setTimeout(() => setAutoMove(false), 2000);

    setSelectedPart(nodeName);
    setSelectedDesc(
      partDescriptions[nodeName] ?? "No description availables for this part.",
    );
  };

  return (
    <>
      {/* 3D Canvas */}
      <div style={{ position: "relative", width: "100%", height: "100vh" }}>
        <Canvas
          camera={{ position: [0, 0, 5] }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <ProkaryoteModel onNodeClick={handleFocusOnNode} />
          <CameraController targetPosition={camTarget} autoMove={autoMove} />
          <OrbitControls />
          {/* Indicators (adjust or add more as needed) */}
          <PartIndicator
            meshName="chromosome_chromosome_0"
            label="DNA"
            onClick={handleFocusOnNode}
          />
          <PartIndicator
            meshName="cell_wall_cell_wall_0"
            label="Cell Wall"
            onClick={handleFocusOnNode}
          />
          <PartIndicator
            meshName="flagellum_001_flagellum_001_0"
            label="Flagellum"
            onClick={handleFocusOnNode}
          />
          <PartIndicator
            meshName="pili_pili_0"
            label="Pili"
            onClick={handleFocusOnNode}
          />
        </Canvas>

        {/* Bottom Slider Panel */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            // Slide up if a part is selected, otherwise keep it hidden
            transform: selectedPart ? "translateY(0%)" : "translateY(100%)",
            transition: "transform 0.3s ease-in-out",
            background: "#fff",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
            padding: "20px",
            maxHeight: "40%", // or adjust as needed
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Drag handle look (purely visual) */}
          <div
            style={{
              width: "50px",
              height: "5px",
              backgroundColor: "#ccc",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          />

          {selectedPart && (
            <>
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Scene;
