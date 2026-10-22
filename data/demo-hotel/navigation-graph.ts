import { floorLevel, floors } from "./floors";
import { rooms } from "./rooms";
import {
  DOOR_Z,
  ELEVATOR_DOOR_X,
  ELEVATOR_X,
  metersBetween,
  PARADISE,
  RESTAURANT,
  ROOF_POOL,
  ROOFTOP_BAR,
  ROOM_X,
  STAIRS_DOOR_X,
  STAIRS_X,
} from "./spatial";
import type { EdgeType, FloorId, HotelEdge, HotelNode, NavigationGraph, NodeKind, Vec3 } from "./types";

function floorY(floorId: FloorId) {
  return floors.find((floor) => floor.id === floorId)?.y ?? 0;
}

function makeNode(
  id: string,
  floorId: FloorId,
  x: number,
  z: number,
  kind: NodeKind,
  label: string,
  y = floorY(floorId),
): HotelNode {
  return { id, floorId, position: [x, y, z], kind, label };
}

function link(
  edges: HotelEdge[],
  from: HotelNode,
  to: HotelNode,
  type: EdgeType,
) {
  const levelDelta =
    type === "corridor" ? 0 : Math.abs(floorLevel(from.floorId) - floorLevel(to.floorId));
  edges.push({
    id: `${from.id}__${to.id}`,
    from: from.id,
    to: to.id,
    distance: metersBetween(from.position, to.position, type, levelDelta),
    type,
    accessible: true,
  });
}

function chain(edges: HotelEdge[], nodes: HotelNode[], type: EdgeType = "corridor") {
  for (let index = 0; index < nodes.length - 1; index += 1) {
    link(edges, nodes[index], nodes[index + 1], type);
  }
}

function addGuestFloor(floorId: FloorId, nodes: HotelNode[], edges: HotelEdge[]) {
  const suffix = floorId.replace("floor-", "f");
  const elevator = makeNode(`elev-${suffix}`, floorId, ELEVATOR_X, 0, "elevator", "Thang máy");
  const elevatorDoor = makeNode(
    `door-elev-${suffix}`,
    floorId,
    ELEVATOR_DOOR_X,
    0,
    "junction",
    "Sảnh thang máy",
  );
  const corridor = ROOM_X.map((x, index) =>
    makeNode(`${floorId}-c${index}`, floorId, x, 0, "junction", "Hành lang"),
  );
  const stairDoor = makeNode(
    `door-stairs-${suffix}`,
    floorId,
    STAIRS_DOOR_X,
    0,
    "junction",
    "Cầu thang",
  );
  const stairs = makeNode(`stairs-${suffix}`, floorId, STAIRS_X, 0, "stairs", "Cầu thang");

  nodes.push(elevator, elevatorDoor, ...corridor, stairDoor, stairs);
  chain(edges, [elevator, elevatorDoor, ...corridor, stairDoor, stairs]);

  rooms
    .filter((room) => room.floorId === floorId)
    .forEach((room) => {
      const doorZ = room.facing === "south" ? DOOR_Z : -DOOR_Z;
      const door = makeNode(
        room.nodeId,
        floorId,
        room.position[0],
        doorZ,
        "room",
        room.number,
        room.position[1],
      );
      nodes.push(door);
      const corridorIndex = ROOM_X.findIndex((x) => Math.abs(x - room.position[0]) < 0.01);
      if (corridorIndex >= 0) link(edges, corridor[corridorIndex], door, "corridor");
    });
}

function addRoof(nodes: HotelNode[], edges: HotelEdge[]) {
  const floorId: FloorId = "floor-6";
  const elevator = makeNode("elev-f6", floorId, ELEVATOR_X, 0, "elevator", "Thang máy");
  const elevatorDoor = makeNode("door-elev-f6", floorId, ELEVATOR_DOOR_X, 0, "junction", "Sảnh thang máy");
  const landing = makeNode("roof-hall", floorId, -4.2, 0, "junction", "Sân thượng");
  const pool = makeNode("pool", floorId, ROOF_POOL[0], ROOF_POOL[2], "amenity", "Hồ bơi");
  const bar = makeNode("rooftop-bar", floorId, ROOFTOP_BAR[0], ROOFTOP_BAR[2], "amenity", "Rooftop Garden Bar");

  nodes.push(elevator, elevatorDoor, landing, pool, bar);
  chain(edges, [elevator, elevatorDoor, landing, bar]);
  link(edges, landing, pool, "corridor");
}

function build(): NavigationGraph {
  const nodes: HotelNode[] = [];
  const edges: HotelEdge[] = [];
  const floorId: FloorId = "floor-1";

  const reception = makeNode("lobby-reception", floorId, 0, 2.55, "lobby", "Lễ tân");
  const spine = ROOM_X.map((x, index) =>
    makeNode(`f1-c${index}`, floorId, x, 0, "junction", "Sảnh"),
  );
  const elevatorDoor = makeNode("door-elev-f1", floorId, ELEVATOR_DOOR_X, 0, "junction", "Sảnh thang máy");
  const elevator = makeNode("elev-f1", floorId, ELEVATOR_X, 0, "elevator", "Thang máy");
  const stairDoor = makeNode("door-stairs-f1", floorId, STAIRS_DOOR_X, 0, "junction", "Cầu thang");
  const stairs = makeNode("stairs-f1", floorId, STAIRS_X, 0, "stairs", "Cầu thang");

  const restEntry = makeNode("rest-entry", floorId, ROOM_X[4], -1.7, "junction", "Hoa Mai");
  const restCorner: HotelNode = makeNode("rest-corner", floorId, RESTAURANT[0], -1.7, "junction", "Hoa Mai");
  const restaurant = makeNode("restaurant", floorId, RESTAURANT[0], RESTAURANT[2], "amenity", "Hoa Mai");

  const coffeeEntry = makeNode("paradise-entry", floorId, ROOM_X[0], -1.7, "junction", "Paradise Coffee");
  const coffeeCorner = makeNode("paradise-corner", floorId, PARADISE[0], -1.7, "junction", "Paradise Coffee");
  const paradise = makeNode("paradise", floorId, PARADISE[0], PARADISE[2], "amenity", "Paradise Coffee");

  nodes.push(
    reception,
    ...spine,
    elevatorDoor,
    elevator,
    stairDoor,
    stairs,
    restEntry,
    restCorner,
    restaurant,
    coffeeEntry,
    coffeeCorner,
    paradise,
  );

  link(edges, reception, spine[2], "corridor");
  chain(edges, [elevator, elevatorDoor, spine[0], spine[1], spine[2], spine[3], spine[4], stairDoor, stairs]);
  chain(edges, [spine[4], restEntry, restCorner, restaurant]);
  chain(edges, [spine[0], coffeeEntry, coffeeCorner, paradise]);

  addGuestFloor("floor-2", nodes, edges);
  addGuestFloor("floor-4", nodes, edges);
  addRoof(nodes, edges);

  const elevators = ["elev-f1", "elev-f2", "elev-f4", "elev-f6"]
    .map((id) => nodes.find((node) => node.id === id))
    .filter((node): node is HotelNode => Boolean(node));
  const stairCores = ["stairs-f1", "stairs-f2", "stairs-f4"]
    .map((id) => nodes.find((node) => node.id === id))
    .filter((node): node is HotelNode => Boolean(node));

  for (let a = 0; a < elevators.length; a += 1) {
    for (let b = a + 1; b < elevators.length; b += 1) {
      link(edges, elevators[a], elevators[b], "elevator");
    }
  }
  for (let a = 0; a < stairCores.length; a += 1) {
    for (let b = a + 1; b < stairCores.length; b += 1) {
      link(edges, stairCores[a], stairCores[b], "stairs");
    }
  }

  return { nodes, edges };
}

export const navigationGraph = build();

export const nodeById = new Map(navigationGraph.nodes.map((node) => [node.id, node]));

const edgeByPair = new Map<string, HotelEdge>();
for (const edge of navigationGraph.edges) {
  edgeByPair.set(`${edge.from}__${edge.to}`, edge);
  edgeByPair.set(`${edge.to}__${edge.from}`, edge);
}

export function findEdge(from: string, to: string) {
  return edgeByPair.get(`${from}__${to}`);
}

export function nodePosition(id: string): Vec3 | undefined {
  return nodeById.get(id)?.position;
}
