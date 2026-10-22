"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { ACESFilmicToneMapping } from "three";
import { HotelScene } from "./HotelScene";

export default function HotelCanvas({ quality }: { quality: "high" | "low" }) {
  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={quality === "high" ? [1, 1.6] : [1, 1.15]}
      shadows={quality === "high"}
      camera={{ position: [52, 38, 52], fov: 36, near: 0.1, far: 280 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Suspense fallback={null}>
        <HotelScene quality={quality} />
      </Suspense>
    </Canvas>
  );
}
