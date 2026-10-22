import { guestFloorY } from "./spatial";
import type { HotelFloor } from "./types";

export const floors: HotelFloor[] = [
  { id: "floor-1", level: 1, y: 0, name: "Tầng trệt", short: "1", kind: "lobby" },
  {
    id: "floor-2",
    level: 2,
    y: guestFloorY(2),
    name: "Tầng 2",
    short: "2",
    kind: "guest",
  },
  {
    id: "floor-4",
    level: 4,
    y: guestFloorY(4),
    name: "Tầng 4",
    short: "4",
    kind: "guest",
  },
  {
    id: "floor-6",
    level: 6,
    y: guestFloorY(6),
    name: "Sân thượng",
    short: "6",
    kind: "roof",
  },
];

const byId = new Map(floors.map((floor) => [floor.id, floor]));

export function getFloor(id: string) {
  return byId.get(id as HotelFloor["id"]);
}

export function floorLevel(id: string) {
  return getFloor(id)?.level ?? 1;
}
