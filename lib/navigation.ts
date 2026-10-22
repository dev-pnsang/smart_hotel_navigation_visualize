import { findEdge, nodeById } from "@/data/demo-hotel/navigation-graph";
import { floorLevel } from "@/data/demo-hotel/floors";
import type { HotelNode, Vec3 } from "@/data/demo-hotel/types";

export type NavStep = {
  id: string;
  kind: "walk" | "vertical";
  via: "corridor" | "elevator" | "stairs";
  instruction: string;
  points: Vec3[];
  fromFloorId: string;
  toFloorId: string;
  distanceM: number;
  durationMs: number;
  toNodeId: string;
};

export type RouteSample = {
  x: number;
  y: number;
  z: number;
  lookX: number;
  lookY: number;
  lookZ: number;
};

function turnAngle(a: Vec3, b: Vec3, c: Vec3) {
  const v1x = b[0] - a[0];
  const v1z = b[2] - a[2];
  const v2x = c[0] - b[0];
  const v2z = c[2] - b[2];
  const len1 = Math.hypot(v1x, v1z);
  const len2 = Math.hypot(v2x, v2z);
  if (len1 < 0.001 || len2 < 0.001) return 0;
  const cos = Math.min(1, Math.max(-1, (v1x * v2x + v1z * v2z) / (len1 * len2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

function walkInstruction(from: HotelNode, to: HotelNode) {
  if (to.kind === "room") return `Đến cửa phòng ${to.label}.`;
  if (to.kind === "amenity") return `Đi tới ${to.label}.`;
  if (to.kind === "elevator") return "Đi thẳng tới thang máy.";
  if (to.kind === "stairs") return "Đi tới cầu thang.";
  if (from.kind === "elevator") return "Ra khỏi thang máy và đi dọc hành lang.";
  if (from.kind === "stairs") return "Ra khỏi cầu thang và đi tiếp.";
  if (from.kind === "lobby") return "Rời quầy lễ tân và đi ra hành lang.";
  return "Đi thẳng dọc hành lang.";
}

function verticalInstruction(from: HotelNode, to: HotelNode, via: "elevator" | "stairs") {
  const level = floorLevel(to.floorId);
  if (via === "stairs") return `Đi cầu thang để đến tầng ${level}.`;
  if (from.floorId === to.floorId) return "Ở lại thang máy.";
  return `Vào thang máy để đến tầng ${level}.`;
}

export function buildSteps(nodeIds: string[], reducedMotion: boolean): NavStep[] {
  if (nodeIds.length < 2) return [];
  type Piece = { from: HotelNode; to: HotelNode; distance: number; via: NavStep["via"] };
  const pieces: Piece[] = [];

  for (let index = 0; index < nodeIds.length - 1; index += 1) {
    const from = nodeById.get(nodeIds[index]);
    const to = nodeById.get(nodeIds[index + 1]);
    const edge = findEdge(nodeIds[index], nodeIds[index + 1]);
    if (!from || !to || !edge) continue;
    pieces.push({ from, to, distance: edge.distance, via: edge.type });
  }

  const groups: Piece[][] = [];
  for (const piece of pieces) {
    const current = groups[groups.length - 1];
    const previous = current?.[current.length - 1];
    const breaks =
      !current ||
      !previous ||
      piece.via !== "corridor" ||
      previous.via !== "corridor" ||
      turnAngle(previous.from.position, previous.to.position, piece.to.position) > 48;
    if (breaks) groups.push([piece]);
    else current.push(piece);
  }

  return groups.map((group, index) => {
    const first = group[0];
    const last = group[group.length - 1];
    const vertical = first.via !== "corridor";
    const distanceM = group.reduce((sum, piece) => sum + piece.distance, 0);
    const durationMs = vertical
      ? reducedMotion
        ? 900
        : 4800
      : Math.min(
          reducedMotion ? 1400 : 8800,
          Math.max(reducedMotion ? 700 : 3400, distanceM * (reducedMotion ? 42 : 115)),
        );
    const points = [first.from.position, ...group.map((piece) => piece.to.position)];
    return {
      id: `step-${index}-${first.from.id}-${last.to.id}`,
      kind: vertical ? "vertical" : "walk",
      via: first.via,
      instruction: vertical
        ? verticalInstruction(first.from, last.to, first.via === "stairs" ? "stairs" : "elevator")
        : walkInstruction(first.from, last.to),
      points,
      fromFloorId: first.from.floorId,
      toFloorId: last.to.floorId,
      distanceM,
      durationMs,
      toNodeId: last.to.id,
    };
  });
}

export function pathDistance(nodeIds: string[]) {
  let total = 0;
  for (let index = 0; index < nodeIds.length - 1; index += 1) {
    total += findEdge(nodeIds[index], nodeIds[index + 1])?.distance ?? 0;
  }
  return total;
}

export function polylineLength(points: readonly Vec3[]) {
  let total = 0;
  for (let index = 0; index < points.length - 1; index += 1) {
    const a = points[index];
    const b = points[index + 1];
    total += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  }
  return total;
}

function writeAt(points: readonly Vec3[], distance: number, target: "pos" | "look", sample: RouteSample) {
  let remain = Math.max(0, distance);
  for (let index = 0; index < points.length - 1; index += 1) {
    const a = points[index];
    const b = points[index + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    if (remain <= len || index === points.length - 2) {
      const u = len === 0 ? 0 : Math.min(1, remain / len);
      const x = a[0] + (b[0] - a[0]) * u;
      const y = a[1] + (b[1] - a[1]) * u;
      const z = a[2] + (b[2] - a[2]) * u;
      if (target === "pos") {
        sample.x = x;
        sample.y = y;
        sample.z = z;
      } else {
        sample.lookX = x;
        sample.lookY = y;
        sample.lookZ = z;
      }
      return;
    }
    remain -= len;
  }
}

const scratch: RouteSample = { x: 0, y: 0, z: 0, lookX: 0, lookY: 0, lookZ: 0 };

export function sampleStep(step: NavStep, progress: number): RouteSample {
  const points = step.points;
  const clamped = Math.min(1, Math.max(0, progress));
  if (points.length === 0) return scratch;

  if (step.kind === "vertical") {
    const point = clamped > 0.5 ? points[points.length - 1] : points[0];
    const sign = step.via === "stairs" ? -1 : 1;
    scratch.x = point[0];
    scratch.y = point[1];
    scratch.z = point[2];
    scratch.lookX = point[0] + sign * 3.2;
    scratch.lookY = point[1];
    scratch.lookZ = point[2];
    return scratch;
  }

  const length = Math.max(0.001, polylineLength(points));
  const distance = Math.min(length, clamped * length);
  writeAt(points, distance, "pos", scratch);
  writeAt(points, Math.min(length, distance + 1.8), "look", scratch);
  if (Math.hypot(scratch.lookX - scratch.x, scratch.lookZ - scratch.z) < 0.3) {
    const last = points[points.length - 1];
    const prev = points[Math.max(0, points.length - 2)];
    const dx = last[0] - prev[0];
    const dz = last[2] - prev[2];
    const mag = Math.hypot(dx, dz) || 1;
    scratch.lookX = scratch.x + (dx / mag) * 2;
    scratch.lookZ = scratch.z + (dz / mag) * 2;
    scratch.lookY = scratch.y;
  }
  return scratch;
}

export function overallProgress(steps: NavStep[], index: number, stepProgress: number) {
  const total = steps.reduce((sum, step) => sum + step.durationMs, 0);
  if (total <= 0) return 0;
  let before = 0;
  for (let cursor = 0; cursor < index && cursor < steps.length; cursor += 1) {
    before += steps[cursor].durationMs;
  }
  const current = steps[index]?.durationMs ?? 0;
  return Math.min(1, (before + current * Math.min(1, Math.max(0, stepProgress))) / total);
}

export function doorAmount(progress: number) {
  if (progress < 0.2) return progress / 0.2;
  if (progress > 0.8) return Math.max(0, (1 - progress) / 0.2);
  return 1;
}
