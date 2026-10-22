"use client";

import { useMemo } from "react";
import { CORRIDOR_HALF_Z, ELEVATOR_DOOR_X, ELEVATOR_X, ROOM_X, STAIRS_DOOR_X, STAIRS_X } from "@/data/demo-hotel/spatial";
import { useDemo } from "@/lib/demo-store";
import { mapVariant } from "./textures";

export function HotelCorridor() {
  const { state } = useDemo();
  const carpet = useMemo(() => mapVariant("carpet", 9, 1.15), []);
  const span = STAIRS_DOOR_X - ELEVATOR_DOOR_X;
  const guided = state.cameraMode === "guided";
  const sconces = ROOM_X.slice(0, -1).map((x, index) => (x + ROOM_X[index + 1]) / 2);

  return (
    <group>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[span, 0.06, CORRIDOR_HALF_Z * 2 + 0.35]} />
        <meshStandardMaterial color="#d5cbbd" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.09, 0]} receiveShadow>
        <boxGeometry args={[span - 0.15, 0.035, 2.05]} />
        <meshStandardMaterial map={carpet ?? undefined} color="#2a6a62" roughness={0.92} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, 0.115, side * 0.92]}>
          <boxGeometry args={[span - 0.2, 0.012, 0.06]} />
          <meshStandardMaterial color="#e0c48a" metalness={0.35} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[(ELEVATOR_X + ELEVATOR_DOOR_X) / 2, 0.055, 0]} receiveShadow>
        <boxGeometry args={[ELEVATOR_DOOR_X - ELEVATOR_X + 0.2, 0.05, 2.2]} />
        <meshStandardMaterial color="#e4dccf" roughness={0.86} />
      </mesh>
      <mesh position={[(STAIRS_X + STAIRS_DOOR_X) / 2, 0.055, 0]} receiveShadow>
        <boxGeometry args={[STAIRS_X - STAIRS_DOOR_X + 0.3, 0.05, 2.2]} />
        <meshStandardMaterial color="#e4dccf" roughness={0.86} />
      </mesh>

      {sconces.flatMap((x) =>
        ([-1, 1] as const).map((side) => (
          <group key={`${x}-${side}`} position={[x, 1.52, side * 1.08]}>
            <mesh>
              <boxGeometry args={[0.18, 0.36, 0.045]} />
              <meshStandardMaterial color="#c4a15a" metalness={0.58} roughness={0.32} />
            </mesh>
            <mesh position={[0, -0.02, -side * 0.035]}>
              <boxGeometry args={[0.08, 0.1, 0.03]} />
              <meshStandardMaterial color="#fff3d6" emissive="#ffc98a" emissiveIntensity={0.75} />
            </mesh>
          </group>
        )),
      )}

      {ROOM_X.map((x) => (
        <mesh key={x} position={[x, guided ? 2.4 : 2.22, 0]}>
          <cylinderGeometry args={[0.09, 0.15, 0.05, 12]} />
          <meshStandardMaterial color="#fff6e6" emissive="#ffd7a2" emissiveIntensity={0.7} />
        </mesh>
      ))}
      <pointLight position={[0, 2.05, 0]} intensity={guided ? 7 : 3} distance={16} decay={2} color="#fff0dc" />
    </group>
  );
}
