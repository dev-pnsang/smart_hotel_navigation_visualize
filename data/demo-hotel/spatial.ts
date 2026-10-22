import type { FloorId, Vec3 } from "./types";

export const METERS_PER_UNIT = 2.15;
export const STORY = 3.2;
export const PODIUM_HEIGHT = 4.4;
export const WALL_H = 2.58;
export const EYE_HEIGHT = 1.58;

export const ROOM_W = 3.36;
export const ROOM_D = 4.7;
export const PARTITION = 0.18;
export const PITCH = ROOM_W + PARTITION;

export const ROOM_X: [number, number, number, number, number] = [
  -2 * PITCH,
  -PITCH,
  0,
  PITCH,
  2 * PITCH,
];

export const CORRIDOR_HALF_Z = 1.2;
export const NORTH_Z = -(CORRIDOR_HALF_Z + ROOM_D / 2);
export const SOUTH_Z = CORRIDOR_HALF_Z + ROOM_D / 2;
export const DOOR_Z = 0.96;

export const ELEVATOR_X = -10.15;
export const STAIRS_X = 10.15;
export const ELEVATOR_DOOR_X = -8.95;
export const STAIRS_DOOR_X = 8.95;

export const RESTAURANT: Vec3 = [11.1, 0, -5.4];
export const PARADISE: Vec3 = [-11.4, 0, -5.5];
export const ROOF_POOL: Vec3 = [4.4, 0, -1.6];
export const ROOFTOP_BAR: Vec3 = [-1.2, 0, 2.8];

export function guestFloorY(level: number) {
  return PODIUM_HEIGHT + (level - 2) * STORY;
}

export function floorLift(floorId: FloorId, explode: number, isolated: boolean) {
  if (isolated || explode <= 0) return 0;
  if (floorId === "floor-1") return 0;
  if (floorId === "floor-2") return explode * 3.5;
  if (floorId === "floor-4") return explode * 8;
  return explode * 12.2;
}

export function midFloorLift(level: number, explode: number, isolated: boolean) {
  if (isolated || explode <= 0) return 0;
  if (level <= 3) return explode * 5.6;
  return explode * 10;
}

export function metersBetween(
  a: Vec3,
  b: Vec3,
  kind: "corridor" | "elevator" | "stairs",
  levelDelta = 0,
) {
  if (kind === "corridor") {
    const units = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    return Math.max(1, Math.round(units * METERS_PER_UNIT));
  }
  const vertical = Math.max(1, levelDelta) * 3.2;
  if (kind === "elevator") return Math.round(vertical + 8);
  return Math.round(vertical * 2 + 12);
}
