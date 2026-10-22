"use client";

import { STAIRS_X, WALL_H } from "@/data/demo-hotel/spatial";

export function StairCore() {
  return (
    <group position={[STAIRS_X, 0, 0.05]}>
      <mesh position={[0, 0.05, 0.05]} receiveShadow>
        <boxGeometry args={[1.85, 0.08, 2.7]} />
        <meshStandardMaterial color="#ddd4c6" roughness={0.9} />
      </mesh>
      {Array.from({ length: 8 }, (_, index) => (
        <mesh key={index} position={[0, 0.16 + index * 0.16, -0.85 + index * 0.2]} castShadow>
          <boxGeometry args={[1.28, 0.08, 0.28]} />
          <meshStandardMaterial color={index % 2 ? "#f4efe6" : "#6a4a32"} roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[-0.78, WALL_H / 2, 0]}>
        <boxGeometry args={[0.1, WALL_H, 2.45]} />
        <meshStandardMaterial color="#f6f2ea" roughness={0.86} />
      </mesh>
      <mesh position={[0.74, 1.05, 0.05]}>
        <boxGeometry args={[0.045, 0.045, 2.15]} />
        <meshStandardMaterial color="#c4a15a" metalness={0.55} roughness={0.32} />
      </mesh>
      {[ -0.7, 0.75 ].map((z) => (
        <mesh key={z} position={[0.74, 0.55, z]}>
          <boxGeometry args={[0.04, 1.05, 0.04]} />
          <meshStandardMaterial color="#c4a15a" metalness={0.5} roughness={0.34} />
        </mesh>
      ))}
    </group>
  );
}
