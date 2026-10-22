import { guestFloorY, NORTH_Z, ROOM_X, SOUTH_Z } from "./spatial";
import type { FloorId, RoomRecord } from "./types";

const northTypes = ["Classic", "Deluxe", "Suite", "Superior", "Classic"];
const southTypes = ["Superior", "Deluxe", "Deluxe King", "Suite", "Classic"];

function roomsFor(level: number, floorId: FloorId): RoomRecord[] {
  const y = guestFloorY(level);
  const base = level * 100;
  const rooms: RoomRecord[] = [];

  ROOM_X.forEach((x, index) => {
    const northNumber = base + 1 + index;
    rooms.push({
      id: `room-${northNumber}`,
      number: String(northNumber),
      floorId,
      type: northTypes[index] ?? "Classic",
      facing: "north",
      position: [x, y, NORTH_Z],
      nodeId: `room-${northNumber}`,
    });

    const southNumber = base + 6 + index;
    rooms.push({
      id: `room-${southNumber}`,
      number: String(southNumber),
      floorId,
      type: southTypes[index] ?? "Classic",
      facing: "south",
      position: [x, y, SOUTH_Z],
      nodeId: `room-${southNumber}`,
    });
  });

  return rooms;
}

export const rooms: RoomRecord[] = [
  ...roomsFor(2, "floor-2"),
  ...roomsFor(4, "floor-4"),
];

const byId = new Map(rooms.map((room) => [room.id, room]));

export function getRoom(id: string) {
  return byId.get(id);
}

export function roomsOnFloor(floorId: string) {
  return rooms.filter((room) => room.floorId === floorId);
}
