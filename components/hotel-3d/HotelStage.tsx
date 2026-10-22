"use client";

import dynamic from "next/dynamic";
import { Component, useSyncExternalStore, type ReactNode } from "react";
import { useDemo } from "@/lib/demo-store";
import { detectWebGL } from "@/lib/webgl";
import { FloorPlanFallback } from "./FloorPlanFallback";
import { GoogleRexView } from "./GoogleRexView";
import { SceneLoading } from "./SceneLoading";

const HotelCanvas = dynamic(() => import("./HotelCanvas"), {
  ssr: false,
  loading: () => <SceneLoading />,
});

type Support = { webgl: boolean; quality: "high" | "low" };
let supportCache: Support | null = null;

function readSupport() {
  const quality = window.matchMedia("(max-width: 767px)").matches ? "low" : "high";
  const webgl = detectWebGL();
  if (supportCache && supportCache.webgl === webgl && supportCache.quality === quality) return supportCache;
  supportCache = { webgl, quality };
  return supportCache;
}

function subscribeSupport(callback: () => void) {
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

class CanvasGuard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <FloorPlanFallback reason="Không thể khởi tạo không gian 3D." />;
    return this.props.children;
  }
}

export function HotelStage() {
  const { state } = useDemo();
  const support = useSyncExternalStore(subscribeSupport, readSupport, () => null);

  if (state.cameraMode === "isometric") return <GoogleRexView />;
  if (!support) return <SceneLoading />;
  if (!support.webgl) return <FloorPlanFallback />;

  return (
    <CanvasGuard>
      <HotelCanvas quality={support.quality} />
    </CanvasGuard>
  );
}
