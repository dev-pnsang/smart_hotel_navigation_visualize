export const navRuntime = {
  stepProgress: 0,
  doorOpen: 0,
  snap: false,
  x: 0,
  y: 0,
  z: 2.55,
  lookX: 0,
  lookY: 0,
  lookZ: 0,
  version: 0,
  lastEmit: 0,
};

let progressListener: ((value: number) => void) | null = null;
const listeners = new Set<() => void>();

export function bindRouteProgress(listener: ((value: number) => void) | null) {
  progressListener = listener;
}

export function publishRouteProgress(value: number) {
  progressListener?.(value);
}

export function subscribeRuntime(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitRuntime() {
  listeners.forEach((listener) => listener());
}

export function getRuntimeSnapshot() {
  return navRuntime.version;
}
