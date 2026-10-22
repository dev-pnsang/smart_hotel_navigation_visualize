"use client";

import { Billboard, Text } from "@react-three/drei";
import { Suspense } from "react";
import { DESTINATION_ROOM_ID } from "@/data/demo-hotel/booking";
import { getFloor } from "@/data/demo-hotel/floors";
import { roomsOnFloor } from "@/data/demo-hotel/rooms";
import { floorLift } from "@/data/demo-hotel/spatial";
import type { FloorId } from "@/data/demo-hotel/types";
import { useDemo } from "@/lib/demo-store";
import { hasAssignedRoom } from "@/lib/status";
import { Elevator } from "./Elevator";
import { HotelCorridor } from "./HotelCorridor";
import { HotelRoom } from "./HotelRoom";
import { StairCore } from "./StairCore";

export function FloorGroup({ floorId }: { floorId: Extract<FloorId, "floor-2" | "floor-4"> }) {
  const { state, selectRoom } = useDemo();
  const floor = getFloor(floorId);
  if (!floor) return null;

  const isolated = state.cameraMode !== "isometric";
  const visible = !isolated || state.selectedFloorId === floorId;
  if (!visible) return null;

  const lift = floorLift(floorId, state.explode, isolated);
  const showLabels = isolated || state.explode > 0.16;
  const assignedId = hasAssignedRoom(state.status) ? DESTINATION_ROOM_ID : null;

  return (
    <group position={[0, floor.y + lift, 0]}>
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[22.9, 0.14, 13.7]} />
        <meshStandardMaterial color="#d4c9b8" roughness={0.88} />
      </mesh>
      <mesh position={[0, -0.12, 0]} receiveShadow castShadow>
        <boxGeometry args={[22.6, 0.24, 13.4]} />
        <meshStandardMaterial color="#e8dfd2" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[21.2, 0.02, 12.2]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.85} />
      </mesh>
      {[-6.45, 6.45].map((z) => (
        <group key={z} position={[0, 0.46, z]}>
          <mesh>
            <boxGeometry args={[18.8, 0.06, 0.55]} />
            <meshStandardMaterial color="#f7f4ee" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.28, z > 0 ? 0.22 : -0.22]}>
            <boxGeometry args={[18.6, 0.035, 0.035]} />
            <meshStandardMaterial color="#2a3033" metalness={0.35} roughness={0.4} />
          </mesh>
          {[-8, -4, 0, 4, 8].map((x) => (
            <mesh key={x} position={[x, 0.16, z > 0 ? 0.22 : -0.22]}>
              <boxGeometry args={[0.035, 0.28, 0.035]} />
              <meshStandardMaterial color="#2a3033" metalness={0.35} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
      {[-11.22, 11.22].map((x) => (
        <mesh key={x} position={[x, 0.32, 0]}>
          <boxGeometry args={[0.12, 0.55, 13.15]} />
          <meshStandardMaterial color="#f4efe6" roughness={0.86} />
        </mesh>
      ))}
      <HotelCorridor />
      <Elevator />
      <StairCore />
      {roomsOnFloor(floorId).map((room) => {
        const selected =
          (state.selection?.kind === "room" && state.selection.id === room.id) ||
          (state.selection?.kind === "amenity" &&
            state.selection.id === "amenity-room-408" &&
            room.id === DESTINATION_ROOM_ID);
        return (
          <HotelRoom
            key={room.id}
            room={room}
            assigned={assignedId === room.id}
            selected={selected}
            showLabel={showLabels}
            onSelect={selectRoom}
          />
        );
      })}
      <Suspense fallback={null}>
        <Billboard position={[-10.7, 0.45, 6.15]}>
          <Text fontSize={0.42} color="#8d7344" anchorX="center">
            {floor.short}
          </Text>
        </Billboard>
      </Suspense>
    </group>
  );
}
