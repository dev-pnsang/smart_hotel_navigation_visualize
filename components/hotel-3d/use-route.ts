"use client";

import { useMemo } from "react";
import { getAmenity } from "@/data/demo-hotel/amenities";
import { START_NODE_ID } from "@/data/demo-hotel/booking";
import { findEdge, navigationGraph, nodeById } from "@/data/demo-hotel/navigation-graph";
import { getRoom } from "@/data/demo-hotel/rooms";
import { floorLift } from "@/data/demo-hotel/spatial";
import { useDemo, type Selection } from "@/lib/demo-store";
import { findPath } from "@/lib/pathfinding";

export type RouteSegment = {
  ax: number;
  ay: number;
  az: number;
  bx: number;
  by: number;
  bz: number;
  len: number;
  vertical: boolean;
};

function selectionNode(selection: Selection) {
  if (!selection) return null;
  if (selection.kind === "room") return getRoom(selection.id)?.nodeId ?? null;
  return getAmenity(selection.id)?.nodeId ?? null;
}

export function useVisibleRoute() {
  const { state } = useDemo();
  const isolated = state.cameraMode !== "isometric";
  const target = selectionNode(state.selection);
  const preview = useMemo(() => {
    if (!target) return [] as string[];
    return findPath(navigationGraph, START_NODE_ID, target) ?? [];
  }, [target]);
  const ids = state.showRoute && state.routeNodeIds.length > 1 ? state.routeNodeIds : preview;

  const segments = useMemo(() => {
    const next: RouteSegment[] = [];
    for (let index = 0; index < ids.length - 1; index += 1) {
      const from = nodeById.get(ids[index]);
      const to = nodeById.get(ids[index + 1]);
      if (!from || !to) continue;
      const edge = findEdge(from.id, to.id);
      const vertical = edge?.type === "elevator" || edge?.type === "stairs";
      if (isolated && (vertical || from.floorId !== state.selectedFloorId || to.floorId !== state.selectedFloorId)) {
        continue;
      }
      const fromLift = floorLift(from.floorId, state.explode, isolated);
      const toLift = floorLift(to.floorId, state.explode, isolated);
      const ax = from.position[0];
      const ay = from.position[1] + fromLift + 0.14;
      const az = from.position[2];
      const bx = to.position[0];
      const by = to.position[1] + toLift + 0.14;
      const bz = to.position[2];
      next.push({
        ax,
        ay,
        az,
        bx,
        by,
        bz,
        len: Math.hypot(bx - ax, by - ay, bz - az),
        vertical,
      });
    }
    return next;
  }, [ids, isolated, state.explode, state.selectedFloorId]);

  return { ids, segments };
}
