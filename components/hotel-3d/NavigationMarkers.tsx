"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { nodeById } from "@/data/demo-hotel/navigation-graph";
import { floorLift } from "@/data/demo-hotel/spatial";
import { useDemo } from "@/lib/demo-store";
import { navRuntime } from "@/lib/nav-runtime";
import { useVisibleRoute } from "./use-route";

export function NavigationMarkers() {
  const { state } = useDemo();
  const { ids } = useVisibleRoute();
  const pin = useRef<Group>(null);
  const beam = useRef<Mesh>(null);
  const walker = useRef<Group>(null);
  const isolated = state.cameraMode !== "isometric";
  const lastId = ids[ids.length - 1];
  const firstId = ids[0];
  const last = lastId ? nodeById.get(lastId) : undefined;
  const first = firstId ? nodeById.get(firstId) : undefined;
  const destination: [number, number, number] | null = last
    ? [last.position[0], last.position[1] + floorLift(last.floorId, state.explode, isolated) + 0.04, last.position[2]]
    : null;
  const origin: [number, number, number] | null = first
    ? [first.position[0], first.position[1] + floorLift(first.floorId, state.explode, isolated) + 0.04, first.position[2]]
    : null;
  const showDestination = !isolated || !last || last.floorId === state.selectedFloorId;
  const showOrigin = origin && first && first.id !== last?.id && (!isolated || first.floorId === state.selectedFloorId);
  const showWalker = state.hasStarted && state.cameraMode !== "isometric";

  useFrame(({ clock }) => {
    if (!state.reducedMotion) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 2.1) * 0.08;
      pin.current?.scale.setScalar(pulse);
      if (beam.current) beam.current.scale.y = 0.92 + Math.sin(clock.elapsedTime * 1.6) * 0.08;
    }
    const guest = walker.current;
    if (!guest) return;
    guest.position.set(navRuntime.x, navRuntime.y, navRuntime.z);
    const dx = navRuntime.lookX - navRuntime.x;
    const dz = navRuntime.lookZ - navRuntime.z;
    if (dx * dx + dz * dz > 0.04) guest.rotation.y = Math.atan2(dx, dz);
  });

  return (
    <group>
      {showOrigin && origin ? (
        <mesh position={origin} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.34, 24]} />
          <meshStandardMaterial color="#f4efe4" emissive="#1d4c48" emissiveIntensity={0.3} />
        </mesh>
      ) : null}

      {destination && showDestination ? (
        <group position={destination}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[0.42, 0.62, 32]} />
            <meshStandardMaterial color="#e0c48a" emissive="#8a6428" emissiveIntensity={0.35} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
            <ringGeometry args={[0.18, 0.28, 24]} />
            <meshStandardMaterial color="#f7f3ea" emissive="#d7b56a" emissiveIntensity={0.2} />
          </mesh>
          <mesh ref={beam} position={[0, 1.35, 0]}>
            <cylinderGeometry args={[0.035, 0.16, 2.5, 12, 1, true]} />
            <meshStandardMaterial color="#f6ead0" emissive="#c4a15a" emissiveIntensity={0.45} transparent opacity={0.28} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.85, 8]} />
            <meshStandardMaterial color="#c4a15a" metalness={0.6} roughness={0.3} />
          </mesh>
          <group ref={pin} position={[0, 1.2, 0]}>
            <mesh>
              <octahedronGeometry args={[0.16, 0]} />
              <meshStandardMaterial color="#f7f1e4" emissive="#d4b06a" emissiveIntensity={0.45} metalness={0.25} roughness={0.3} />
            </mesh>
          </group>
        </group>
      ) : null}

      {showWalker ? (
        <group ref={walker} position={[navRuntime.x, navRuntime.y, navRuntime.z]}>
          <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.24, 0.36, 24]} />
            <meshStandardMaterial color="#f7f3ea" emissive="#1d4c48" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0.46, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.13, 0.62, 10]} />
            <meshStandardMaterial color="#2a2622" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.98, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.15, 0.48, 12]} />
            <meshStandardMaterial color="#243c3a" roughness={0.72} />
          </mesh>
          <mesh position={[0, 1.38, 0]}>
            <sphereGeometry args={[0.13, 14, 12]} />
            <meshStandardMaterial color="#e4c4a8" roughness={0.7} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
