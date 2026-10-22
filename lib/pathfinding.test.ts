import assert from "node:assert/strict";
import test from "node:test";
import { DESTINATION_NODE_ID, START_NODE_ID } from "../data/demo-hotel/booking";
import { navigationGraph, nodeById } from "../data/demo-hotel/navigation-graph";
import { buildSteps } from "./navigation";
import { findPath } from "./pathfinding";

test("route from reception to room 408 uses the elevator and avoids stairs", () => {
  const path = findPath(navigationGraph, START_NODE_ID, DESTINATION_NODE_ID);
  assert.ok(path);
  assert.equal(path[0], START_NODE_ID);
  assert.equal(path.at(-1), DESTINATION_NODE_ID);
  assert.ok(path.includes("elev-f1"));
  assert.ok(path.includes("elev-f4"));
  assert.equal(path.some((id) => id.startsWith("stairs-")), false);
  assert.equal(new Set(path).size, path.length);
});

test("restaurant route stays on the lobby floor", () => {
  const path = findPath(navigationGraph, START_NODE_ID, "restaurant");
  assert.ok(path);
  assert.ok(path.every((id) => nodeById.get(id)?.floorId === "floor-1"));
});

test("steps include one floor change and finish at the door", () => {
  const path = findPath(navigationGraph, START_NODE_ID, DESTINATION_NODE_ID);
  assert.ok(path);
  const steps = buildSteps(path, false);
  const vertical = steps.filter((step) => step.kind === "vertical");
  assert.equal(vertical.length, 1);
  assert.equal(vertical[0]?.toFloorId, "floor-4");
  assert.equal(steps.at(-1)?.toNodeId, DESTINATION_NODE_ID);
  assert.ok(steps.every((step) => step.distanceM > 0 && step.instruction.length > 0));
});

test("pool route climbs to the rooftop pool", () => {
  const path = findPath(navigationGraph, START_NODE_ID, "pool");
  assert.ok(path);
  assert.ok(path.includes("elev-f6"));
  assert.equal(nodeById.get("pool")?.floorId, "floor-6");
  assert.equal(path.some((id) => id.startsWith("stairs-")), false);
});

test("missing nodes do not invent a route", () => {
  assert.equal(findPath(navigationGraph, START_NODE_ID, "missing-room"), null);
  assert.deepEqual(findPath(navigationGraph, "pool", "pool"), ["pool"]);
});
