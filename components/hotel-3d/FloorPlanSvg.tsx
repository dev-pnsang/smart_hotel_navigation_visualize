"use client";

import { useSyncExternalStore } from "react";
import { amenities } from "@/data/demo-hotel/amenities";
import { DESTINATION_ROOM_ID } from "@/data/demo-hotel/booking";
import { getFloor } from "@/data/demo-hotel/floors";
import { nodeById } from "@/data/demo-hotel/navigation-graph";
import { roomsOnFloor } from "@/data/demo-hotel/rooms";
import { CORRIDOR_HALF_Z, ROOM_D, ROOM_W } from "@/data/demo-hotel/spatial";
import { useDemo } from "@/lib/demo-store";
import { getRuntimeSnapshot, navRuntime, subscribeRuntime } from "@/lib/nav-runtime";
import { hasAssignedRoom } from "@/lib/status";
import { useVisibleRoute } from "./use-route";

export function FloorPlanSvg({
  compact = false,
  interactive = true,
}: {
  compact?: boolean;
  interactive?: boolean;
}) {
  const { state, selectRoom, selectAmenity } = useDemo();
  const { ids } = useVisibleRoute();
  useSyncExternalStore(subscribeRuntime, getRuntimeSnapshot, getRuntimeSnapshot);
  const floor = getFloor(state.selectedFloorId);
  const onFloor = ids
    .map((id) => nodeById.get(id))
    .filter((node) => node && node.floorId === state.selectedFloorId);
  const points = onFloor.map((node) => `${node?.position[0]},${node?.position[2]}`).join(" ");
  const destination = onFloor[onFloor.length - 1];
  const showDot =
    state.hasStarted && navRuntime.y !== undefined && floor && Math.abs(navRuntime.y - floor.y) < 1.2;

  return (
    <svg viewBox="-17 -12 34 24" className={compact ? "h-full w-full" : "h-full max-h-[70vh] w-full"} role="img" aria-label="Sơ đồ tầng mô phỏng">
      <rect x="-17" y="-12" width="34" height="24" fill="#f6f1e8" />
      {state.selectedFloorId === "floor-6" ? (
        <>
          <rect x="-12.4" y="-6.8" width="24.8" height="13.6" fill="#f3f1ec" stroke="#cfc6b8" strokeWidth="0.08" />
          <rect x="1.3" y="-2.75" width="6.2" height="2.3" fill="#3e8f96" />
          <rect x="-6.4" y="-5" width="6.2" height="3.2" fill="#2a3033" opacity="0.35" />
          {amenities
            .filter((amenity) => amenity.floorId === "floor-6")
            .map((amenity) => {
              const node = nodeById.get(amenity.nodeId);
              if (!node) return null;
              const selected = state.selection?.kind === "amenity" && state.selection.id === amenity.id;
              return (
                <g
                  key={amenity.id}
                  onClick={interactive ? () => selectAmenity(amenity.id) : undefined}
                  className={interactive ? "cursor-pointer" : undefined}
                >
                  <circle cx={node.position[0]} cy={node.position[2]} r={selected ? 0.72 : 0.55} fill={selected ? "#b89a62" : "#2c5c57"} />
                  {compact ? null : (
                    <text x={node.position[0] + 0.8} y={node.position[2] + 0.2} fontSize="0.72" fill="#1c1915">
                      {amenity.name}
                    </text>
                  )}
                </g>
              );
            })}
        </>
      ) : state.selectedFloorId === "floor-1" ? (
        <>
          <rect x="-16" y="-11" width="32" height="22" fill="#e7dfd2" stroke="#cfc6b8" strokeWidth="0.08" />
          <rect x="-5" y="-1" width="10" height="6" fill="#e3c8a4" />
          <rect x="8" y="-9" width="7" height="6.5" fill="#eadcc6" />
          <rect x="-15" y="-9" width="6.5" height="6.5" fill="#e3c8a4" />
          {amenities
            .filter((amenity) => amenity.floorId === "floor-1")
            .map((amenity) => {
              const node = nodeById.get(amenity.nodeId);
              if (!node) return null;
              const selected = state.selection?.kind === "amenity" && state.selection.id === amenity.id;
              return (
                <g
                  key={amenity.id}
                  onClick={interactive ? () => selectAmenity(amenity.id) : undefined}
                  className={interactive ? "cursor-pointer" : undefined}
                >
                  <circle cx={node.position[0]} cy={node.position[2]} r={selected ? 0.72 : 0.55} fill={selected ? "#b89a62" : "#2c5c57"} />
                  {compact ? null : (
                    <text x={node.position[0] + 0.8} y={node.position[2] + 0.2} fontSize="0.72" fill="#1c1915">
                      {amenity.name}
                    </text>
                  )}
                </g>
              );
            })}
        </>
      ) : (
        <>
          <rect x="-11.3" y="-6.7" width="22.6" height="13.4" fill="#e7dfd2" stroke="#cfc6b8" strokeWidth="0.08" />
          <rect x="-9.2" y={-CORRIDOR_HALF_Z} width="18.4" height={CORRIDOR_HALF_Z * 2} fill="#d9d1c4" />
          {roomsOnFloor(state.selectedFloorId).map((room) => {
            const assigned = hasAssignedRoom(state.status) && room.id === DESTINATION_ROOM_ID;
            const selected = state.selection?.kind === "room" && state.selection.id === room.id;
            return (
              <g
                key={room.id}
                onClick={interactive ? () => selectRoom(room.id) : undefined}
                className={interactive ? "cursor-pointer" : undefined}
              >
                <rect
                  x={room.position[0] - ROOM_W / 2}
                  y={room.position[2] - ROOM_D / 2}
                  width={ROOM_W - 0.08}
                  height={ROOM_D - 0.08}
                  fill={assigned ? "#d5e5e0" : selected ? "#f0e4cc" : "#f7f3ec"}
                  stroke={assigned ? "#a18455" : selected ? "#2c5c57" : "#ddd4c6"}
                  strokeWidth={assigned || selected ? 0.12 : 0.05}
                />
                <text x={room.position[0]} y={room.position[2] + 0.22} textAnchor="middle" fontSize={compact ? 0.7 : 0.95} fill="#1c1915">
                  {room.number}
                </text>
              </g>
            );
          })}
        </>
      )}
      {points ? <polyline points={points} fill="none" stroke="#176860" strokeWidth="0.42" strokeLinejoin="round" strokeLinecap="round" /> : null}
      {destination ? (
        <circle cx={destination.position[0]} cy={destination.position[2]} r="0.42" fill="#c4a15a" stroke="#1c1915" strokeWidth="0.06" />
      ) : null}
      {showDot ? (
        <>
          <circle cx={navRuntime.x} cy={navRuntime.z} r="0.62" fill="#176860" opacity="0.28" />
          <circle cx={navRuntime.x} cy={navRuntime.z} r="0.3" fill="#1c1915" />
        </>
      ) : null}
    </svg>
  );
}
