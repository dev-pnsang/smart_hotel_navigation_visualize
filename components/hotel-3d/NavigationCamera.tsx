"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3, type PerspectiveCamera } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { getFloor } from "@/data/demo-hotel/floors";
import { floorLift } from "@/data/demo-hotel/spatial";
import { useDemo } from "@/lib/demo-store";
import { navRuntime } from "@/lib/nav-runtime";

export function NavigationCamera() {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const { state, steps } = useDemo();
  const stateRef = useRef(state);
  const stepsRef = useRef(steps);
  useEffect(() => {
    stateRef.current = state;
    stepsRef.current = steps;
  });
  const desired = useRef(new Vector3(48, 36, 48));
  const lookTarget = useRef(new Vector3(0, 14, 0));
  const look = useRef(new Vector3(0, 14, 0));
  const signature = useRef("");
  const blending = useRef(true);

  useFrame((_, delta) => {
    const current = stateRef.current;
    const isolated = current.cameraMode !== "isometric";
    const floor = getFloor(current.selectedFloorId);
    const lift = floor ? floorLift(floor.id, current.explode, isolated) : 0;
    const floorY = (floor?.y ?? 0) + lift;
    const sig = [
      current.cameraMode,
      current.selectedFloorId,
      current.floorView,
      current.explode.toFixed(2),
      current.cameraNonce,
      current.replayNonce,
    ].join("|");

    if (sig !== signature.current) {
      signature.current = sig;
      blending.current = true;
      if (controls.current) controls.current.enabled = false;
      if (current.cameraMode === "guided") navRuntime.snap = true;
    }

    if (current.cameraMode === "guided") {
      const riding = stepsRef.current[current.navStepIndex]?.kind === "vertical";
      if (riding) {
        desired.current.set(16, floorY + 15, 18);
        lookTarget.current.set(0, floorY + 0.5, 0);
      } else {
        const forwardX = navRuntime.lookX - navRuntime.x;
        const forwardZ = navRuntime.lookZ - navRuntime.z;
        const span = Math.hypot(forwardX, forwardZ);
        const dirX = span > 0.2 ? forwardX / span : 0;
        const dirZ = span > 0.2 ? forwardZ / span : -1;
        const lobby = current.selectedFloorId === "floor-1";
        const side = lobby ? 6.8 : 7.6;
        const back = lobby ? 3.8 : 4.4;
        const height = lobby ? 5.8 : 7.2;
        desired.current.set(
          navRuntime.x + dirZ * side - dirX * back,
          navRuntime.y + height,
          navRuntime.z - dirX * side - dirZ * back,
        );
        lookTarget.current.set(navRuntime.lookX, navRuntime.lookY + 0.85, navRuntime.lookZ);
      }
      blending.current = true;
    } else if (current.cameraMode === "floor") {
      if (current.floorView === "top") {
        desired.current.set(0.2, floorY + 26, 0.2);
        lookTarget.current.set(0, floorY, 0);
      } else {
        desired.current.set(18, floorY + 16, 20);
        lookTarget.current.set(0, floorY, 0);
      }
    } else if (current.cameraMode === "explore") {
      desired.current.set(11, floorY + 9.5, 13);
      lookTarget.current.set(0, floorY + 0.6, 0);
    } else {
      const span = 40 + current.explode * 14;
      desired.current.set(span * 0.92, span * 0.56, span);
      lookTarget.current.set(0.4, 7.4 + current.explode * 3.2, 1.4);
    }

    const perspective = camera as PerspectiveCamera;
    const guided = current.cameraMode === "guided";
    const nextFov = guided ? 50 : 36;
    if (Math.abs(perspective.fov - nextFov) > 0.1) {
      perspective.fov = nextFov;
      perspective.updateProjectionMatrix();
    }
    const scripted = guided || blending.current;
    if (navRuntime.snap && guided) {
      perspective.position.copy(desired.current);
      look.current.copy(lookTarget.current);
      navRuntime.snap = false;
    } else if (scripted) {
      const lambda = 1 - Math.exp(-delta * (current.reducedMotion ? 18 : guided ? 4.2 : 2.5));
      perspective.position.lerp(desired.current, lambda);
      look.current.lerp(lookTarget.current, lambda);
    }
    if (scripted) perspective.lookAt(look.current);

    const orbit = controls.current;
    if (!orbit) return;
    if (scripted) orbit.target.copy(look.current);
    const limits =
      current.cameraMode === "explore"
        ? { min: 6, max: 24, minPolar: 0.4, maxPolar: 1.15 }
        : current.cameraMode === "floor"
          ? current.floorView === "top"
            ? { min: 12, max: 42, minPolar: 0.05, maxPolar: 0.55 }
            : { min: 8, max: 42, minPolar: 0.2, maxPolar: 1.15 }
          : { min: 16, max: 120, minPolar: 0.28, maxPolar: Math.PI / 2.05 };
    orbit.minDistance = limits.min;
    orbit.maxDistance = limits.max;
    orbit.minPolarAngle = limits.minPolar;
    orbit.maxPolarAngle = limits.maxPolar;
    orbit.enablePan = current.cameraMode !== "guided";

    const allowOrbit = current.cameraMode !== "guided";
    if (allowOrbit && blending.current && perspective.position.distanceTo(desired.current) < 0.35) {
      blending.current = false;
    }
    const enable = allowOrbit && !blending.current;
    if (enable !== orbit.enabled) {
      orbit.enabled = enable;
      orbit.update();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      enabled={false}
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2.05}
    />
  );
}
