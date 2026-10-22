"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import {
  DESTINATION_NODE_ID,
  DESTINATION_ROOM_ID,
  START_NODE_ID,
  demoBooking,
  type BookingSource,
} from "@/data/demo-hotel/booking";
import { getAmenity } from "@/data/demo-hotel/amenities";
import { navigationGraph, nodeById } from "@/data/demo-hotel/navigation-graph";
import { getRoom } from "@/data/demo-hotel/rooms";
import type { FloorId } from "@/data/demo-hotel/types";
import {
  buildSteps,
  doorAmount,
  overallProgress,
  sampleStep,
  type NavStep,
} from "@/lib/navigation";
import { emitRuntime, navRuntime, publishRouteProgress } from "@/lib/nav-runtime";
import { findPath } from "@/lib/pathfinding";
import { hasAssignedRoom, statusRank, type DemoStatus } from "@/lib/status";

export type CameraMode = "isometric" | "floor" | "guided" | "explore";
export type FloorView = "angled" | "top";
export type Selection =
  | { kind: "room"; id: string }
  | { kind: "amenity"; id: string }
  | null;

export type DemoState = {
  source: BookingSource;
  status: DemoStatus;
  checkInStep: 0 | 1 | 2;
  guestName: string;
  guestCount: number;
  infoConfirmed: boolean;
  selectedFloorId: FloorId;
  selection: Selection;
  cameraMode: CameraMode;
  floorView: FloorView;
  explode: number;
  cameraNonce: number;
  destinationNodeId: string | null;
  routeNodeIds: string[];
  showRoute: boolean;
  navPlaying: boolean;
  navStepIndex: number;
  stepHold: boolean;
  autoAdvance: boolean;
  hasStarted: boolean;
  replayNonce: number;
  reducedMotion: boolean;
  coverFloorId: string | null;
};

const STORAGE_KEY = "grand-hotel-demo-v1";

const initialState: DemoState = {
  source: demoBooking.source,
  status: "booking_confirmed",
  checkInStep: 0,
  guestName: demoBooking.guestName,
  guestCount: demoBooking.guests,
  infoConfirmed: false,
  selectedFloorId: "floor-1",
  selection: null,
  cameraMode: "isometric",
  floorView: "angled",
  explode: 0,
  cameraNonce: 0,
  destinationNodeId: null,
  routeNodeIds: [],
  showRoute: false,
  navPlaying: false,
  navStepIndex: 0,
  stepHold: false,
  autoAdvance: true,
  hasStarted: false,
  replayNonce: 0,
  reducedMotion: false,
  coverFloorId: null,
};

const statuses = new Set<DemoStatus>([
  "booking_confirmed",
  "checkin_pending",
  "checkin_completed",
  "room_assigned",
  "navigation_active",
  "arrived",
]);

function isFloorId(value: unknown): value is FloorId {
  return value === "floor-1" || value === "floor-2" || value === "floor-4" || value === "floor-6";
}

function sanitize(raw: unknown): DemoState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<DemoState>;
  if (!value.status || !statuses.has(value.status)) return null;
  const selection = value.selection;
  const safeSelection =
    selection &&
    (selection.kind === "room" || selection.kind === "amenity") &&
    typeof selection.id === "string"
      ? selection
      : null;
  return {
    ...initialState,
    ...value,
    selection: safeSelection,
    selectedFloorId: isFloorId(value.selectedFloorId) ? value.selectedFloorId : "floor-1",
    source: value.source === "Booking.com" ? "Booking.com" : "Agoda",
    checkInStep: value.checkInStep === 1 || value.checkInStep === 2 ? value.checkInStep : 0,
    guestName: typeof value.guestName === "string" && value.guestName.trim() ? value.guestName : demoBooking.guestName,
    guestCount: typeof value.guestCount === "number" ? Math.min(4, Math.max(1, value.guestCount)) : 2,
    routeNodeIds: Array.isArray(value.routeNodeIds) ? value.routeNodeIds.filter((id) => typeof id === "string") : [],
    navPlaying: false,
    coverFloorId: null,
    reducedMotion: false,
    explode: typeof value.explode === "number" ? Math.min(1, Math.max(0, value.explode)) : initialState.explode,
  };
}

const listeners = new Set<() => void>();
let demoState: DemoState = initialState;
let clientReady = false;

function loadDemoState() {
  let stored: DemoState | null = null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    stored = raw ? sanitize(JSON.parse(raw)) : null;
  } catch {
    stored = null;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return { ...(stored ?? initialState), reducedMotion: reduced };
}

function persistDemo(state: DemoState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, navPlaying: false, coverFloorId: null }));
}

function commit(recipe: (state: DemoState) => DemoState) {
  const next = recipe(demoState);
  if (next === demoState) return;
  demoState = next;
  persistDemo(demoState);
  listeners.forEach((listener) => listener());
}

function subscribeDemo(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getClientDemo() {
  if (!clientReady) {
    clientReady = true;
    demoState = loadDemoState();
  }
  return demoState;
}

function getServerDemo() {
  return initialState;
}

type DemoContextValue = {
  state: DemoState;
  steps: NavStep[];
  setSource: (source: BookingSource) => void;
  setStatus: (status: DemoStatus) => void;
  beginCheckIn: () => void;
  setCheckInStep: (step: 0 | 1 | 2) => void;
  patchGuest: (patch: { guestName?: string; guestCount?: number; infoConfirmed?: boolean }) => void;
  completeCheckIn: () => void;
  selectFloor: (floorId: FloorId) => void;
  selectRoom: (roomId: string) => void;
  selectAmenity: (amenityId: string) => void;
  clearSelection: () => void;
  setCameraMode: (mode: CameraMode) => void;
  setFloorView: (view: FloorView) => void;
  setExplode: (value: number) => void;
  resetCamera: () => void;
  planRoute: (nodeId: string) => void;
  startNavigation: (nodeId: string) => void;
  playNavigation: () => void;
  pauseNavigation: () => void;
  nextStep: () => void;
  prevStep: () => void;
  holdStep: () => void;
  stopNavigation: () => void;
  showOverview: () => void;
  beginExplore: () => void;
  resumeGuided: () => void;
  setAutoAdvance: (value: boolean) => void;
  markArrived: () => void;
  replayRoute: () => void;
  focusFloor: (floorId: string) => void;
  setCover: (floorId: string | null) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

function copySample(step: NavStep, progress: number) {
  const sample = sampleStep(step, progress);
  navRuntime.x = sample.x;
  navRuntime.y = sample.y;
  navRuntime.z = sample.z;
  navRuntime.lookX = sample.lookX;
  navRuntime.lookY = sample.lookY;
  navRuntime.lookZ = sample.lookZ;
}

function Playback() {
  const api = useDemo();
  const apiRef = useRef(api);
  useEffect(() => {
    apiRef.current = api;
  });
  const progressRef = useRef(0);
  const coverOn = useRef(false);
  const switched = useRef(false);
  const latched = useRef(false);

  useEffect(() => {
    const current = apiRef.current;
    const arrived = current.state.status === "arrived";
    progressRef.current = arrived ? 1 : 0;
    navRuntime.stepProgress = progressRef.current;
    navRuntime.doorOpen = 0;
    coverOn.current = false;
    switched.current = false;
    latched.current = false;
    const step = current.steps[current.state.navStepIndex];
    if (step) copySample(step, progressRef.current);
    navRuntime.version += 1;
    emitRuntime();
    publishRouteProgress(overallProgress(current.steps, current.state.navStepIndex, progressRef.current));
    current.setCover(null);
  }, [api.state.navStepIndex, api.state.replayNonce]);

  useEffect(() => {
    if (!api.state.navPlaying) return;
    let frame = 0;
    let last = performance.now();
    let stopped = false;

    const loop = (now: number) => {
      if (stopped || latched.current) return;
      const dt = Math.min(80, now - last);
      last = now;
      const current = apiRef.current;
      const step = current.steps[current.state.navStepIndex];
      if (!step) return;

      progressRef.current = Math.min(1, progressRef.current + dt / step.durationMs);
      navRuntime.stepProgress = progressRef.current;
      copySample(step, progressRef.current);

      if (step.kind === "vertical") {
        navRuntime.doorOpen = doorAmount(progressRef.current);
        if (progressRef.current > 0.2 && !coverOn.current) {
          coverOn.current = true;
          current.setCover(step.toFloorId);
        }
        if (progressRef.current > 0.5 && !switched.current) {
          switched.current = true;
          navRuntime.snap = true;
          current.focusFloor(step.toFloorId);
        }
        if (progressRef.current > 0.74 && coverOn.current) {
          coverOn.current = false;
          current.setCover(null);
        }
      } else {
        navRuntime.doorOpen = 0;
      }

      publishRouteProgress(
        overallProgress(current.steps, current.state.navStepIndex, progressRef.current),
      );
      if (now - navRuntime.lastEmit > 120) {
        navRuntime.lastEmit = now;
        navRuntime.version += 1;
        emitRuntime();
      }

      if (progressRef.current >= 1) {
        latched.current = true;
        publishRouteProgress(overallProgress(current.steps, current.state.navStepIndex, 1));
        navRuntime.version += 1;
        emitRuntime();
        if (current.state.navStepIndex >= current.steps.length - 1) current.markArrived();
        else if (current.state.autoAdvance) current.nextStep();
        else current.holdStep();
        return;
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
    };
  }, [
    api.state.autoAdvance,
    api.state.navPlaying,
    api.state.navStepIndex,
    api.state.replayNonce,
    api.steps,
  ]);

  return null;
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribeDemo, getClientDemo, getServerDemo);

  const steps = useMemo(
    () => buildSteps(state.routeNodeIds, state.reducedMotion),
    [state.reducedMotion, state.routeNodeIds],
  );
  const viewState = useMemo(() => {
    const navStepIndex = steps.length === 0 ? 0 : Math.min(state.navStepIndex, steps.length - 1);
    return navStepIndex === state.navStepIndex ? state : { ...state, navStepIndex };
  }, [state, steps]);

  const setSource = useCallback((source: BookingSource) => {
    commit((current) => ({ ...current, source }));
  }, []);

  const setStatus = useCallback((status: DemoStatus) => {
    commit((current) => {
      const route =
        (status === "navigation_active" || status === "arrived") && current.routeNodeIds.length === 0
          ? findPath(navigationGraph, START_NODE_ID, DESTINATION_NODE_ID) ?? []
          : current.routeNodeIds;
      return {
        ...current,
        status,
        routeNodeIds: route,
        showRoute: status === "navigation_active" || status === "arrived" ? true : current.showRoute,
        navPlaying: false,
        navStepIndex: status === "arrived" ? 999 : current.navStepIndex,
        destinationNodeId:
          status === "navigation_active" || status === "arrived"
            ? current.destinationNodeId ?? DESTINATION_NODE_ID
            : current.destinationNodeId,
        selectedFloorId: status === "arrived" ? demoBooking.floorId : current.selectedFloorId,
        selection:
          hasAssignedRoom(status) && !current.selection
            ? { kind: "room", id: DESTINATION_ROOM_ID }
            : current.selection,
        replayNonce: status === "arrived" ? current.replayNonce + 1 : current.replayNonce,
      };
    });
  }, []);

  const beginCheckIn = useCallback(() => {
    commit((current) => ({
      ...current,
      status: hasAssignedRoom(current.status) ? current.status : "checkin_pending",
      checkInStep: hasAssignedRoom(current.status) ? 2 : current.checkInStep,
    }));
  }, []);

  const setCheckInStep = useCallback((step: 0 | 1 | 2) => {
    commit((current) => ({
      ...current,
      checkInStep: step,
      status:
        step < 2 && hasAssignedRoom(current.status) ? "checkin_pending" : current.status,
    }));
  }, []);

  const patchGuest = useCallback(
    (patch: { guestName?: string; guestCount?: number; infoConfirmed?: boolean }) => {
      commit((current) => ({
        ...current,
        ...patch,
        guestCount:
          patch.guestCount === undefined
            ? current.guestCount
            : Math.min(4, Math.max(1, patch.guestCount)),
      }));
    },
    [],
  );

  const completeCheckIn = useCallback(() => {
    commit((current) => ({
      ...current,
      status: "room_assigned",
      checkInStep: 2,
      infoConfirmed: true,
      selectedFloorId: demoBooking.floorId,
      selection: { kind: "room", id: DESTINATION_ROOM_ID },
      cameraMode: "isometric",
    }));
  }, []);

  const selectFloor = useCallback((floorId: FloorId) => {
    commit((current) => ({ ...current, selectedFloorId: floorId }));
  }, []);

  const selectRoom = useCallback((roomId: string) => {
    commit((current) => ({
      ...current,
      selection: { kind: "room", id: roomId },
      selectedFloorId: getRoom(roomId)?.floorId ?? current.selectedFloorId,
    }));
  }, []);

  const selectAmenity = useCallback((amenityId: string) => {
    commit((current) => ({
      ...current,
      selection: { kind: "amenity", id: amenityId },
      selectedFloorId: getAmenity(amenityId)?.floorId ?? current.selectedFloorId,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    commit((current) => ({ ...current, selection: null }));
  }, []);

  const setCameraMode = useCallback((mode: CameraMode) => {
    commit((current) => ({ ...current, cameraMode: mode }));
  }, []);

  const setFloorView = useCallback((view: FloorView) => {
    commit((current) => ({ ...current, floorView: view }));
  }, []);

  const setExplode = useCallback((value: number) => {
    commit((current) => ({ ...current, explode: Math.min(1, Math.max(0, value)) }));
  }, []);

  const resetCamera = useCallback(() => {
    commit((current) => ({ ...current, cameraNonce: current.cameraNonce + 1 }));
  }, []);

  const planRoute = useCallback((nodeId: string) => {
    const path = findPath(navigationGraph, START_NODE_ID, nodeId);
    commit((current) => ({
      ...current,
      destinationNodeId: nodeId,
      routeNodeIds: path ?? [],
      showRoute: true,
      navStepIndex: 0,
      navPlaying: false,
      stepHold: false,
      hasStarted: false,
      coverFloorId: null,
      replayNonce: current.replayNonce + 1,
      status:
        current.status === "navigation_active" || current.status === "arrived"
          ? "room_assigned"
          : current.status,
      selectedFloorId: nodeById.get(path?.[0] ?? "")?.floorId ?? current.selectedFloorId,
    }));
  }, []);

  const startNavigation = useCallback((nodeId: string) => {
    const path = findPath(navigationGraph, START_NODE_ID, nodeId);
    commit((current) => {
      const built = buildSteps(path ?? [], current.reducedMotion);
      const step = built[0];
      return {
        ...current,
        destinationNodeId: nodeId,
        routeNodeIds: path ?? [],
        showRoute: true,
        navStepIndex: 0,
        navPlaying: true,
        stepHold: false,
        hasStarted: true,
        cameraMode: "guided",
        explode: 0,
        coverFloorId: null,
        replayNonce: current.replayNonce + 1,
        status: hasAssignedRoom(current.status) ? "navigation_active" : current.status,
        selectedFloorId:
          (step?.fromFloorId as FloorId) ??
          nodeById.get(path?.[0] ?? "")?.floorId ??
          current.selectedFloorId,
      };
    });
  }, []);

  const playNavigation = useCallback(() => {
    commit((current) => {
      const built = buildSteps(current.routeNodeIds, current.reducedMotion);
      const step = built[Math.min(current.navStepIndex, Math.max(0, built.length - 1))];
      return {
        ...current,
        navPlaying: true,
        stepHold: false,
        hasStarted: true,
        cameraMode: "guided",
        explode: 0,
        showRoute: true,
        status: hasAssignedRoom(current.status) ? "navigation_active" : current.status,
        selectedFloorId: (step?.fromFloorId as FloorId) ?? current.selectedFloorId,
      };
    });
  }, []);

  const pauseNavigation = useCallback(() => {
    commit((current) => ({ ...current, navPlaying: false }));
  }, []);

  const nextStep = useCallback(() => {
    commit((current) => {
      const built = buildSteps(current.routeNodeIds, current.reducedMotion);
      const next = Math.min(Math.max(0, built.length - 1), current.navStepIndex + 1);
      const step = built[next];
      return {
        ...current,
        navStepIndex: next,
        navPlaying: true,
        stepHold: false,
        hasStarted: true,
        cameraMode: "guided",
        explode: 0,
        status: hasAssignedRoom(current.status) ? "navigation_active" : current.status,
        selectedFloorId: (step?.fromFloorId as FloorId) ?? current.selectedFloorId,
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    commit((current) => {
      const built = buildSteps(current.routeNodeIds, current.reducedMotion);
      const prev = Math.max(0, current.navStepIndex - 1);
      const step = built[prev];
      return {
        ...current,
        navStepIndex: prev,
        navPlaying: true,
        stepHold: false,
        hasStarted: true,
        cameraMode: "guided",
        status: current.status === "arrived" ? "navigation_active" : current.status,
        selectedFloorId: (step?.fromFloorId as FloorId) ?? current.selectedFloorId,
      };
    });
  }, []);

  const holdStep = useCallback(() => {
    commit((current) => ({ ...current, navPlaying: false, stepHold: true }));
  }, []);

  const stopNavigation = useCallback(() => {
    commit((current) => ({
      ...current,
      navPlaying: false,
      stepHold: false,
      hasStarted: false,
      navStepIndex: 0,
      cameraMode: "isometric",
      coverFloorId: null,
      status: current.status === "arrived" || current.status === "navigation_active"
        ? "room_assigned"
        : current.status,
      replayNonce: current.replayNonce + 1,
    }));
  }, []);

  const showOverview = useCallback(() => {
    commit((current) => ({
      ...current,
      cameraMode: "isometric",
      navPlaying: false,
      explode: 0,
    }));
  }, []);

  const beginExplore = useCallback(() => {
    commit((current) => ({
      ...current,
      cameraMode: "explore",
      navPlaying: false,
      explode: 0,
    }));
  }, []);

  const resumeGuided = useCallback(() => {
    commit((current) => ({
      ...current,
      cameraMode: "guided",
      navPlaying: !current.stepHold,
      explode: 0,
      status: current.status === "arrived" ? "arrived" : hasAssignedRoom(current.status) ? "navigation_active" : current.status,
    }));
  }, []);

  const setAutoAdvance = useCallback((value: boolean) => {
    commit((current) => ({ ...current, autoAdvance: value }));
  }, []);

  const markArrived = useCallback(() => {
    navRuntime.stepProgress = 1;
    commit((current) => {
      const built = buildSteps(current.routeNodeIds, current.reducedMotion);
      const last = built[built.length - 1];
      const destinationRoom = current.destinationNodeId === DESTINATION_NODE_ID;
      return {
        ...current,
        status: "arrived",
        navPlaying: false,
        navStepIndex: 999,
        stepHold: false,
        hasStarted: true,
        cameraMode: "guided",
        coverFloorId: null,
        selectedFloorId: (last?.toFloorId as FloorId) ?? current.selectedFloorId,
        selection: destinationRoom ? { kind: "room", id: DESTINATION_ROOM_ID } : current.selection,
      };
    });
  }, []);

  const replayRoute = useCallback(() => {
    commit((current) => ({
      ...current,
      status: "navigation_active",
      navStepIndex: 0,
      navPlaying: true,
      stepHold: false,
      hasStarted: true,
      cameraMode: "guided",
      explode: 0,
      coverFloorId: null,
      showRoute: true,
      replayNonce: current.replayNonce + 1,
      selectedFloorId: "floor-1",
    }));
  }, []);

  const focusFloor = useCallback((floorId: string) => {
    if (!isFloorId(floorId)) return;
    commit((current) =>
      current.selectedFloorId === floorId ? current : { ...current, selectedFloorId: floorId },
    );
  }, []);

  const setCover = useCallback((floorId: string | null) => {
    commit((current) =>
      current.coverFloorId === floorId ? current : { ...current, coverFloorId: floorId },
    );
  }, []);

  const resetDemo = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    navRuntime.stepProgress = 0;
    navRuntime.doorOpen = 0;
    commit((current) => ({
      ...initialState,
      reducedMotion: current.reducedMotion,
      replayNonce: current.replayNonce + 1,
    }));
  }, []);

  const value = useMemo<DemoContextValue>(
    () => ({
      state: viewState,
      steps,
      setSource,
      setStatus,
      beginCheckIn,
      setCheckInStep,
      patchGuest,
      completeCheckIn,
      selectFloor,
      selectRoom,
      selectAmenity,
      clearSelection,
      setCameraMode,
      setFloorView,
      setExplode,
      resetCamera,
      planRoute,
      startNavigation,
      playNavigation,
      pauseNavigation,
      nextStep,
      prevStep,
      holdStep,
      stopNavigation,
      showOverview,
      beginExplore,
      resumeGuided,
      setAutoAdvance,
      markArrived,
      replayRoute,
      focusFloor,
      setCover,
      resetDemo,
    }),
    [
      beginCheckIn,
      beginExplore,
      clearSelection,
      completeCheckIn,
      focusFloor,
      holdStep,
      markArrived,
      nextStep,
      patchGuest,
      pauseNavigation,
      planRoute,
      playNavigation,
      prevStep,
      startNavigation,
      replayRoute,
      resetCamera,
      resetDemo,
      resumeGuided,
      selectAmenity,
      selectFloor,
      selectRoom,
      setAutoAdvance,
      setCameraMode,
      setCheckInStep,
      setCover,
      setExplode,
      setFloorView,
      setSource,
      setStatus,
      showOverview,
      steps,
      stopNavigation,
      viewState,
    ],
  );

  return (
    <DemoContext.Provider value={value}>
      <Playback />
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo phải nằm trong DemoProvider.");
  return value;
}

export function assignedRoomVisible(status: DemoStatus) {
  return statusRank(status) >= statusRank("room_assigned");
}
