"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { nodeById } from "@/data/demo-hotel/navigation-graph";

type HotelAmenityProps = {
  nodeId: string;
  amenityId: string;
  selected: boolean;
  onSelect: (amenityId: string) => void;
};

export function HotelAmenity({ nodeId, amenityId, selected, onSelect }: HotelAmenityProps) {
  const node = nodeById.get(nodeId);
  if (!node) return null;

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(amenityId);
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
    <group position={[node.position[0], 0.03, node.position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} {...pointer}>
        <ringGeometry args={[0.5, 0.74, 32]} />
        <meshStandardMaterial
          color={selected ? "#e0c48a" : "#2c5c57"}
          emissive={selected ? "#8a6420" : "#143e3b"}
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} {...pointer}>
        <circleGeometry args={[0.28, 24]} />
        <meshStandardMaterial color="#f7f3ea" />
      </mesh>
      <mesh position={[0, 0.72, 0]} {...pointer}>
        <cylinderGeometry args={[0.03, 0.045, 1.35, 10]} />
        <meshStandardMaterial color="#c4a15a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.48, 0]}>
        <boxGeometry args={[0.7, 0.38, 0.05]} />
        <meshStandardMaterial color="#f7f3ea" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.48, 0.03]}>
        <boxGeometry args={[0.42, 0.08, 0.015]} />
        <meshStandardMaterial color={selected ? "#b89a62" : "#2c5c57"} />
      </mesh>
    </group>
  );
}
