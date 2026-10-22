"use client";

import { Text } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { PARADISE, RESTAURANT } from "@/data/demo-hotel/spatial";
import { mapVariant } from "./textures";

function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.28, 10]} />
        <meshStandardMaterial color="#6a4b34" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.48, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 10]} />
        <meshStandardMaterial color="#2f6b45" roughness={0.86} />
      </mesh>
      <mesh position={[0.12, 0.62, 0.05]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#3e7d52" roughness={0.86} />
      </mesh>
    </group>
  );
}

function Chair({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.42, 0.08, 0.42]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.48, -0.16]}>
        <boxGeometry args={[0.42, 0.36, 0.06]} />
        <meshStandardMaterial color="#3f5c58" roughness={0.8} />
      </mesh>
      {[-0.16, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.14, 0]}>
          <boxGeometry args={[0.05, 0.28, 0.05]} />
          <meshStandardMaterial color="#c4a15a" metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function PodiumInterior() {
  const marble = useMemo(() => mapVariant("marble", 1.4, 1.4), []);

  return (
    <group>
      <mesh position={[0.2, 0.045, 1.5]} receiveShadow>
        <boxGeometry args={[9.2, 0.03, 5.6]} />
        <meshStandardMaterial map={marble ?? undefined} color="#f7f1e6" roughness={0.55} />
      </mesh>
      <mesh position={[0.2, 0.065, 1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.35, 1.48, 40]} />
        <meshStandardMaterial color="#c4a15a" metalness={0.45} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.55, 3.55]} castShadow>
        <boxGeometry args={[4.2, 0.95, 0.7]} />
        <meshStandardMaterial color="#5c4030" roughness={0.58} />
      </mesh>
      <mesh position={[0, 1.05, 3.55]}>
        <boxGeometry args={[4.35, 0.07, 0.82]} />
        <meshStandardMaterial color="#edd9b4" roughness={0.42} />
      </mesh>
      <mesh position={[0, 1.55, 3.95]}>
        <boxGeometry args={[4.4, 1.1, 0.12]} />
        <meshStandardMaterial color="#4a3428" roughness={0.7} />
      </mesh>
      {[-1.3, 0, 1.3].map((x) => (
        <mesh key={x} position={[x, 1.55, 3.88]}>
          <boxGeometry args={[0.08, 1.05, 0.04]} />
          <meshStandardMaterial color="#c4a15a" metalness={0.45} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[-0.85, 1.18, 3.18]}>
        <boxGeometry args={[0.46, 0.28, 0.03]} />
        <meshStandardMaterial color="#10211f" emissive="#1f6a62" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.7, 1.12, 3.18]}>
        <cylinderGeometry args={[0.08, 0.1, 0.06, 12]} />
        <meshStandardMaterial color="#c4a15a" metalness={0.7} roughness={0.25} />
      </mesh>
      <Suspense fallback={null}>
        <Text position={[0, 1.7, 3.86]} rotation={[0, Math.PI, 0]} fontSize={0.22} color="#f6f1e6" anchorX="center">
          LỄ TÂN
        </Text>
      </Suspense>

      {[-2.4, 2.4].map((x) => (
        <group key={x} position={[x, 0, 1.15]}>
          <mesh position={[0, 0.32, 0]} castShadow>
            <boxGeometry args={[1.45, 0.42, 0.62]} />
            <meshStandardMaterial color="#3f5c58" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.56, 0]}>
            <boxGeometry args={[1.38, 0.12, 0.55]} />
            <meshStandardMaterial color="#f4efe4" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.7, -0.22]}>
            <boxGeometry args={[1.38, 0.28, 0.1]} />
            <meshStandardMaterial color="#345650" roughness={0.84} />
          </mesh>
        </group>
      ))}
      <mesh position={[2.55, 0.28, 2.35]} castShadow>
        <boxGeometry args={[0.55, 0.36, 0.38]} />
        <meshStandardMaterial color="#6b4e38" roughness={0.7} />
      </mesh>
      <mesh position={[2.55, 0.55, 2.35]}>
        <boxGeometry args={[0.55, 0.18, 0.38]} />
        <meshStandardMaterial color="#5a4030" roughness={0.7} />
      </mesh>

      <group position={[0, 2.55, 1.35]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#c4a15a" metalness={0.7} roughness={0.28} />
        </mesh>
        <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.028, 8, 28]} />
          <meshStandardMaterial color="#c4a15a" metalness={0.75} roughness={0.24} />
        </mesh>
        {[0, 1.26, 2.51, 3.77, 5.03].map((turn) => (
          <mesh key={turn} position={[Math.cos(turn) * 0.62, -0.18, Math.sin(turn) * 0.62]}>
            <sphereGeometry args={[0.055, 10, 8]} />
            <meshStandardMaterial color="#fff1cc" emissive="#ffd18a" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 2.3, 1.4]} intensity={8} distance={14} decay={2} color="#ffd8a8" />

      <Plant position={[-3.6, 0, 3.3]} />
      <Plant position={[3.7, 0, 3.15]} scale={0.9} />
      <Plant position={[-1.6, 0, -0.2]} scale={0.85} />

      <mesh position={[11.2, 0.04, -4.8]} receiveShadow>
        <boxGeometry args={[6.4, 0.04, 5.2]} />
        <meshStandardMaterial color="#e4d2b4" roughness={0.78} />
      </mesh>
      {[
        [RESTAURANT[0] + 1.35, RESTAURANT[2] - 0.15],
        [RESTAURANT[0] - 1.15, RESTAURANT[2] + 0.85],
        [RESTAURANT[0] + 0.2, RESTAURANT[2] + 1.15],
      ].map(([x, z]) => (
        <group key={`${x}-${z}`}>
          <mesh position={[x, 0.48, z]} castShadow>
            <cylinderGeometry args={[0.48, 0.48, 0.08, 18]} />
            <meshStandardMaterial color="#f4efe6" roughness={0.7} />
          </mesh>
          <mesh position={[x, 0.42, z]}>
            <cylinderGeometry args={[0.08, 0.1, 0.7, 8]} />
            <meshStandardMaterial color="#5c4030" />
          </mesh>
          <Chair position={[x + 0.55, 0, z]} rotationY={-Math.PI / 2} />
          <Chair position={[x - 0.55, 0, z]} rotationY={Math.PI / 2} />
        </group>
      ))}
      <mesh position={[RESTAURANT[0], 1.35, RESTAURANT[2] - 1.55]}>
        <boxGeometry args={[2.4, 0.7, 0.08]} />
        <meshStandardMaterial color="#4a3428" roughness={0.7} />
      </mesh>
      <Suspense fallback={null}>
        <Text position={[RESTAURANT[0], 1.35, RESTAURANT[2] - 1.48]} fontSize={0.2} color="#f6f1e6" anchorX="center">
          HOA MAI
        </Text>
      </Suspense>

      <mesh position={[PARADISE[0], 0.04, PARADISE[2]]} receiveShadow>
        <boxGeometry args={[5.6, 0.04, 5.4]} />
        <meshStandardMaterial color="#d7c3a4" roughness={0.8} />
      </mesh>
      <mesh position={[PARADISE[0] - 0.2, 0.55, PARADISE[2] - 1.7]} castShadow>
        <boxGeometry args={[3.1, 0.95, 0.55]} />
        <meshStandardMaterial color="#4e392c" roughness={0.6} />
      </mesh>
      <mesh position={[PARADISE[0] - 0.2, 1.05, PARADISE[2] - 1.7]}>
        <boxGeometry args={[3.2, 0.07, 0.62]} />
        <meshStandardMaterial color="#e7d3b0" roughness={0.45} />
      </mesh>
      {[-1.1, 0, 1.1].map((offset) => (
        <mesh key={offset} position={[PARADISE[0] + offset, 0.48, PARADISE[2] - 1.15]}>
          <cylinderGeometry args={[0.16, 0.16, 0.55, 10]} />
          <meshStandardMaterial color="#3f5c58" roughness={0.75} />
        </mesh>
      ))}
      <mesh position={[PARADISE[0] + 1.35, 0.42, PARADISE[2] + 0.55]}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 16]} />
        <meshStandardMaterial color="#f6f1e6" />
      </mesh>
      <Plant position={[PARADISE[0] + 1.8, 0, PARADISE[2] + 1.4]} scale={1.1} />
      <Suspense fallback={null}>
        <Text position={[PARADISE[0] - 0.2, 1.4, PARADISE[2] - 1.35]} fontSize={0.16} color="#f6f1e6" anchorX="center">
          PARADISE
        </Text>
      </Suspense>

    </group>
  );
}
