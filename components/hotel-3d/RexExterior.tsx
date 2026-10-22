"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import type { MeshStandardMaterial } from "three";
import { guestFloorY } from "@/data/demo-hotel/spatial";
import { useDemo } from "@/lib/demo-store";
import { mapVariant } from "./textures";

const WALL = "#f7f6f3";
const WALL_SHADE = "#e6e2da";
const GLASS = "#243038";
const RAIL = "#1c1c1c";
const GOLD = "#e0b03a";
const GREEN = "#2f6b45";

const UPPER = [2, 3, 4, 5] as const;
const FRONT_Z = 7.35;
const SIDE_X = 13.15;
const BODY_W = 26.2;
const BODY_D = 14.5;

function Window({
  position,
  size = [1.15, 1.65],
  rotationY = 0,
}: {
  position: [number, number, number];
  size?: [number, number];
  rotationY?: number;
}) {
  return (
    <mesh position={position} rotation={[0, rotationY, 0]}>
      <boxGeometry args={[size[0], size[1], 0.06]} />
      <meshStandardMaterial color={GLASS} roughness={0.12} metalness={0.35} />
    </mesh>
  );
}

function Balcony({
  position,
  width,
  rotationY = 0,
}: {
  position: [number, number, number];
  width: number;
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow>
        <boxGeometry args={[width, 0.08, 0.78]} />
        <meshStandardMaterial color={WALL} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.36, 0.34]}>
        <boxGeometry args={[width, 0.045, 0.045]} />
        <meshStandardMaterial color={RAIL} roughness={0.4} metalness={0.2} />
      </mesh>
      {[-width / 2, width / 2].map((x) => (
        <mesh key={x} position={[x, 0.22, 0.34]}>
          <boxGeometry args={[0.045, 0.44, 0.045]} />
          <meshStandardMaterial color={RAIL} />
        </mesh>
      ))}
    </group>
  );
}

function Crown({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.38, 0.52, 0.62, 20]} />
        <meshStandardMaterial color={WALL} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <sphereGeometry args={[0.46, 28, 18]} />
        <meshStandardMaterial color={GOLD} metalness={0.78} roughness={0.24} emissive="#8a6414" emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.32, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color="#f2d56a" metalness={0.8} roughness={0.2} emissive="#c89620" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function Palm({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 3.4, 8]} />
        <meshStandardMaterial color="#8d7a62" roughness={0.85} />
      </mesh>
      {[0, 1.2, 2.4, 3.6, 4.8].map((turn) => (
        <mesh key={turn} position={[Math.cos(turn) * 0.55, 3.35, Math.sin(turn) * 0.55]} rotation={[0.5, turn, 0]}>
          <coneGeometry args={[0.16, 1.15, 5]} />
          <meshStandardMaterial color={GREEN} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 3.2, 8]} />
        <meshStandardMaterial color="#2a3033" metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0.18, 3.15, 0]}>
        <boxGeometry args={[0.55, 0.06, 0.22]} />
        <meshStandardMaterial color="#2a3033" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.18, 3.08, 0]}>
        <boxGeometry args={[0.38, 0.05, 0.14]} />
        <meshStandardMaterial color="#fff1cc" emissive="#ffd18a" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

export function RexSite() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, -0.22, 6]} receiveShadow>
        <planeGeometry args={[90, 70]} />
        <meshStandardMaterial color="#d9d4cc" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[22, -0.2, 0]} receiveShadow>
        <planeGeometry args={[16, 36]} />
        <meshStandardMaterial color="#4e5256" roughness={0.92} />
      </mesh>
      {[-4.2, -2.6, -1, 0.6, 2.2, 3.8].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[18.2, -0.18, z]}>
          <planeGeometry args={[2.4, 0.28]} />
          <meshStandardMaterial color="#f4f1ea" />
        </mesh>
      ))}
      {[-8, -4, 0, 4, 8].map((x) => (
        <mesh key={x} position={[x, 0.28, 10.4]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.56, 10]} />
          <meshStandardMaterial color="#c9c3b8" />
        </mesh>
      ))}
      <Palm position={[-10.5, 0, 11.2]} />
      <Palm position={[8.4, 0, 12.4]} />
      <Palm position={[16.5, 0, 8.5]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.205, 9.5]} receiveShadow>
        <planeGeometry args={[34, 3.6]} />
        <meshStandardMaterial color="#eee8de" roughness={0.96} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 7.85]}>
        <planeGeometry args={[30, 0.18]} />
        <meshStandardMaterial color="#b7b1a6" />
      </mesh>
      <StreetLamp position={[-6.4, 0, 10.7]} />
      <StreetLamp position={[7.2, 0, 10.9]} />
      <mesh position={[19.6, 0.38, -6.2]} castShadow>
        <boxGeometry args={[1.7, 0.72, 3.7]} />
        <meshStandardMaterial color="#e4e7ea" metalness={0.25} roughness={0.45} />
      </mesh>
      <mesh position={[19.6, 0.62, -7.55]}>
        <boxGeometry args={[1.55, 0.28, 0.08]} />
        <meshStandardMaterial color="#9fd0e4" transparent opacity={0.7} />
      </mesh>
      <mesh position={[24.4, 0.4, 7.2]} castShadow>
        <boxGeometry args={[1.55, 0.7, 3.5]} />
        <meshStandardMaterial color="#1d3642" metalness={0.3} roughness={0.48} />
      </mesh>
      <mesh position={[-28, 6.5, -8]} castShadow>
        <boxGeometry args={[14, 15, 18]} />
        <meshStandardMaterial color="#e6ded2" roughness={0.92} />
      </mesh>
      <mesh position={[36, 8, -16]} castShadow>
        <boxGeometry args={[12, 18, 16]} />
        <meshStandardMaterial color="#d5dce2" roughness={0.9} />
      </mesh>
      {[-6, -3, 0, 3].map((z) => (
        <mesh key={`west-${z}`} position={[-21.05, 8, z]}>
          <boxGeometry args={[0.08, 1.3, 0.85]} />
          <meshStandardMaterial color="#9eb4b8" transparent opacity={0.55} />
        </mesh>
      ))}
      {[-2, 1, 4].map((z) => (
        <mesh key={`east-${z}`} position={[30.05, 9, z - 16]}>
          <boxGeometry args={[0.08, 1.4, 0.9]} />
          <meshStandardMaterial color="#d5e6ea" transparent opacity={0.5} />
        </mesh>
      ))}
      <Suspense fallback={null}>
        <Text position={[0, 0.05, 13.2]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.7} color="#8d8478" anchorX="center">
          NGUYEN HUE
        </Text>
        <Text position={[20.2, 0.05, -6]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} fontSize={0.55} color="#d5d0c8" anchorX="center">
          LE LOI
        </Text>
      </Suspense>
    </group>
  );
}

export function RexShell() {
  const roofY = guestFloorY(6);

  return (
    <group>
      <mesh position={[0, roofY / 2, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[BODY_W, roofY, BODY_D]} />
        <meshStandardMaterial color={WALL} roughness={0.78} />
      </mesh>
      <mesh position={[0, roofY / 2, 8.15]} castShadow>
        <boxGeometry args={[7.6, roofY + 0.7, 2.15]} />
        <meshStandardMaterial color={WALL} roughness={0.74} />
      </mesh>
      {[-2.4, -0.8, 0.8, 2.4].map((x) => (
        <mesh key={x} position={[x, roofY / 2, 9.2]}>
          <boxGeometry args={[0.16, roofY, 0.12]} />
          <meshStandardMaterial color={WALL_SHADE} />
        </mesh>
      ))}

      {UPPER.map((level) => {
        const y = guestFloorY(level);
        return (
          <group key={level}>
            <mesh position={[0, y, FRONT_Z + 0.08]}>
              <boxGeometry args={[BODY_W + 0.2, 0.12, 0.18]} />
              <meshStandardMaterial color={WALL_SHADE} />
            </mesh>
            {[-11.1, -8.5, -6.1, 6.1, 8.5, 11.1].map((x) => (
              <Window key={x} position={[x, y + 1.4, FRONT_Z + 0.12]} />
            ))}
            <Balcony position={[-8.6, y + 0.42, FRONT_Z + 0.48]} width={6.4} />
            <Balcony position={[8.6, y + 0.42, FRONT_Z + 0.48]} width={6.4} />
            {[-1.7, 0, 1.7].map((x) => (
              <Window key={`bay-${x}`} position={[x, y + 1.45, 9.28]} size={[1.05, 1.55]} />
            ))}
            <Balcony position={[0, y + 0.46, 9.55]} width={5.4} />
            {[-4.2, -1.4, 1.6, 4.4].map((z) => (
              <Window key={`side-${z}`} position={[SIDE_X + 0.12, y + 1.4, z]} rotationY={Math.PI / 2} />
            ))}
            <Balcony position={[SIDE_X + 0.42, y + 0.42, 0.2]} width={7.2} rotationY={Math.PI / 2} />
            {[-8.4, -4.2, 0, 4.2, 8.4].map((x) => (
              <Window key={`back-${x}`} position={[x, y + 1.4, -7.42]} />
            ))}
            {[-4, -1, 2, 5].map((z) => (
              <Window key={`west-${z}`} position={[-SIDE_X - 0.12, y + 1.4, z]} rotationY={Math.PI / 2} />
            ))}
          </group>
        );
      })}

      {[2, 3, 4].map((level) => (
        <mesh key={level} position={[-12.55, guestFloorY(level) + 1.45, FRONT_Z + 0.16]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.2, 18]} />
          <meshStandardMaterial color={GLASS} roughness={0.15} metalness={0.3} />
        </mesh>
      ))}

      <mesh position={[0, 1.7, 9.32]}>
        <boxGeometry args={[3.4, 2.35, 0.08]} />
        <meshStandardMaterial color="#1a242b" roughness={0.08} metalness={0.25} />
      </mesh>
      {[-9.6, -5.4, -1.2, 3.2, 7.6].map((x) => (
        <mesh key={`shop-${x}`} position={[x, 1.7, FRONT_Z + 0.16]}>
          <boxGeometry args={[3.3, 2.15, 0.06]} />
          <meshStandardMaterial color="#1a242b" roughness={0.08} metalness={0.25} />
        </mesh>
      ))}
      {[-4.6, -1.2, 2.2].map((z) => (
        <mesh key={`side-shop-${z}`} position={[SIDE_X + 0.14, 1.7, z]}>
          <boxGeometry args={[0.06, 2.15, 2.6]} />
          <meshStandardMaterial color="#1a242b" roughness={0.08} metalness={0.25} />
        </mesh>
      ))}
      {[-8.2, -2.6, 2.8, 8.2].map((x) => (
        <mesh key={x} position={[x, 1.85, FRONT_Z + 0.2]}>
          <boxGeometry args={[0.14, 2.55, 0.08]} />
          <meshStandardMaterial color={WALL} />
        </mesh>
      ))}
      <mesh position={[0, 3.25, 8.35]} castShadow>
        <boxGeometry args={[16.5, 0.08, 1.7]} />
        <meshStandardMaterial color="#fbfbfb" roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.22, 8.9]}>
        <boxGeometry args={[16.2, 0.05, 0.55]} />
        <meshStandardMaterial color="#d5ebe6" transparent opacity={0.45} roughness={0.05} />
      </mesh>

      <Suspense fallback={null}>
        <Text position={[0, roofY + 0.55, 9.42]} fontSize={0.62} color="#1a1a1a" anchorX="center" letterSpacing={0.08}>
          REX HOTEL
        </Text>
        <Text position={[4.15, roofY + 1.55, 8.2]} fontSize={0.28} color="#1a1a1a" anchorX="left">
          ROOFTOP GARDEN BAR
        </Text>
      </Suspense>
      <Crown position={[0.15, roofY + 0.95, 8.35]} />
      <mesh position={[-1.15, roofY + 2.55, 8.2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
        <meshStandardMaterial color="#8d8680" />
      </mesh>
      <mesh position={[-1.15, roofY + 3.15, 8.2]}>
        <boxGeometry args={[0.55, 0.32, 0.04]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
    </group>
  );
}

function Lounger({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.68, 0.07, 1.55]} />
        <meshStandardMaterial color="#f7f4ee" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.42, -0.58]} rotation={[0.55, 0, 0]}>
        <boxGeometry args={[0.68, 0.07, 0.48]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.9} />
      </mesh>
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.12, 0]}>
          <boxGeometry args={[0.05, 0.2, 1.45]} />
          <meshStandardMaterial color="#c4a15a" metalness={0.45} roughness={0.38} />
        </mesh>
      ))}
    </group>
  );
}

export function RoofGarden() {
  const { state } = useDemo();
  const water = useMemo(() => mapVariant("water", 2, 1), []);
  const surface = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    const map = surface.current?.map;
    if (!map || state.reducedMotion) return;
    map.offset.x = (map.offset.x + delta * 0.03) % 1;
  });

  return (
    <group>
      <mesh position={[0, -0.08, -0.1]}>
        <boxGeometry args={[25.2, 0.12, 14]} />
        <meshStandardMaterial color="#d9d0c2" roughness={0.88} />
      </mesh>
      <mesh position={[0, -0.02, -0.1]} receiveShadow castShadow>
        <boxGeometry args={[24.8, 0.16, 13.6]} />
        <meshStandardMaterial color="#f3f1ec" roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.45, 6.7]}>
        <boxGeometry args={[24.6, 0.7, 0.16]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      {[-8, -2, 4, 9].map((x) => (
        <group key={x} position={[x, 0.7, 6.2]}>
          <mesh>
            <boxGeometry args={[1.5, 0.45, 0.7]} />
            <meshStandardMaterial color="#6d5a48" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <coneGeometry args={[0.55, 0.7, 7]} />
            <meshStandardMaterial color={GREEN} roughness={0.8} />
          </mesh>
          {[ -0.28, 0.28 ].map((flower) => (
            <mesh key={flower} position={[flower, 0.72, 0.12]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={flower < 0 ? "#c4534a" : "#e7d27a"} />
            </mesh>
          ))}
        </group>
      ))}

      {[-6.2, -3.4, -0.6].map((x) => (
        <mesh key={x} position={[x, 1.55, -3.4]}>
          <boxGeometry args={[0.1, 3.1, 0.1]} />
          <meshStandardMaterial color="#2a3033" metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[-3.4, 3.05, -3.4]}>
        <boxGeometry args={[6.2, 0.08, 3.2]} />
        <meshStandardMaterial color="#2a3033" metalness={0.35} roughness={0.45} />
      </mesh>

      <mesh position={[4.4, 0.05, -1.6]} receiveShadow>
        <boxGeometry args={[6.9, 0.1, 2.85]} />
        <meshStandardMaterial color="#d9d3c8" roughness={0.8} />
      </mesh>
      <mesh position={[4.4, 0.06, -1.6]}>
        <boxGeometry args={[5.9, 0.16, 2.05]} />
        <meshStandardMaterial color="#0e3c46" roughness={0.4} />
      </mesh>
      <mesh position={[4.4, 0.16, -1.6]}>
        <boxGeometry args={[6.15, 0.05, 2.25]} />
        <meshStandardMaterial ref={surface} map={water ?? undefined} color="#8fd4d6" transparent opacity={0.92} roughness={0.08} metalness={0.18} />
      </mesh>
      <Lounger position={[0.55, 0, -0.2]} rotationY={Math.PI / 2} />
      <Lounger position={[8.2, 0, -0.15]} rotationY={-Math.PI / 2} />
      <Lounger position={[3.2, 0, 0.55]} />
      <Lounger position={[5.6, 0, 0.5]} />
      <group position={[-1.15, 0, 4.15]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[3.4, 1.05, 0.62]} />
          <meshStandardMaterial color="#4a3428" roughness={0.62} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[3.55, 0.08, 0.74]} />
          <meshStandardMaterial color="#edd9b4" roughness={0.42} />
        </mesh>
        {[-1.05, 0, 1.05].map((x) => (
          <mesh key={x} position={[x, 0.42, -0.62]}>
            <cylinderGeometry args={[0.16, 0.16, 0.48, 10]} />
            <meshStandardMaterial color="#2c5c57" roughness={0.75} />
          </mesh>
        ))}
        {[-0.8, 0, 0.8].map((x) => (
          <mesh key={`bottle-${x}`} position={[x, 1.28, 0.12]}>
            <cylinderGeometry args={[0.04, 0.045, 0.22, 8]} />
            <meshStandardMaterial color={x === 0 ? "#8d3d3d" : "#d7e7c8"} transparent opacity={0.9} />
          </mesh>
        ))}
        <Suspense fallback={null}>
          <Text position={[0, 1.55, 0.4]} fontSize={0.18} color="#1c1915" anchorX="center">
            ROOFTOP BAR
          </Text>
        </Suspense>
      </group>

      {[-5.8, -4.6, -3.4, -2.2, -1].map((x) => (
        <mesh key={`lamp-${x}`} position={[x, 2.55, -3.4]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color="#fff3d2" emissive="#ffc56a" emissiveIntensity={0.85} />
        </mesh>
      ))}

      {[
        [2.2, 1.5],
        [6.4, 1.4],
        [4.6, 2.4],
      ].map(([x, z]) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
            <meshStandardMaterial color="#f7f7f7" />
          </mesh>
          <mesh position={[0, 1.45, 0]}>
            <coneGeometry args={[0.7, 0.28, 14]} />
            <meshStandardMaterial color="#fbfbfb" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function LobbyFacade() {
  const pier = "#f7f4ee";
  return (
    <group>
      <mesh position={[0, 1.55, -7.2]} castShadow>
        <boxGeometry args={[26.2, 3.1, 0.18]} />
        <meshStandardMaterial color={pier} roughness={0.86} />
      </mesh>
      <mesh position={[0, 1.65, -7.05]}>
        <boxGeometry args={[2.4, 1.15, 0.06]} />
        <meshStandardMaterial color="#4a3428" roughness={0.65} />
      </mesh>
      <mesh position={[0, 1.65, -7.0]}>
        <boxGeometry args={[2.05, 0.82, 0.03]} />
        <meshStandardMaterial color="#1e4541" roughness={0.7} />
      </mesh>
      <mesh position={[-1.7, 1.55, -7.05]}>
        <boxGeometry args={[0.7, 0.9, 0.04]} />
        <meshStandardMaterial color="#c4a15a" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[1.7, 1.55, -7.05]}>
        <boxGeometry args={[0.7, 0.9, 0.04]} />
        <meshStandardMaterial color="#8d3d3d" roughness={0.7} />
      </mesh>
      <mesh position={[-13.1, 1.55, -0.1]} castShadow>
        <boxGeometry args={[0.18, 3.1, 14.2]} />
        <meshStandardMaterial color={pier} roughness={0.86} />
      </mesh>
      <mesh position={[13.1, 1.55, -0.15]} castShadow>
        <boxGeometry args={[0.18, 3.1, 13.6]} />
        <meshStandardMaterial color={pier} roughness={0.86} />
      </mesh>
      {[-2.4, 0.4, 3.2].map((z) => (
        <mesh key={z} position={[13.2, 1.55, z]}>
          <boxGeometry args={[0.04, 1.7, 1.5]} />
          <meshStandardMaterial color="#c5ddd8" transparent opacity={0.28} roughness={0.06} />
        </mesh>
      ))}
      <mesh position={[0, 2.95, 7.22]} castShadow>
        <boxGeometry args={[26.2, 0.32, 0.32]} />
        <meshStandardMaterial color="#efe8dc" roughness={0.7} />
      </mesh>
      {[-9.4, -5.4, 5.4, 9.4].map((x) => (
        <mesh key={x} position={[x, 1.45, 7.22]} castShadow>
          <boxGeometry args={[0.24, 2.9, 0.24]} />
          <meshStandardMaterial color={pier} roughness={0.8} />
        </mesh>
      ))}
      {[-10.4, -6.6, 6.6, 10.4].map((x) => (
        <mesh key={`shop-${x}`} position={[x, 1.4, 7.32]}>
          <boxGeometry args={[2.5, 2.05, 0.04]} />
          <meshStandardMaterial color="#c5ddd8" transparent opacity={0.2} roughness={0.05} />
        </mesh>
      ))}
      <mesh position={[0, 2.42, 7.28]}>
        <boxGeometry args={[2.8, 0.12, 0.14]} />
        <meshStandardMaterial color="#5c4030" roughness={0.6} />
      </mesh>
      {[-1.35, 1.35].map((x) => (
        <mesh key={`jamb-${x}`} position={[x, 1.15, 7.28]}>
          <boxGeometry args={[0.1, 2.35, 0.14]} />
          <meshStandardMaterial color="#5c4030" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 2.52, 8.2]} castShadow>
        <boxGeometry args={[7.6, 0.08, 2]} />
        <meshStandardMaterial color="#fbfbfb" roughness={0.42} />
      </mesh>
      <mesh position={[0, 2.46, 9.05]}>
        <boxGeometry args={[7.4, 0.045, 0.16]} />
        <meshStandardMaterial color="#c4a15a" metalness={0.5} roughness={0.32} />
      </mesh>
      {[0, 1, 2].map((step) => (
        <mesh key={step} position={[0, -0.02 - step * 0.07, 7.6 + step * 0.34]} receiveShadow>
          <boxGeometry args={[5.6, 0.08, 0.36]} />
          <meshStandardMaterial color="#e7dfd3" roughness={0.84} />
        </mesh>
      ))}
      <mesh position={[0, 0.035, 5.15]} receiveShadow>
        <boxGeometry args={[1.7, 0.02, 3.6]} />
        <meshStandardMaterial color="#7a3030" roughness={0.92} />
      </mesh>
      <Suspense fallback={null}>
        <Text position={[0, 2.78, 8.25]} fontSize={0.32} color="#1c1915" anchorX="center" letterSpacing={0.14}>
          REX HOTEL
        </Text>
      </Suspense>
    </group>
  );
}
