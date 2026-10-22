"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import { ELEVATOR_X, WALL_H } from "@/data/demo-hotel/spatial";
import { navRuntime } from "@/lib/nav-runtime";

export function Elevator() {
  const left = useRef<Mesh>(null);
  const right = useRef<Mesh>(null);

  useFrame(() => {
    const slide = 0.58 + navRuntime.doorOpen * 0.34;
    if (left.current) left.current.position.z = -slide;
    if (right.current) right.current.position.z = slide;
  });

  return (
    <group position={[ELEVATOR_X, 0, 0]}>
      <mesh position={[-0.95, WALL_H / 2, 0]} castShadow>
        <boxGeometry args={[0.16, WALL_H, 2.45]} />
        <meshStandardMaterial color="#f3eee6" roughness={0.8} />
      </mesh>
      <mesh position={[0, WALL_H / 2, -1.18]} castShadow>
        <boxGeometry args={[1.85, WALL_H, 0.12]} />
        <meshStandardMaterial color="#f7f3ec" roughness={0.82} />
      </mesh>
      <mesh position={[0, WALL_H / 2, 1.18]} castShadow>
        <boxGeometry args={[1.85, WALL_H, 0.12]} />
        <meshStandardMaterial color="#f7f3ec" roughness={0.82} />
      </mesh>
      <mesh position={[0.86, WALL_H / 2, 0]}>
        <boxGeometry args={[0.06, WALL_H, 2.2]} />
        <meshStandardMaterial color="#c4a15a" metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.45, 0.05, 2.05]} />
        <meshStandardMaterial color="#cfc6b8" roughness={0.55} metalness={0.12} />
      </mesh>
      <mesh position={[0, 2.42, 0]}>
        <boxGeometry args={[1.15, 0.04, 1.7]} />
        <meshStandardMaterial color="#fff6e8" emissive="#ffe0b0" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[-0.15, 1.15, -1.1]}>
        <boxGeometry args={[0.7, 0.9, 0.02]} />
        <meshStandardMaterial color="#d5e4e1" metalness={0.65} roughness={0.15} />
      </mesh>
      <mesh ref={left} position={[0.8, WALL_H / 2, -0.58]}>
        <boxGeometry args={[0.05, WALL_H * 0.9, 0.62]} />
        <meshStandardMaterial color="#8a8174" metalness={0.48} roughness={0.28} />
      </mesh>
      <mesh ref={right} position={[0.8, WALL_H / 2, 0.58]}>
        <boxGeometry args={[0.05, WALL_H * 0.9, 0.62]} />
        <meshStandardMaterial color="#8a8174" metalness={0.48} roughness={0.28} />
      </mesh>
      <mesh position={[0.9, 1.7, 0.28]}>
        <boxGeometry args={[0.02, 0.28, 0.16]} />
        <meshStandardMaterial color="#1c1915" />
      </mesh>
      <mesh position={[0.92, 1.76, 0.28]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.025, 10]} />
        <meshStandardMaterial color="#d4b06a" emissive="#c4a15a" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[0, 2.1, 0]} intensity={2.2} distance={4.5} decay={2} color="#fff1dc" />
    </group>
  );
}
