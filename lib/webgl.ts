export function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return Boolean(context);
  } catch {
    return false;
  }
}
