export type FloorId = "floor-1" | "floor-2" | "floor-4" | "floor-6";

export type Vec3 = [number, number, number];

export type NodeKind =
  | "lobby"
  | "junction"
  | "elevator"
  | "stairs"
  | "room"
  | "amenity";

export type EdgeType = "corridor" | "elevator" | "stairs";

export type HotelNode = {
  id: string;
  floorId: FloorId;
  position: Vec3;
  kind: NodeKind;
  label: string;
};

export type HotelEdge = {
  id: string;
  from: string;
  to: string;
  distance: number;
  type: EdgeType;
  accessible: boolean;
};

export type NavigationGraph = {
  nodes: HotelNode[];
  edges: HotelEdge[];
};

export type RoomRecord = {
  id: string;
  number: string;
  floorId: FloorId;
  type: string;
  facing: "north" | "south";
  position: Vec3;
  nodeId: string;
};

export type AmenityKind = "lobby" | "dining" | "wellness" | "circulation" | "stay";

export type AmenityRecord = {
  id: string;
  nodeId: string;
  name: string;
  kind: AmenityKind;
  floorId: FloorId;
  summary: string;
};

export type HotelFloor = {
  id: FloorId;
  level: number;
  y: number;
  name: string;
  short: string;
  kind: "lobby" | "guest" | "roof";
};
