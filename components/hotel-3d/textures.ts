import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

type Kind = "wood" | "marble" | "carpet" | "water" | "guide";

const cache = new Map<string, CanvasTexture>();

function paint(kind: Kind, ctx: CanvasRenderingContext2D, width: number, height: number) {
  if (kind === "wood") {
    for (let row = 0; row < 4; row += 1) {
      const tone = 168 + (row % 2) * 16;
      ctx.fillStyle = `rgb(${tone}, ${tone - 58}, ${tone - 98})`;
      ctx.fillRect(0, row * 32, width, 32);
      ctx.fillStyle = "rgba(70,42,24,0.28)";
      ctx.fillRect(0, row * 32 + 30, width, 2);
      ctx.strokeStyle = "rgba(90,52,28,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, row * 32 + 12);
      ctx.bezierCurveTo(40, row * 32 + 8, 90, row * 32 + 18, width, row * 32 + 11);
      ctx.stroke();
    }
    return;
  }

  if (kind === "marble") {
    ctx.fillStyle = "#f3ece1";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(168, 146, 116, 0.45)";
    ctx.lineWidth = 2;
    for (let vein = 0; vein < 8; vein += 1) {
      ctx.beginPath();
      ctx.moveTo(0, 18 + vein * 32);
      ctx.bezierCurveTo(70, vein * 28, 150, 40 + vein * 30, width, 12 + vein * 34);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, width - 24, height - 24);
    return;
  }

  if (kind === "carpet") {
    ctx.fillStyle = "#163e3b";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#d4b483";
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2, 28);
    ctx.lineTo(width - 28, height / 2);
    ctx.lineTo(width / 2, height - 28);
    ctx.lineTo(28, height / 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "rgba(212, 180, 131, 0.18)";
    ctx.fill();
    return;
  }

  if (kind === "water") {
    ctx.fillStyle = "#1a7c86";
    ctx.fillRect(0, 0, width, height);
    for (let band = 0; band < 16; band += 1) {
      ctx.strokeStyle = `rgba(255,255,255,${0.05 + (band % 3) * 0.04})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, band * 8 + 4);
      ctx.bezierCurveTo(36, band * 8 + 10, 80, band * 8 - 2, width, band * 8 + 6);
      ctx.stroke();
    }
    return;
  }

  ctx.fillStyle = "#176860";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#e7d3a4";
  ctx.fillRect(0, 0, 7, height);
  ctx.fillRect(width - 7, 0, 7, height);
  ctx.fillStyle = "#f7f2e8";
  ctx.beginPath();
  ctx.moveTo(width / 2, 28);
  ctx.lineTo(width / 2 + 26, 78);
  ctx.lineTo(width / 2 + 12, 78);
  ctx.lineTo(width / 2 + 12, 168);
  ctx.lineTo(width / 2 - 12, 168);
  ctx.lineTo(width / 2 - 12, 78);
  ctx.lineTo(width / 2 - 26, 78);
  ctx.closePath();
  ctx.fill();
}

function make(kind: Kind) {
  const [width, height] = kind === "guide" ? [128, 256] : kind === "marble" ? [256, 256] : [128, 128];
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  paint(kind, ctx, width, height);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

export function mapVariant(kind: Kind, repeatX = 1, repeatY = 1) {
  if (typeof document === "undefined") return null;
  const key = `${kind}:${repeatX}:${repeatY}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const texture = make(kind);
  if (!texture) return null;
  texture.repeat.set(repeatX, repeatY);
  cache.set(key, texture);
  return texture;
}
