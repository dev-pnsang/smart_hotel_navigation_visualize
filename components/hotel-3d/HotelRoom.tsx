"use client";

import { Billboard, Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { ROOM_D, ROOM_W, WALL_H } from "@/data/demo-hotel/spatial";
import type { RoomRecord } from "@/data/demo-hotel/types";
import { mapVariant } from "./textures";

type HotelRoomProps = {
  room: RoomRecord;
  assigned: boolean;
  selected: boolean;
  showLabel: boolean;
  onSelect: (roomId: string) => void;
};

const wall = "#efe4d4";
const trim = "#6a4a32";
const linen = "#fbf7f1";

export function HotelRoom({ room, assigned, selected, showLabel, onSelect }: HotelRoomProps) {
  const wood = useMemo(() => mapVariant("wood", 2, 3), []);
  const width = ROOM_W - 0.08;
  const depth = ROOM_D - 0.1;
  const doorSide = room.facing === "south" ? -1 : 1;
  const frontZ = doorSide * (depth / 2);
  const outerZ = -doorSide * (depth / 2);
  const headZ = -(depth / 2 - 0.34);
  const bedZ = headZ + 1.02;
  const emphasized = assigned || selected;
  const rug = assigned ? "#2f6a62" : selected ? "#c4a15a" : "#8d4e3b";
  const head = assigned ? "#1f4a46" : "#3c2e28";

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(room.id);
  };
  const pointer = {
    onClick: select,
    onPointerOver: (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "";
    },
  };

  return (
    <group position={[room.position[0], 0, room.position[2]]}>
      <mesh position={[0, 0.05, 0]} receiveShadow {...pointer}>
        <boxGeometry args={[width, 0.07, depth]} />
        <meshStandardMaterial map={wood ?? undefined} color={assigned ? "#d7ebe4" : "#e0b07a"} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.09, bedZ - 0.05]} receiveShadow {...pointer}>
        <boxGeometry args={[2.35, 0.025, 3.15]} />
        <meshStandardMaterial color={rug} roughness={0.94} />
      </mesh>
      <mesh position={[0, 0.1, bedZ - 0.05]}>
        <boxGeometry args={[2.15, 0.012, 2.9]} />
        <meshStandardMaterial color={assigned ? "#3d7a72" : "#a85d46"} roughness={0.94} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * (width / 2), WALL_H / 2, 0]} castShadow>
            <boxGeometry args={[0.1, WALL_H, depth]} />
            <meshStandardMaterial color={wall} roughness={0.9} />
          </mesh>
          <mesh position={[side * (width / 2 - 0.07), 0.16, 0]}>
            <boxGeometry args={[0.04, 0.28, depth - 0.16]} />
            <meshStandardMaterial color={trim} roughness={0.7} />
          </mesh>
          <mesh position={[side * (width / 2 - 0.06), WALL_H - 0.08, 0]}>
            <boxGeometry args={[0.04, 0.1, depth - 0.12]} />
            <meshStandardMaterial color="#c4a574" roughness={0.55} />
          </mesh>
        </group>
      ))}

      {[-1.15, 1.15].map((x) => (
        <mesh key={x} position={[x, 0.58, frontZ]} castShadow>
          <boxGeometry args={[0.95, 1.16, 0.1]} />
          <meshStandardMaterial color={wall} roughness={0.9} />
        </mesh>
      ))}
      <group position={[0, 0, frontZ]} rotation={[0, assigned ? doorSide * 0.55 : 0, 0]}>
        <mesh position={[0, 1.02, 0]} castShadow {...pointer}>
          <boxGeometry args={[0.86, 2.02, 0.06]} />
          <meshStandardMaterial color={assigned ? "#7a5a3a" : "#5c4030"} roughness={0.62} />
        </mesh>
        <mesh position={[0.28, 1.02, doorSide * 0.04]}>
          <boxGeometry args={[0.08, 0.16, 0.03]} />
          <meshStandardMaterial color="#e0c48a" metalness={0.65} roughness={0.28} />
        </mesh>
      </group>

      {[-width / 2 + 0.18, width / 2 - 0.18].map((x) => (
        <mesh key={x} position={[x, WALL_H / 2, outerZ]} castShadow>
          <boxGeometry args={[0.28, WALL_H, 0.1]} />
          <meshStandardMaterial color={wall} roughness={0.88} />
        </mesh>
      ))}
      <mesh position={[0, 0.32, outerZ]}>
        <boxGeometry args={[width - 0.7, 0.64, 0.1]} />
        <meshStandardMaterial color={wall} roughness={0.88} />
      </mesh>
      <mesh position={[0, 2.32, outerZ]}>
        <boxGeometry args={[width - 0.7, 0.52, 0.1]} />
        <meshStandardMaterial color={wall} roughness={0.88} />
      </mesh>
      <mesh position={[0, 1.42, outerZ - doorSide * 0.02]}>
        <boxGeometry args={[width - 0.85, 1.35, 0.04]} />
        <meshStandardMaterial color="#8eb8b4" transparent opacity={0.28} roughness={0.05} metalness={0.05} />
      </mesh>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 1.42, outerZ - doorSide * 0.04]}>
          <boxGeometry args={[0.05, 1.35, 0.03]} />
          <meshStandardMaterial color="#f7f3ea" />
        </mesh>
      ))}
      {[-1.05, 1.05].map((x) => (
        <mesh key={`curtain-${x}`} position={[x, 1.25, outerZ + doorSide * 0.1]}>
          <boxGeometry args={[0.28, 1.7, 0.04]} />
          <meshStandardMaterial color={linen} roughness={0.95} />
        </mesh>
      ))}

      <mesh position={[0, 0.9, headZ]} castShadow>
        <boxGeometry args={[1.82, 1.05, 0.12]} />
        <meshStandardMaterial color={head} roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.46, headZ]}>
        <boxGeometry args={[1.9, 0.06, 0.08]} />
        <meshStandardMaterial color="#e0c48a" metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.22, bedZ]} castShadow {...pointer}>
        <boxGeometry args={[1.7, 0.28, 2.05]} />
        <meshStandardMaterial color={trim} roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.42, bedZ]}>
        <boxGeometry args={[1.58, 0.16, 1.92]} />
        <meshStandardMaterial color={linen} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.52, bedZ + 0.28]}>
        <boxGeometry args={[1.52, 0.07, 1.15]} />
        <meshStandardMaterial color="#f3eee6" roughness={0.94} />
      </mesh>
      <mesh position={[0, 0.56, bedZ + 0.72]}>
        <boxGeometry args={[1.48, 0.05, 0.48]} />
        <meshStandardMaterial color={assigned ? "#d4b483" : "#6e8f84"} roughness={0.9} />
      </mesh>
      {[-0.38, 0.38].map((x) => (
        <mesh key={x} position={[x, 0.58, headZ + 0.28]}>
          <boxGeometry args={[0.58, 0.14, 0.32]} />
          <meshStandardMaterial color="#fffdf8" roughness={1} />
        </mesh>
      ))}

      {[-1.12, 1.12].map((x) => (
        <group key={x} position={[x, 0, headZ + 0.35]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.42, 0.42, 0.38]} />
            <meshStandardMaterial color="#f3ece3" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.46, 0.04, 0.42]} />
            <meshStandardMaterial color={trim} roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.72, 0]}>
            <coneGeometry args={[0.16, 0.22, 12]} />
            <meshStandardMaterial color="#fff6e4" emissive="#ffd7a2" emissiveIntensity={0.45} />
          </mesh>
        </group>
      ))}

      <mesh position={[width / 2 - 0.08, 1.35, 0.15]}>
        <boxGeometry args={[0.03, 0.55, 0.75]} />
        <meshStandardMaterial color={assigned ? "#1f4a46" : "#8d4e3b"} roughness={0.75} />
      </mesh>
      <mesh position={[width / 2 - 0.1, 1.35, 0.15]}>
        <boxGeometry args={[0.02, 0.62, 0.82]} />
        <meshStandardMaterial color="#e0c48a" metalness={0.4} roughness={0.4} />
      </mesh>

      {showLabel || emphasized ? (
        <Suspense fallback={null}>
          <Billboard position={[0, 1.15, bedZ]}>
            <Text fontSize={0.2} color="#1c1915" anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#f7f3ea">
              {room.number}
            </Text>
          </Billboard>
        </Suspense>
      ) : null}
    </group>
  );
}
