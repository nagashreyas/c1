import React, { useState, useRef, Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Html,
  RoundedBox,
  MeshTransmissionMaterial,
  Environment,
} from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { ANIMAL_CELL, PLANT_CELL } from './constants';
import { Organelle, CellData } from './types';
import { ArrowLeft, Info, Layers, MousePointerClick, X, Scissors } from 'lucide-react';

interface CellExplorerProps {
  onBack: () => void;
}

const ORGANELLE_SUMMARY: Record<string, string> = {
  nucleus: 'Stores DNA and directs all cellular activity.',
  mitochondria: 'Generates ATP energy via cellular respiration.',
  golgi: 'Modifies, sorts and packages proteins for transport.',
  er: 'Rough ER — synthesises and folds proteins on ribosomes.',
  smoothEr: 'Smooth ER — makes lipids and detoxifies chemicals.',
  ribosome: 'Builds proteins by translating messenger RNA.',
  peroxisome: 'Breaks down fatty acids and detoxifies H₂O₂.',
  centrosome: 'Organises microtubules during cell division.',
  cytoskeleton: 'Network of fibres that shapes and supports the cell.',
  lysosome: 'Digests waste using powerful enzymes.',
  'vesicle-1': 'Transports materials within the cell.',
  'vesicle-2': 'Transports materials within the cell.',
  'vesicle-3': 'Transports materials within the cell.',
  chloroplast: 'Performs photosynthesis to produce glucose.',
  vacuole: 'Stores water and maintains turgor pressure.',
  cellwall: 'Rigid cellulose layer giving structural support.',
  plasmodesmata: 'Channels through the wall linking plant cells.',
};

/* ============================================================
   ORGANELLE GEOMETRIES — anatomically faithful & realistic
   ============================================================ */

/* ---------- Nucleus ---------- */
function Nucleus({ color }: { color: string }) {
  // Generate chromatin strands as Catmull-Rom curves inside the nucleus
  const chromatin = useMemo(() => {
    const strands: THREE.CatmullRomCurve3[] = [];
    for (let s = 0; s < 6; s++) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < 8; i++) {
        const r = 0.5 + Math.random() * 0.35;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        points.push(
          new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
          )
        );
      }
      strands.push(new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5));
    }
    return strands;
  }, []);

  const pores = useMemo(() => {
    const arr: [number, number, number][] = [];
    const n = 22;
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(-1 + (2 * i) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      const r = 1.18;
      arr.push([
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      ]);
    }
    return arr;
  }, []);

  return (
    <group>
      {/* Outer nuclear envelope — translucent glassy membrane */}
      <mesh>
        <sphereGeometry args={[1.18, 96, 96]} />
        <MeshTransmissionMaterial
          color={color}
          thickness={0.4}
          transmission={0.85}
          roughness={0.15}
          ior={1.3}
          chromaticAberration={0.02}
          backside
          backsideThickness={0.2}
          samples={4}
          resolution={256}
          distortion={0.05}
          distortionScale={0.3}
        />
      </mesh>

      {/* Inner membrane (subtle inner shell) */}
      <mesh>
        <sphereGeometry args={[1.06, 64, 64]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.18}
          roughness={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Nucleolus */}
      <mesh>
        <sphereGeometry args={[0.32, 48, 48]} />
        <meshPhysicalMaterial
          color="#ffb347"
          emissive="#ff7a00"
          emissiveIntensity={0.45}
          roughness={0.35}
          clearcoat={0.6}
        />
      </mesh>
      {/* Secondary smaller nucleolus */}
      <mesh position={[0.35, -0.2, 0.15]}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshPhysicalMaterial color="#ff9a3c" emissive="#ff5a00" emissiveIntensity={0.35} />
      </mesh>

      {/* Chromatin strands */}
      {chromatin.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 64, 0.018, 6, false]} />
          <meshStandardMaterial
            color="#9b6bff"
            emissive="#5b2eb3"
            emissiveIntensity={0.4}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Nuclear pores on the envelope */}
      {pores.map((p, i) => (
        <mesh key={i} position={p}>
          <torusGeometry args={[0.05, 0.018, 8, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#9adfff"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Mitochondrion ---------- */
function Mitochondrion({ color }: { color: string }) {
  // Realistic cristae as winding tube along the long axis
  const cristae = useMemo(() => {
    const curves: THREE.CatmullRomCurve3[] = [];
    for (let c = 0; c < 5; c++) {
      const points: THREE.Vector3[] = [];
      const yOff = (c - 2) * 0.06;
      for (let i = 0; i <= 18; i++) {
        const t = (i / 18) * Math.PI * 2;
        const x = Math.cos(t) * 0.18;
        const y = yOff + Math.sin(t * 2) * 0.04;
        const z = Math.sin(t) * 0.18;
        points.push(new THREE.Vector3(x, y, z));
      }
      curves.push(new THREE.CatmullRomCurve3(points, true));
    }
    return curves;
  }, []);

  return (
    <group>
      {/* Outer membrane — bean shape via stretched capsule */}
      <mesh scale={[1.7, 0.75, 0.75]}>
        <capsuleGeometry args={[0.3, 0.55, 24, 48]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.35}
          clearcoat={0.7}
          clearcoatRoughness={0.25}
          sheen={0.3}
          sheenColor="#ffd9b3"
        />
      </mesh>

      {/* Inner cristae (folded inner membrane) */}
      <group scale={[1.55, 0.6, 0.6]}>
        {cristae.map((curve, i) => (
          <mesh key={i}>
            <tubeGeometry args={[curve, 80, 0.025, 8, true]} />
            <meshStandardMaterial
              color="#7a2e0a"
              emissive="#3a1404"
              emissiveIntensity={0.3}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Matrix glow */}
      <mesh scale={[1.55, 0.6, 0.6]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#ff9a55"
          transparent
          opacity={0.18}
          emissive="#ff5a00"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

/* ---------- Golgi Apparatus ---------- */
function Golgi({ color }: { color: string }) {
  // Full stacked cisternae (visible from every angle) — uses solid tori with discs
  const stack = [
    { y: -0.24, r: 0.42 },
    { y: -0.12, r: 0.5 },
    { y: 0.0, r: 0.56 },
    { y: 0.12, r: 0.5 },
    { y: 0.24, r: 0.42 },
  ];

  return (
    <group>
      {stack.map((s, i) => (
        <group key={i} position={[0, s.y, 0]}>
          {/* Flattened disc body */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[s.r, s.r, 0.06, 48]} />
            <meshPhysicalMaterial
              color={color}
              roughness={0.35}
              clearcoat={0.5}
              clearcoatRoughness={0.3}
            />
          </mesh>
          {/* Rim ring for 3D depth */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[s.r, 0.04, 12, 48]} />
            <meshPhysicalMaterial
              color={color}
              roughness={0.3}
              clearcoat={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Vesicles budding off the rim */}
      {[
        [0.6, 0.28, 0.1],
        [-0.55, 0.32, -0.1],
        [0.4, -0.28, 0.2],
        [-0.35, -0.32, -0.05],
        [0.65, 0.0, -0.2],
        [-0.65, 0.0, 0.15],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.08 + (i % 2) * 0.02, 16, 16]} />
          <meshPhysicalMaterial color={color} roughness={0.35} clearcoat={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Endoplasmic Reticulum ---------- */
function EndoplasmicReticulum({ color }: { color: string }) {
  // Continuous winding tube — realistic ER network
  const tubeCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const angle = t * Math.PI * 6;
      const r = 0.45 + Math.sin(t * Math.PI * 3) * 0.12;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * r,
          (t - 0.5) * 0.6 + Math.sin(angle * 1.5) * 0.08,
          Math.sin(angle) * r * 0.8
        )
      );
    }
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
  }, []);

  // Rough ER ribosomes attached along the tube
  const ribosomes = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 1; i < 60; i++) {
      if (i % 2 === 0) {
        const t = i / 60;
        const point = tubeCurve.getPoint(t);
        const tangent = tubeCurve.getTangent(t);
        const normal = new THREE.Vector3()
          .crossVectors(tangent, new THREE.Vector3(0, 1, 0))
          .normalize()
          .multiplyScalar(0.07);
        arr.push([point.x + normal.x, point.y + normal.y, point.z + normal.z]);
      }
    }
    return arr;
  }, [tubeCurve]);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[tubeCurve, 200, 0.05, 12, false]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.4}
          clearcoat={0.4}
          sheen={0.3}
          sheenColor="#ffffff"
        />
      </mesh>

      {/* Free ribosomes */}
      {ribosomes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial
            color="#1f3a5f"
            emissive="#0c1a30"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Lysosome ---------- */
function Lysosome({ color }: { color: string }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.32, 48, 48]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.3}
          clearcoat={0.7}
          transmission={0.2}
          thickness={0.3}
        />
      </mesh>
      {/* Hydrolytic enzyme granules */}
      {[
        [0.1, 0.05, 0.05],
        [-0.08, 0.06, -0.04],
        [0.04, -0.1, 0.06],
        [-0.05, -0.06, -0.08],
        [0.08, 0.0, -0.1],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color="#6b1e3a"
            emissive="#aa2855"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Vesicle ---------- */
function Vesicle({ color }: { color: string }) {
  return (
    <mesh>
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.2}
        clearcoat={0.8}
        transmission={0.4}
        thickness={0.3}
        ior={1.3}
      />
    </mesh>
  );
}

/* ---------- Chloroplast ---------- */
function Chloroplast({ color }: { color: string }) {
  return (
    <group>
      {/* Outer envelope — lens shape */}
      <mesh scale={[1.8, 0.85, 0.9]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.4}
          clearcoat={0.6}
          transmission={0.15}
          thickness={0.3}
        />
      </mesh>

      {/* Stroma (inner matrix) */}
      <mesh scale={[1.7, 0.8, 0.85]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#1d4e2a" transparent opacity={0.4} />
      </mesh>

      {/* Grana stacks */}
      {[-0.5, -0.25, 0, 0.25, 0.5].map((x, gi) => (
        <group key={gi} position={[x, 0, 0]} rotation={[0, 0, (gi % 2 === 0 ? 0.1 : -0.1)]}>
          {[-0.1, -0.05, 0, 0.05, 0.1].map((y, si) => (
            <mesh key={si} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.022, 32]} />
              <meshPhysicalMaterial
                color="#2f7d3a"
                emissive="#0b2e10"
                emissiveIntensity={0.4}
                roughness={0.45}
                clearcoat={0.4}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Stroma lamellae connecting grana */}
      {[-0.375, -0.125, 0.125, 0.375].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
          <meshStandardMaterial color="#2f7d3a" />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Vacuole ---------- */
function Vacuole({ color }: { color: string }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.4, 96, 96]} />
        <MeshTransmissionMaterial
          color={color}
          thickness={0.6}
          transmission={0.95}
          roughness={0.05}
          ior={1.33}
          chromaticAberration={0.04}
          backside
          backsideThickness={0.3}
          samples={4}
          resolution={256}
          distortion={0.1}
          distortionScale={0.4}
        />
      </mesh>
    </group>
  );
}

/* ---------- Cell wall marker ---------- */
function CellWallMarker({ color }: { color: string }) {
  return (
    <mesh>
      <octahedronGeometry args={[0.25, 0]} />
      <meshPhysicalMaterial color={color} roughness={0.5} clearcoat={0.4} />
    </mesh>
  );
}

/* ---------- Ribosome cluster (free ribosomes) ---------- */
function Ribosome({ color }: { color: string }) {
  // Each ribosome = small + large subunit fused together
  const seeds = useMemo(() => {
    const arr: { p: [number, number, number]; r: number }[] = [];
    for (let i = 0; i < 9; i++) {
      arr.push({
        p: [
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7,
        ],
        r: 0.07 + Math.random() * 0.04,
      });
    }
    return arr;
  }, []);
  return (
    <group>
      {seeds.map((s, i) => (
        <group key={i} position={s.p}>
          <mesh>
            <sphereGeometry args={[s.r, 24, 24]} />
            <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.6} />
          </mesh>
          <mesh position={[0, s.r * 0.55, 0]}>
            <sphereGeometry args={[s.r * 0.65, 20, 20]} />
            <meshPhysicalMaterial color="#ffd43b" roughness={0.4} clearcoat={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- Peroxisome ---------- */
function Peroxisome({ color }: { color: string }) {
  return (
    <group>
      {/* Outer membrane */}
      <mesh>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.35}
          clearcoat={0.7}
          transmission={0.2}
          thickness={0.2}
        />
      </mesh>
      {/* Crystalline urate-oxidase core */}
      <mesh rotation={[0.4, 0.6, 0.2]}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshPhysicalMaterial color="#f59f00" roughness={0.25} clearcoat={0.9} />
      </mesh>
    </group>
  );
}

/* ---------- Centrosome (pair of centrioles) ---------- */
function Centrosome({ color }: { color: string }) {
  const Centriole = ({ rotation }: { rotation: [number, number, number] }) => (
    <group rotation={rotation}>
      {/* Barrel */}
      <mesh>
        <cylinderGeometry args={[0.13, 0.13, 0.42, 18, 1, true]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.35}
          clearcoat={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 9 microtubule triplets around the barrel */}
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.12, 0, Math.sin(a) * 0.12]}
          >
            <cylinderGeometry args={[0.018, 0.018, 0.42, 8]} />
            <meshStandardMaterial color="#1864ab" />
          </mesh>
        );
      })}
    </group>
  );
  return (
    <group>
      <group position={[-0.15, 0, 0]}>
        <Centriole rotation={[0, 0, Math.PI / 2]} />
      </group>
      <group position={[0.15, 0, 0]}>
        <Centriole rotation={[Math.PI / 2, 0, 0]} />
      </group>
      {/* Pericentriolar material — soft halo */}
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/* ---------- Cytoskeleton (microtubules) ---------- */
function Cytoskeleton({ color }: { color: string }) {
  // Short thin tubes radiating from a local MTOC — a representative cluster
  const tubes = useMemo(() => {
    const items: { dir: [number, number, number]; len: number }[] = [];
    for (let i = 0; i < 8; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      items.push({
        dir: [
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi),
        ],
        len: 0.9 + Math.random() * 0.5,
      });
    }
    return items;
  }, []);

  return (
    <group>
      {tubes.map((t, i) => {
        const dir = new THREE.Vector3(...t.dir).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
        return (
          <mesh
            key={i}
            quaternion={quat}
            position={[dir.x * t.len * 0.5, dir.y * t.len * 0.5, dir.z * t.len * 0.5]}
          >
            <cylinderGeometry args={[0.025, 0.025, t.len, 8]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.85}
              emissive={color}
              emissiveIntensity={0.15}
            />
          </mesh>
        );
      })}
      {/* Microtubule organising centre */}
      <mesh>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshPhysicalMaterial color="#4dabf7" roughness={0.3} clearcoat={0.6} />
      </mesh>
    </group>
  );
}

/* ---------- Smooth ER (tubules without ribosomes) ---------- */
function SmoothEr({ color }: { color: string }) {
  // Build a smooth tubular network using torus knots and bent tubes
  return (
    <group>
      <mesh rotation={[0.3, 0.5, 0]}>
        <torusKnotGeometry args={[0.55, 0.09, 96, 12, 2, 3]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.35}
          clearcoat={0.6}
          transmission={0.12}
          thickness={0.2}
        />
      </mesh>
      <mesh rotation={[1.1, 0.2, 0.6]} position={[0.05, 0.05, 0]}>
        <torusGeometry args={[0.45, 0.07, 16, 64]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.35}
          clearcoat={0.6}
        />
      </mesh>
    </group>
  );
}

/* ---------- Plasmodesmata (channels through the wall) ---------- */
function Plasmodesmata({ color }: { color: string }) {
  // Cluster of small channels arranged in a patch
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 7; i++) {
      arr.push([(Math.random() - 0.5) * 0.55, 0, (Math.random() - 0.5) * 0.55]);
    }
    return arr;
  }, []);
  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <cylinderGeometry args={[0.05, 0.05, 0.35, 14]} />
          <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.7} />
        </mesh>
      ))}
      {/* Patch base for visibility */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
        <meshStandardMaterial color="#5c940d" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/* ============================================================
   Interactive wrapper for each organelle
   ============================================================ */

function OrganelleModel({
  organelle,
  isSelected,
  onSelect,
  onHover,
}: {
  organelle: Organelle;
  isSelected: boolean;
  onSelect: (o: Organelle) => void;
  onHover: (o: Organelle | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * (isSelected ? 0.45 : 0.12);
  });

  const renderShape = () => {
    switch (organelle.id) {
      case 'nucleus':
        return <Nucleus color={organelle.color} />;
      case 'mitochondria':
        return <Mitochondrion color={organelle.color} />;
      case 'golgi':
        return <Golgi color={organelle.color} />;
      case 'er':
        return <EndoplasmicReticulum color={organelle.color} />;
      case 'smoothEr':
        return <SmoothEr color={organelle.color} />;
      case 'ribosome':
        return <Ribosome color={organelle.color} />;
      case 'peroxisome':
        return <Peroxisome color={organelle.color} />;
      case 'centrosome':
        return <Centrosome color={organelle.color} />;
      case 'cytoskeleton':
        return <Cytoskeleton color={organelle.color} />;
      case 'lysosome':
        return <Lysosome color={organelle.color} />;
      case 'chloroplast':
        return <Chloroplast color={organelle.color} />;
      case 'vacuole':
        return <Vacuole color={organelle.color} />;
      case 'cellwall':
        return <CellWallMarker color={organelle.color} />;
      case 'plasmodesmata':
        return <Plasmodesmata color={organelle.color} />;
      default:
        return <Vesicle color={organelle.color} />;
    }
  };

  const showLabel = hovered || isSelected;

  // Invisible hit-area sphere sized per organelle so clicks always register
  const hitRadius = (() => {
    switch (organelle.id) {
      case 'nucleus':
        return 1.35;
      case 'vacuole':
        return 1.55;
      case 'chloroplast':
        return 1.0;
      case 'mitochondria':
        return 0.85;
      case 'golgi':
        return 0.85;
      case 'er':
        return 0.85;
      case 'smoothEr':
        return 0.7;
      case 'centrosome':
        return 0.5;
      case 'cytoskeleton':
        return 0.55;
      case 'peroxisome':
        return 0.45;
      case 'ribosome':
        return 0.55;
      case 'plasmodesmata':
        return 0.5;
      case 'lysosome':
        return 0.55;
      case 'cellwall':
        return 0.5;
      default:
        return 0.45; // vesicles
    }
  })();

  return (
    <group
      ref={groupRef}
      position={organelle.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(organelle);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(organelle);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(organelle);
      }}
    >
      {/* Transparent hit target — always picks up hover/touch from any angle.
          We keep it rendered (opacity 0) so r3f's event raycaster sees it. */}
      <mesh renderOrder={-1}>
        <sphereGeometry args={[hitRadius, 16, 16]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          colorWrite={false}
        />
      </mesh>

      {/* Selection halo */}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[hitRadius * 1.05, 32, 32]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0.08} />
        </mesh>
      )}

      {renderShape()}

      {showLabel && (
        <Html distanceFactor={9} center position={[0, 1.5, 0]}>
          <div
            className={`px-3 py-1 rounded-full border whitespace-nowrap pointer-events-none backdrop-blur-md ${
              isSelected
                ? 'bg-brand-cyan text-black border-brand-cyan'
                : 'bg-black/80 text-brand-cyan border-white/20'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider">{organelle.name}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ============================================================
   Cytoplasm — free ribosomes, proteins and small molecules
   ============================================================ */

// Reject points outside the cell shape (sphere for animal, box for plant)
function insideCell(p: [number, number, number], isPlant: boolean) {
  if (isPlant) {
    const limit = 3.1;
    return Math.abs(p[0]) < limit && Math.abs(p[1]) < limit && Math.abs(p[2]) < limit;
  }
  return Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]) < 2.95;
}

function randomInCell(isPlant: boolean): [number, number, number] {
  const range = isPlant ? 3.1 : 3.0;
  for (let i = 0; i < 30; i++) {
    const p: [number, number, number] = [
      (Math.random() - 0.5) * range * 2,
      (Math.random() - 0.5) * range * 2,
      (Math.random() - 0.5) * range * 2,
    ];
    if (insideCell(p, isPlant)) return p;
  }
  return [0, 0, 0];
}

function CytoplasmParticles({ isPlant }: { isPlant: boolean }) {
  // Free ribosomes: small dark blue spheres scattered throughout
  const ribosomes = useMemo(
    () =>
      Array.from({ length: 180 }).map(() => ({
        position: randomInCell(isPlant),
        size: Math.random() * 0.025 + 0.025,
      })),
    [isPlant]
  );

  // Floating proteins / molecules: brighter colored small spheres
  const proteins = useMemo(
    () =>
      Array.from({ length: 90 }).map(() => {
        const palette = ['#9adfff', '#c9b6ff', '#ffd3a5', '#a3e8b0', '#f8b6d2'];
        return {
          position: randomInCell(isPlant),
          size: Math.random() * 0.03 + 0.015,
          color: palette[Math.floor(Math.random() * palette.length)],
          opacity: Math.random() * 0.4 + 0.4,
        };
      }),
    [isPlant]
  );

  // Glycogen / starch granules: a few larger softer spheres
  const granules = useMemo(
    () =>
      Array.from({ length: 14 }).map(() => ({
        position: randomInCell(isPlant),
        size: Math.random() * 0.06 + 0.06,
        color: isPlant ? '#cdeac0' : '#ffe0b2',
      })),
    [isPlant]
  );

  return (
    <group>
      {/* Free ribosomes */}
      {ribosomes.map((r, i) => (
        <mesh key={`r-${i}`} position={r.position}>
          <sphereGeometry args={[r.size, 10, 10]} />
          <meshStandardMaterial
            color="#1f3a5f"
            emissive="#0c1a30"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Floating proteins / small molecules */}
      {proteins.map((p, i) => (
        <mesh key={`p-${i}`} position={p.position}>
          <sphereGeometry args={[p.size, 10, 10]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={0.35}
            transparent
            opacity={p.opacity}
          />
        </mesh>
      ))}

      {/* Glycogen / starch granules */}
      {granules.map((g, i) => (
        <mesh key={`g-${i}`} position={g.position}>
          <sphereGeometry args={[g.size, 16, 16]} />
          <meshPhysicalMaterial
            color={g.color}
            roughness={0.5}
            clearcoat={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   Cell Membrane (with phospholipid head dots)
   ============================================================ */

function PhospholipidHeads({ isPlant }: { isPlant: boolean }) {
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    if (isPlant) {
      // Skip — handled by box wireframe
      return arr;
    }
    const n = 220;
    const r = 3.32;
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(-1 + (2 * i) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      arr.push([
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      ]);
    }
    return arr;
  }, [isPlant]);

  if (isPlant) return null;
  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial
            color="#9adfff"
            emissive="#9adfff"
            emissiveIntensity={0.6}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   Apply clipping planes to every material in the scene
   so that organelles are cut too (not just the membrane).
   ============================================================ */
function ClipAll({ planes }: { planes: THREE.Plane[] }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        if (!mat) return;
        (mat as any).clippingPlanes = planes;
        (mat as any).clipShadows = true;
      });
    });
  });
  return null;
}

/* ============================================================
   Scene
   ============================================================ */

function CellScene({
  cellData,
  selected,
  onSelect,
  onHover,
  crossSection,
}: {
  cellData: CellData;
  selected: Organelle | null;
  onSelect: (o: Organelle | null) => void;
  onHover: (o: Organelle | null) => void;
  crossSection: boolean;
}) {
  const isPlant = cellData.type === 'plant';

  // Clip the front-right half of the membrane/wall when cross-section is on
  const clipPlanes = useMemo(
    () => (crossSection ? [new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0)] : []),
    [crossSection]
  );

  return (
    <>
      {/* Apply clipping to every material so organelles get cut too */}
      <ClipAll planes={clipPlanes} />

      {/* Studio lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 12, 8]} intensity={1.4} castShadow />
      <pointLight position={[-9, -6, 6]} intensity={0.7} color="#00f2ff" />
      <pointLight position={[7, 9, -7]} intensity={0.55} color="#a06cff" />
      <pointLight position={[0, -10, 0]} intensity={0.4} color="#ff8a55" />
      <Environment preset="city" />

      {/* Background catcher to deselect on empty click */}
      <mesh onPointerDown={() => onSelect(null)} visible={false}>
        <sphereGeometry args={[40, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* Plant cell wall — almost transparent light green */}
      {isPlant && (
        <>
          {/* Outer wall surface */}
          <RoundedBox args={[7.8, 7.8, 7.8]} radius={0.45} smoothness={4}>
            <meshPhysicalMaterial
              color="#c3fae8"
              transparent
              opacity={crossSection ? 0.18 : 0.1}
              roughness={0.55}
              clearcoat={0.4}
              clearcoatRoughness={0.4}
              side={THREE.DoubleSide}
              clippingPlanes={clipPlanes}
              clipShadows
            />
          </RoundedBox>

          {/* Inner wall layer — gives it a hint of thickness */}
          <RoundedBox args={[7.35, 7.35, 7.35]} radius={0.4} smoothness={4}>
            <meshPhysicalMaterial
              color="#d3f9d8"
              transparent
              opacity={crossSection ? 0.12 : 0.07}
              roughness={0.5}
              side={THREE.DoubleSide}
              clippingPlanes={clipPlanes}
            />
          </RoundedBox>

        </>
      )}

      {/* Cell membrane — soft translucent layer inside the wall (plant) or glass sphere (animal) */}
      {isPlant ? (
        <RoundedBox args={[7.0, 7.0, 7.0]} radius={0.35} smoothness={4}>
          <meshPhysicalMaterial
            color="#b2f2bb"
            transparent
            opacity={crossSection ? 0.3 : 0.18}
            roughness={0.3}
            side={THREE.DoubleSide}
            clippingPlanes={clipPlanes}
          />
        </RoundedBox>
      ) : (
        <mesh>
          <sphereGeometry args={[3.3, 96, 96]} />
          <meshPhysicalMaterial
            color="#7fe8ff"
            transparent
            opacity={crossSection ? 0.3 : 0.14}
            roughness={0.3}
            clearcoat={0.4}
            side={THREE.DoubleSide}
            clippingPlanes={clipPlanes}
          />
        </mesh>
      )}

      {/* Inner cytoplasm tint — very subtle so organelles are clearly visible */}
      <mesh>
        {isPlant ? (
          <boxGeometry args={[6.7, 6.7, 6.7]} />
        ) : (
          <sphereGeometry args={[3.15, 64, 64]} />
        )}
        <meshStandardMaterial
          color={isPlant ? '#0c3d3d' : '#0a3a4a'}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          clippingPlanes={clipPlanes}
        />
      </mesh>

      <CytoplasmParticles isPlant={isPlant} />

      {cellData.organelles.map((o) => (
        <OrganelleModel
          key={o.id}
          organelle={o}
          isSelected={selected?.id === o.id}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={22}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

/* ============================================================
   Main exported component
   ============================================================ */

export default function CellExplorer({ onBack }: CellExplorerProps) {
  const [cellType, setCellType] = useState<'animal' | 'plant'>('animal');
  const [hovered, setHovered] = useState<Organelle | null>(null);
  const [selected, setSelected] = useState<Organelle | null>(null);
  const [crossSection, setCrossSection] = useState(false);
  const cellData = cellType === 'animal' ? ANIMAL_CELL : PLANT_CELL;

  const active = selected ?? hovered;
  const summary = active ? ORGANELLE_SUMMARY[active.id] ?? '' : '';

  return (
    <div className="relative h-screen w-full bg-brand-bg overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start pointer-events-auto">
          <button
            onClick={onBack}
            className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCrossSection((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors glass ${
                crossSection
                  ? 'bg-brand-cyan text-black hover:bg-brand-cyan'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title="Toggle cross-section view"
            >
              <Scissors className="w-4 h-4" />
              {crossSection ? 'Cross-section: ON' : 'Cross-section'}
            </button>

            <div className="flex gap-2 glass p-1 rounded-xl">
              <button
                onClick={() => {
                  setCellType('animal');
                  setSelected(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  cellType === 'animal'
                    ? 'bg-brand-cyan text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Animal Cell
              </button>
              <button
                onClick={() => {
                  setCellType('plant');
                  setSelected(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  cellType === 'plant'
                    ? 'bg-brand-cyan text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Plant Cell
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-md pointer-events-auto">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.id + (selected ? '-sel' : '-hov')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-6 rounded-2xl border-l-4 border-brand-cyan relative"
              >
                {selected && (
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-3 right-3 p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10"
                    aria-label="Close details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-brand-cyan" />
                  <h3 className="text-xl font-bold uppercase tracking-tight">{active.name}</h3>
                </div>
                {summary && (
                  <p className="text-brand-cyan/90 font-medium text-sm mb-2">{summary}</p>
                )}
                <p className="text-white/70 leading-relaxed text-sm">{active.description}</p>
                {!selected && (
                  <p className="text-[11px] text-white/40 mt-3 flex items-center gap-1">
                    <MousePointerClick className="w-3 h-3" />
                    Click to pin details
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass p-6 rounded-2xl border-l-4 border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-white/40" />
                  <h3 className="text-xl font-bold text-white/40 uppercase tracking-tight">
                    Interactive Explorer
                  </h3>
                </div>
                <p className="text-white/40 leading-relaxed text-sm">
                  Hover an organelle to preview it, or click to pin its details and one-line
                  explanation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 1.5, 9], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, localClippingEnabled: true }}
          onCreated={({ gl }) => {
            gl.localClippingEnabled = true;
          }}
        >
          <Suspense fallback={null}>
            <CellScene
              cellData={cellData}
              selected={selected}
              onSelect={setSelected}
              onHover={setHovered}
              crossSection={crossSection}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/5 rounded-full blur-[128px]" />
      </div>
    </div>
  );
}
