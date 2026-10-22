import type { HotelNode, NavigationGraph, Vec3 } from "@/data/demo-hotel/types";
import { METERS_PER_UNIT } from "@/data/demo-hotel/spatial";

type OpenNode = { id: string; g: number; f: number };

function heuristic(a: Vec3, b: Vec3) {
  return Math.hypot(a[0] - b[0], a[2] - b[2]) * METERS_PER_UNIT;
}

export function findPath(graph: NavigationGraph, startId: string, goalId: string) {
  if (startId === goalId) return [startId];

  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const start = nodes.get(startId);
  const goal = nodes.get(goalId);
  if (!start || !goal) return null;

  const adjacent = new Map<string, { id: string; cost: number }[]>();
  for (const edge of graph.edges) {
    const cost = edge.type === "stairs" ? edge.distance * 4 : edge.distance;
    const forward = adjacent.get(edge.from) ?? [];
    forward.push({ id: edge.to, cost });
    adjacent.set(edge.from, forward);
    const back = adjacent.get(edge.to) ?? [];
    back.push({ id: edge.from, cost });
    adjacent.set(edge.to, back);
  }

  const open: OpenNode[] = [{ id: startId, g: 0, f: heuristic(start.position, goal.position) }];
  const gScore = new Map<string, number>([[startId, 0]]);
  const cameFrom = new Map<string, string>();
  let guard = 0;

  while (open.length > 0 && guard < 8000) {
    guard += 1;
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
    if (!current) break;
    if (current.g !== gScore.get(current.id)) continue;
    if (current.id === goalId) return reconstruct(cameFrom, goalId);

    for (const next of adjacent.get(current.id) ?? []) {
      const nextNode = nodes.get(next.id);
      if (!nextNode) continue;
      const tentative = current.g + next.cost;
      if (tentative >= (gScore.get(next.id) ?? Number.POSITIVE_INFINITY)) continue;
      gScore.set(next.id, tentative);
      cameFrom.set(next.id, current.id);
      open.push({
        id: next.id,
        g: tentative,
        f: tentative + heuristic(nextNode.position, goal.position),
      });
    }
  }

  return null;
}

function reconstruct(cameFrom: Map<string, string>, goalId: string) {
  const path = [goalId];
  let cursor = goalId;
  while (cameFrom.has(cursor)) {
    cursor = cameFrom.get(cursor) ?? cursor;
    path.push(cursor);
  }
  path.reverse();
  return path;
}

export function sameFloor(a: HotelNode, b: HotelNode) {
  return a.floorId === b.floorId;
}
