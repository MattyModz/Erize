"use client";
import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------
 * 1) Mesh Properties (Visibility & Textures)
 * ----------------------------------------------------------------*/
interface MeshProperties {
  visible: boolean;
  texture?: string;
}

// ✅ Visibility & Texture Mapping
const meshLookup: Record<string, MeshProperties> = {
  capsule_capsule_0: { visible: true, texture: "/textures/capsule.png" },
  cell_wall_cell_wall_0: { visible: true, texture: "/textures/cellwall.png" },
  fimbria_fimbria_0: { visible: true, texture: "/textures/fimbria.png" },
  flagellum_001_flagellum_001_0: {
    visible: true,
    texture: "/textures/flagellum.png",
  }, // ✅ Only one flagellum
  flagellum_002_flagellum_002_0: { visible: false },
  flagellum_003_flagellum_003_0: { visible: false },
  flagellum_004_flagellum_004_0: { visible: false },
  nucleoid_nucleoid_0: { visible: true, texture: "/textures/nucleoid.png" },
  plasma_membrane_plasma_membrane_0: {
    visible: true,
    texture: "/textures/plasma_membrane.png",
  },
  plasmid_001_plasmid_001_0: {
    visible: true,
    texture: "/textures/plasmid.png",
  },
  ribosomes_ribosomes_0: { visible: true, texture: "/textures/ribosomes.png" },
};

/* ------------------------------------------------------------------
 * 2) Readable Part Names & Descriptions
 * ----------------------------------------------------------------*/
const partNameMapping: Record<string, string> = {
  capsule_capsule_0: "Capsule",
  cell_wall_cell_wall_0: "Cell Wall",
  fimbria_fimbria_0: "Fimbria",
  flagellum_001_flagellum_001_0: "Flagellum",
  nucleoid_nucleoid_0: "Nucleoid",
  plasma_membrane_plasma_membrane_0: "Plasma Membrane",
  plasmid_001_plasmid_001_0: "Plasmid",
  ribosomes_ribosomes_0: "Ribosomes",
};

const partDescriptions: Record<string, string> = {
  Capsule:
    "The capsule is a protective outer layer that helps the bacterium evade the immune system and adhere to surfaces.",
  "Cell Wall":
    "The cell wall maintains the bacterium’s shape and provides structural support, protecting it from external stresses.",
  Fimbria:
    "Fimbriae (pili) are hair-like structures that help the bacterium attach to host cells and aid in genetic exchange.",
  Flagellum:
    "The cholera bacterium has a single flagellum, which acts like a propeller to help it move through liquid environments.",
  Nucleoid:
    "The nucleoid is the region where the bacterium’s DNA is located. It contains all the genetic information needed for survival and replication.",
  "Plasma Membrane":
    "The plasma membrane is a selective barrier that controls the movement of substances in and out of the cell, maintaining homeostasis.",
  Plasmid:
    "Plasmids are small, circular DNA molecules that contain additional genes, often for antibiotic resistance or virulence factors.",
  Ribosomes:
    "Ribosomes are molecular machines that build proteins, which are essential for bacterial growth, repair, and function.",
};

/* ------------------------------------------------------------------
 * 3) ProkaryoteModel: Loads the 3D model & applies textures
 * ----------------------------------------------------------------*/
interface ProkaryoteModelProps {
  onLoaded: () => void;
  onNodeClick: (position: THREE.Vector3, name: string) => void;
}

const ProkaryoteModel: React.FC<ProkaryoteModelProps> = ({
  onLoaded,
  onNodeClick,
}) => {
  const { scene } = useGLTF("/scene.gltf");
  const textureLoader = new THREE.TextureLoader();

  // useEffect(() => {
  //   scene.traverse((child) => {
  //     if (child instanceof THREE.Mesh && child.material) {
  //       const lookup = meshLookup[child.name];
  //       if (lookup) {
  //         child.visible = lookup.visible;
  //         if (lookup.texture) {
  //           textureLoader.load(lookup.texture, (texture) => {
  //             child.material.map = texture;
  //             child.material.needsUpdate = true;
  //           });
  //         }
  //       }
  //     }
  //   });

  //   onLoaded();
  // }, [scene, onLoaded]);

  const handlePointerDown = (e: THREE.Event & { object: THREE.Mesh }): void => {
    (e as unknown as React.MouseEvent).stopPropagation();
    const pos = new THREE.Vector3();
    e.object.getWorldPosition(pos);
    onNodeClick(pos, e.object.name);
  };

  return <primitive object={scene} onPointerDown={handlePointerDown} />;
};

/* ------------------------------------------------------------------
 * 4) PartIndicator: White circle, hover shows label, click darkens
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
  const [indicatorPos, setIndicatorPos] = useState(new THREE.Vector3(0, 0, 0));
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

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
        onClick={() => {
          onClick(indicatorPos, meshName);
          setClicked(true);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: clicked ? "rgba(0, 0, 0, 0.6)" : "white",
          border: clicked ? "2px solid rgba(0, 0, 0, 0.6)" : "2px solid black",
          borderRadius: "50%",
          position: "relative",
          cursor: "pointer",
          transition: "background 0.3s ease, border 0.3s ease",
        }}
      >
        {hovered && (
          <div
            style={{
              position: "absolute",
              top: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "6px 12px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        )}
      </div>
    </Html>
  );
};

/* ------------------------------------------------------------------
 * 5) Scene: Main component with loading & free camera movement
 * ----------------------------------------------------------------*/
const Scene: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "80vh",
          marginTop: "10vh",
        }}
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <img
              src="/Logo.png"
              alt="Loading..."
              className="h-24 w-24 animate-spin"
            />
          </div>
        )}

        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <ProkaryoteModel
            onLoaded={() => setLoading(false)}
            onNodeClick={() => {}}
          />
          <OrbitControls
            enablePan
            enableRotate
            enableZoom
            minDistance={2}
            maxDistance={10}
          />
        </Canvas>
      </div>
    </>
  );
};

export default Scene;
