"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BufferGeometry, DoubleSide, Float32BufferAttribute, type MeshBasicMaterial } from "three";
import { useDemo } from "@/lib/demo-store";
import { mapVariant } from "./textures";
import type { RouteSegment } from "./use-route";
import { useVisibleRoute } from "./use-route";

function ribbonGeometry(segments: RouteSegment[]) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const normals: number[] = [];
  let travel = 0;
  let previous: RouteSegment | null = null;

  for (const segment of segments) {
    if (segment.vertical) continue;
    const run = Math.hypot(segment.bx - segment.ax, segment.bz - segment.az);
    if (run < 0.08) continue;
    const connected =
      previous &&
      Math.hypot(previous.bx - segment.ax, previous.bz - segment.az) < 0.08;
    if (!connected) travel = 0;
    const dx = segment.bx - segment.ax;
    const dz = segment.bz - segment.az;
    const half = 0.34;
    const px = (-dz / run) * half;
    const pz = (dx / run) * half;
    const y0 = segment.ay + 0.035;
    const y1 = segment.by + 0.035;
    const v1 = travel + run / 1.25;
    const quad = [
      [segment.ax + px, y0, segment.az + pz, 0, travel],
      [segment.ax - px, y0, segment.az - pz, 1, travel],
      [segment.bx - px, y1, segment.bz - pz, 1, v1],
      [segment.ax + px, y0, segment.az + pz, 0, travel],
      [segment.bx - px, y1, segment.bz - pz, 1, v1],
      [segment.bx + px, y1, segment.bz + pz, 0, v1],
    ];
    for (const [x, y, z, u, v] of quad) {
      positions.push(x, y, z);
      uvs.push(u, v);
      normals.push(0, 1, 0);
    }
    travel = v1;
    previous = segment;
  }

  if (positions.length === 0) return null;
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  return geometry;
}

export function NavigationRoute() {
  const { state } = useDemo();
  const { segments } = useVisibleRoute();
  const geometry = useMemo(() => ribbonGeometry(segments), [segments]);
  const guide = useMemo(() => mapVariant("guide", 1, 1), []);
  const ribbon = useRef<MeshBasicMaterial>(null);

  useEffect(() => {
    return () => geometry?.dispose();
  }, [geometry]);

  useFrame((_, delta) => {
    const map = ribbon.current?.map;
    if (!map || state.reducedMotion) return;
    map.offset.y = (map.offset.y - delta * 0.55) % 1;
  });

  const caps = useMemo(() => {
    const horizontal = segments.filter((segment) => !segment.vertical && segment.len > 0.08);
    if (horizontal.length === 0) return [];
    const first = horizontal[0];
    const last = horizontal[horizontal.length - 1];
    return [
      [first.ax, first.ay + 0.035, first.az],
      [last.bx, last.by + 0.035, last.bz],
    ];
  }, [segments]);

  if (!geometry) return null;

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          ref={ribbon}
          color="#ffffff"
          map={guide}
          side={DoubleSide}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>
      {caps.map(([x, y, z]) => (
        <mesh key={`${x}-${z}`} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.34, 20]} />
          <meshStandardMaterial color="#176860" emissive="#0e3c38" emissiveIntensity={0.35} roughness={0.4} />
        </mesh>
      ))}
      {segments
        .filter((segment) => segment.vertical && segment.len > 0.3)
        .map((segment) => (
          <mesh
            key={`${segment.ax}-${segment.ay}-${segment.by}`}
            position={[(segment.ax + segment.bx) / 2, (segment.ay + segment.by) / 2, (segment.az + segment.bz) / 2]}
          >
            <cylinderGeometry args={[0.09, 0.09, Math.abs(segment.by - segment.ay), 12]} />
            <meshStandardMaterial color="#f6f1e6" emissive="#176860" emissiveIntensity={0.55} transparent opacity={0.72} />
          </mesh>
        ))}
    </group>
  );
}
