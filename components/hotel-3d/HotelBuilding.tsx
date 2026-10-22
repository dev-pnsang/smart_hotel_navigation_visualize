"use client";

import { Billboard, Text } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { getFloor } from "@/data/demo-hotel/floors";
import { guestFloorY, midFloorLift } from "@/data/demo-hotel/spatial";
import { useDemo } from "@/lib/demo-store";
import { Elevator } from "./Elevator";
import { FloorGroup } from "./FloorGroup";
import { HotelAmenity } from "./HotelAmenity";
import { PodiumInterior } from "./PodiumInterior";
import { LobbyFacade, RexShell, RexSite, RoofGarden } from "./RexExterior";
import { StairCore } from "./StairCore";
import { mapVariant } from "./textures";

function MidFloor({ level }: { level: number }) {
  const { state } = useDemo();
  const isolated = state.cameraMode !== "isometric";
  if (isolated || state.explode < 0.08) return null;
  const y = guestFloorY(level) + midFloorLift(level, state.explode, false);
  const pool = level === 5;

  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, -0.08, -0.1]} receiveShadow>
        <boxGeometry args={[24.8, 0.16, 13.8]} />
        <meshStandardMaterial color="#f7f6f3" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.15, 6.85]}>
        <boxGeometry args={[22.4, 1.05, 0.08]} />
        <meshStandardMaterial color="#243038" transparent opacity={0.45} roughness={0.15} metalness={0.2} />
      </mesh>
      {pool ? (
        <mesh position={[3.2, 0.08, -1.2]}>
          <boxGeometry args={[5.2, 0.1, 2.1]} />
          <meshStandardMaterial color="#7eb8c4" roughness={0.12} metalness={0.08} transparent opacity={0.9} />
        </mesh>
      ) : null}
      <Suspense fallback={null}>
        <Billboard position={[-11.2, 0.55, 6.4]}>
          <Text fontSize={0.42} color="#8d7344">
            {level}
          </Text>
        </Billboard>
      </Suspense>
    </group>
  );
}

function BuildingContext() {
  const { state } = useDemo();
  if (state.cameraMode === "isometric" || state.cameraMode === "guided") return null;
  const selected = getFloor(state.selectedFloorId)?.level ?? 1;
  const top = guestFloorY(6);

  return (
    <group>
      {[1, 2, 3, 4, 5, 6].map((level) => {
        if (level === selected) return null;
        const y = level === 1 ? 0.4 : guestFloorY(level) + 0.35;
        return (
          <group key={level} position={[0, y, -0.05]}>
            <mesh>
              <boxGeometry args={[24.2, 0.2, 13.2]} />
              <meshStandardMaterial color="#f7f4ee" transparent opacity={0.14} depthWrite={false} />
            </mesh>
            <mesh position={[0, 0.85, 6.5]}>
              <boxGeometry args={[23.4, 1.2, 0.08]} />
              <meshStandardMaterial color="#c5d5d6" transparent opacity={0.16} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
      {[
        [-13.45, -7.55],
        [13.45, -7.55],
        [-13.45, 7.55],
        [13.45, 7.55],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, top / 2, z]}>
          <boxGeometry args={[0.18, top + 0.6, 0.18]} />
          <meshStandardMaterial color="#e7dfd3" transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

export function HotelBuilding() {
  const { state, selectAmenity } = useDemo();
  const marble = useMemo(() => mapVariant("marble", 5, 3), []);
  const isolated = state.cameraMode !== "isometric";
  const showShell = !isolated && state.explode < 0.08;
  const showPodium = !isolated || state.selectedFloorId === "floor-1";
  const showRoof = !isolated || state.selectedFloorId === "floor-6";
  const roofLift = showRoof ? (isolated ? 0 : state.explode * 12.2) : 0;

  return (
    <group>
      <RexSite />
      <BuildingContext />
      {showShell ? <RexShell /> : null}

      {showPodium ? (
        <group>
          <mesh position={[0, -0.16, -0.05]} receiveShadow castShadow>
            <boxGeometry args={[26.4, 0.28, 14.6]} />
            <meshStandardMaterial map={marble ?? undefined} color="#f4f1ea" roughness={0.72} />
          </mesh>
          {!showShell ? <LobbyFacade /> : null}
          <PodiumInterior />
          <Elevator />
          <StairCore />
          {[
            [-5.6, 3.5],
            [5.6, 3.5],
            [-5.6, -3.2],
            [5.6, -3.2],
          ].map(([x, z]) => (
            <mesh key={`${x}-${z}`} position={[x, 1.5, z]} castShadow>
              <cylinderGeometry args={[0.22, 0.24, 3, 16]} />
              <meshStandardMaterial color="#f7f6f3" roughness={0.7} />
            </mesh>
          ))}
          <HotelAmenity nodeId="lobby-reception" amenityId="amenity-reception" selected={state.selection?.id === "amenity-reception"} onSelect={selectAmenity} />
          <HotelAmenity nodeId="restaurant" amenityId="amenity-restaurant" selected={state.selection?.id === "amenity-restaurant"} onSelect={selectAmenity} />
          <HotelAmenity nodeId="paradise" amenityId="amenity-paradise" selected={state.selection?.id === "amenity-paradise"} onSelect={selectAmenity} />
          <HotelAmenity nodeId="elev-f1" amenityId="amenity-elevator" selected={state.selection?.id === "amenity-elevator"} onSelect={selectAmenity} />
          <Suspense fallback={null}>
            <Billboard position={[-12.2, 0.45, 6.4]}>
              <Text fontSize={0.42} color="#8d7344">
                1
              </Text>
            </Billboard>
          </Suspense>
        </group>
      ) : null}

      <FloorGroup floorId="floor-2" />
      <MidFloor level={3} />
      <FloorGroup floorId="floor-4" />
      <MidFloor level={5} />

      {showRoof ? (
        <group position={[0, guestFloorY(6) + roofLift, 0]}>
          <RoofGarden />
          <Elevator />
          <HotelAmenity nodeId="pool" amenityId="amenity-pool" selected={state.selection?.id === "amenity-pool"} onSelect={selectAmenity} />
          <HotelAmenity nodeId="rooftop-bar" amenityId="amenity-rooftop" selected={state.selection?.id === "amenity-rooftop"} onSelect={selectAmenity} />
          <Suspense fallback={null}>
            <Billboard position={[-11.2, 0.7, 6.2]}>
              <Text fontSize={0.42} color="#8d7344">
                6
              </Text>
            </Billboard>
          </Suspense>
        </group>
      ) : null}
    </group>
  );
}
