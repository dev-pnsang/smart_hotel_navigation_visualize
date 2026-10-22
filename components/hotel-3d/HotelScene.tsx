"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PointLight } from "three";
import { useDemo } from "@/lib/demo-store";
import { navRuntime } from "@/lib/nav-runtime";
import { FloorTransition } from "./FloorTransition";
import { HotelBuilding } from "./HotelBuilding";
import { NavigationCamera } from "./NavigationCamera";
import { NavigationMarkers } from "./NavigationMarkers";
import { NavigationRoute } from "./NavigationRoute";

function GuideLight() {
  const ref = useRef<PointLight>(null);
  const { state } = useDemo();

  useFrame(() => {
    const light = ref.current;
    if (!light) return;
    light.position.set(navRuntime.x, navRuntime.y + 2.05, navRuntime.z);
    light.intensity = state.cameraMode === "guided" ? 14 : 4.5;
  });

  return <pointLight ref={ref} color="#fff1dc" intensity={5} distance={12} decay={2} />;
}

export function HotelScene({ quality }: { quality: "high" | "low" }) {
  return (
    <>
      <color attach="background" args={["#c5d6e0"]} />
      <fog attach="fog" args={["#c5d6e0", 58, 168]} />
      <hemisphereLight args={["#f7f4ee", "#b7c3c6", 0.82]} />
      <ambientLight intensity={0.26} />
      <directionalLight
        position={[26, 48, 18]}
        intensity={1.7}
        color="#fff6ea"
        castShadow={quality === "high"}
        shadow-mapSize-width={quality === "high" ? 2048 : 512}
        shadow-mapSize-height={quality === "high" ? 2048 : 512}
        shadow-bias={-0.00025}
        shadow-normalBias={0.04}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-camera-left={-46}
        shadow-camera-right={46}
        shadow-camera-top={46}
        shadow-camera-bottom={-46}
      />
      <directionalLight position={[-20, 24, -14]} intensity={0.42} color="#d7e7ea" />
      <GuideLight />
      <HotelBuilding />
      <NavigationRoute />
      <NavigationMarkers />
      <FloorTransition />
      <NavigationCamera />
    </>
  );
}
