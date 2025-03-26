"use client";
import React, {
  useState,
  useEffect,
  useRef,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

// --- Type Definitions ---

interface MeshProperties {
  visible: boolean;
  texture?: string;
}

export const partNameMapping: Record<string, string> = {
  capsule_capsule_0: "Capsule",
  cell_wall_cell_wall_0: "Cell Wall",
  fimbria_fimbria_0: "Fimbria",
  flagellum_001_flagellum_001_0: "Flagellum",
  nucleoid_nucleoid_0: "Nucleoid",
  plasma_membrane_plasma_membrane_0: "Plasma Membrane",
  plasmid_001_plasmid_001_0: "Plasmid",
  ribosomes_ribosomes_0: "Ribosomes",
};

export const partDescriptions: Record<string, string> = {
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

const meshLookup: Record<string, MeshProperties> = {
  capsule_capsule_0: { visible: true, texture: "/textures/capsule.png" },
  cell_wall_cell_wall_0: { visible: true, texture: "/textures/cellwall.png" },
  fimbria_fimbria_0: { visible: true, texture: "/textures/fimbria.png" },
  flagellum_001_flagellum_001_0: {
    visible: false,
    texture: "/textures/flagellum.png",
  },
  flagellum_002_flagellum_002_0: { visible: false },
  flagellum_003_flagellum_003_0: { visible: true },
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

// --- ProkaryoteModel Component ---
interface ProkaryoteModelProps {
  onLoaded: () => void;
  onNodeClick: (position: THREE.Vector3, name: string) => void;
  setMeshPositions: Dispatch<SetStateAction<Record<string, THREE.Vector3>>>;
}

const ProkaryoteModel: FC<ProkaryoteModelProps> = ({
  onLoaded,
  onNodeClick,
  setMeshPositions,
}) => {
  const { scene } = useGLTF("/scene.gltf") as { scene: THREE.Group };

  useEffect(() => {
    const positions: Record<string, THREE.Vector3> = {};
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const lookup = meshLookup[child.name];
        if (lookup) {
          child.visible = lookup.visible;
          if (partNameMapping[child.name]) {
            const box = new THREE.Box3().setFromObject(child);
            const center = new THREE.Vector3();
            box.getCenter(center);
            positions[child.name] = center;
          }
        }
      }
    });
    setMeshPositions(positions);
    onLoaded();
  }, [scene, onLoaded, setMeshPositions]);

  const handlePointerDown = (
    e: THREE.Event & { object: THREE.Mesh } & React.PointerEvent,
  ): void => {
    e.stopPropagation();
    const pos = new THREE.Vector3();
    e.object.getWorldPosition(pos);
    onNodeClick(pos, e.object.name);
  };

  return <primitive object={scene} onPointerDown={handlePointerDown} />;
};

// --- PartIndicator Component ---
interface PartIndicatorProps {
  meshName: string;
  label: string;
  onClick: (position: THREE.Vector3, name: string) => void;
}

const PartIndicator: FC<PartIndicatorProps> = ({
  meshName,
  label,
  onClick,
}) => {
  const { scene } = useGLTF("/scene.gltf") as { scene: THREE.Group };
  const [indicatorPos, setIndicatorPos] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0),
  );
  const [hovered, setHovered] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);

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

// --- Main Scene Component ---
const Scene: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [meshPositions, setMeshPositions] = useState<
    Record<string, THREE.Vector3>
  >({});
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const controlsRef = useRef<any>(null);

  // CameraUpdater updates the OrbitControls target on part selection.
  // This one-time update does not lock free camera navigation.
  // CameraUpdater now only updates the controls target.
  const CameraUpdater: FC = () => {
    const { camera } = useThree();
    useEffect(() => {
      if (selectedPart && meshPositions[selectedPart] && controlsRef.current) {
        const targetPos = meshPositions[selectedPart];
        controlsRef.current.target.copy(targetPos);
        // Removed camera.position.set(...) to avoid locking camera position.
        controlsRef.current.update();
      }
    }, [selectedPart, meshPositions, camera]);
    return null;
  };

  // Handler for selecting a part (from a dot or a button)
  const handlePartSelect = (position: THREE.Vector3, name: string): void => {
    if (partNameMapping[name]) {
      setSelectedPart(name);
    }
  };

  return (
    <div>
      {/* Canvas container with relative positioning for overlays */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "80vh",
          marginTop: "10vh",
        }}
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
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
            onNodeClick={handlePartSelect}
            setMeshPositions={setMeshPositions}
          />
          <OrbitControls
            ref={controlsRef}
            enablePan
            enableRotate
            enableZoom
            minDistance={2}
            maxDistance={10}
          />
          <CameraUpdater />
          {/* Render white dot indicators for each part */}
          {Object.keys(partNameMapping).map((meshName) => (
            <PartIndicator
              key={meshName}
              meshName={meshName}
              label={partNameMapping[meshName] || "Unknown Part"}
              onClick={handlePartSelect}
            />
          ))}
        </Canvas>
        {/* Overlay description dialogue with slightly opaque background */}
        {selectedPart && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "10px 20px",
              borderRadius: "8px",
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            <h2 className="mb-2 text-xl font-semibold">
              {partNameMapping[selectedPart]}
            </h2>
            <p>
              {selectedPart &&
                partNameMapping[selectedPart] &&
                partDescriptions[partNameMapping[selectedPart]]}
            </p>
          </div>
        )}
      </div>
      {/* Horizontal list of buttons for each part */}
      <div className="mt-4 flex justify-center space-x-2">
        {Object.keys(partNameMapping).map((meshName) => (
          <button
            key={meshName}
            onClick={() => setSelectedPart(meshName)}
            className="rounded border px-4 py-2 hover:bg-green-100"
          >
            {partNameMapping[meshName]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Scene;
