"use client";

import { getFloor } from "@/data/demo-hotel/floors";
import { ELEVATOR_X } from "@/data/demo-hotel/spatial";
import { useDemo } from "@/lib/demo-store";

export function FloorTransition() {
  const { state } = useDemo();
  const floor = state.coverFloorId ? getFloor(state.coverFloorId) : undefined;
  if (!floor) return null;

  return (
    <mesh position={[ELEVATOR_X, floor.y + 1.3, 0]}>
      <cylinderGeometry args={[0.16, 0.16, 2.1, 16]} />
      <meshStandardMaterial
        color="#f6f0e4"
        emissive="#b89a62"
        emissiveIntensity={0.55}
        transparent
        opacity={0.45}
      />
    </mesh>
  );
}
