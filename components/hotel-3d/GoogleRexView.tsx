"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { hotel } from "@/data/demo-hotel/hotel";

const REX = {
  lat: hotel.coordinates.lat,
  lng: hotel.coordinates.lng,
};

const EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245!2d106.7012618!3d10.7754687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f479e4f95db%3A0xcae127d5b519b548!2sKh%C3%A1ch%20s%E1%BA%A1n%20Rex%20S%C3%A0i%20G%C3%B2n!5e1!3m2!1svi!2svn!4v1710000000000";

const GOOGLE_3D_URL =
  "https://www.google.com/maps/place/Kh%C3%A1ch+s%E1%BA%A1n+Rex+S%C3%A0i+G%C3%B2n/@10.7754687,106.7012618,400m/data=!3m1!1e3!4m6!3m5!1s0x31752f479e4f95db:0xcae127d5b519b548!8m2!3d10.7754687!4d106.7012618";

const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function loadMaps3d(key: string) {
  const existing = document.querySelector<HTMLScriptElement>("script[data-rex-maps]");
  if (existing) {
    return existing.dataset.ready === "1"
      ? Promise.resolve()
      : new Promise<void>((resolve, reject) => {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("maps")), { once: true });
        });
  }
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=alpha&libraries=maps3d`;
    script.async = true;
    script.dataset.rexMaps = "1";
    script.onload = () => {
      script.dataset.ready = "1";
      resolve();
    };
    script.onerror = () => reject(new Error("maps"));
    document.head.appendChild(script);
  });
}

function SatelliteEmbed() {
  return (
    <iframe
      title="Khách sạn Rex trên Google Maps"
      src={EMBED_SRC}
      className="h-full w-full border-0"
      loading="eager"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}

function PhotorealisticMap() {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!mapsKey) return;
    const parent = host.current;
    if (!parent) return;
    let cancelled = false;
    loadMaps3d(mapsKey)
      .then(() => {
        if (cancelled || !parent) return;
        const map = document.createElement("gmp-map-3d");
        map.setAttribute("mode", "SATELLITE");
        map.setAttribute("center", `${REX.lat},${REX.lng},12`);
        map.setAttribute("range", "260");
        map.setAttribute("tilt", "67.5");
        map.setAttribute("heading", "48");
        map.style.display = "block";
        map.style.width = "100%";
        map.style.height = "100%";
        parent.replaceChildren(map);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return <SatelliteEmbed />;
  return <div ref={host} className="h-full w-full" />;
}

function TemporaryCityModel() {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    const parent = host.current;
    if (!parent) return;
    let cancelled = false;
    let map: MapLibreMap | null = null;

    (async () => {
      const maplibre = await import("maplibre-gl");
      maplibre.setWorkerUrl("/maplibre-gl-worker.mjs");
      if (cancelled) return;
      map = new maplibre.Map({
        container: parent,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [REX.lng, REX.lat],
        zoom: 18.15,
        pitch: 64,
        bearing: -38,
        maxPitch: 75,
        canvasContextAttributes: { antialias: true },
      });
      map.on("load", () => {
        if (!map?.getLayer("building-3d")) {
          console.error("rex-map missing building-3d");
          return;
        }
        map.setPaintProperty("building-3d", "fill-extrusion-height", [
          "case",
          [">", ["to-number", ["get", "render_height"], 0], 0],
          ["get", "render_height"],
          18,
        ]);
        map.setPaintProperty("building-3d", "fill-extrusion-color", "#f4efe6");
        map.setPaintProperty("building-3d", "fill-extrusion-opacity", 0.95);
        new maplibre.Marker({ color: "#8d7344" }).setLngLat([REX.lng, REX.lat]).addTo(map);
      });
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={host} className="h-full w-full" />;
}

function StandInChrome({
  mode,
  onMode,
}: {
  mode: "model" | "satellite";
  onMode: (mode: "model" | "satellite") => void;
}) {
  return (
    <div className="pointer-events-auto absolute bottom-4 left-1/2 z-20 flex max-w-[92vw] -translate-x-1/2 flex-wrap items-center justify-center gap-2 bg-paper/95 px-3 py-2 text-xs text-ink shadow-sm">
      <span className="text-muted">Chưa có khóa Google</span>
      <button
        type="button"
        className={`min-h-9 px-2 ${mode === "model" ? "text-teal" : ""}`}
        onClick={() => onMode("model")}
      >
        3D tạm
      </button>
      <button
        type="button"
        className={`min-h-9 px-2 ${mode === "satellite" ? "text-teal" : ""}`}
        onClick={() => onMode("satellite")}
      >
        Ảnh vệ tinh
      </button>
      <a className="min-h-9 px-2 underline-offset-2 hover:underline" href={GOOGLE_3D_URL} target="_blank" rel="noreferrer">
        Mở 3D Google Maps
      </a>
    </div>
  );
}

export function GoogleRexView() {
  const [mode, setMode] = useState<"model" | "satellite">("model");

  if (mapsKey) {
    return (
      <div className="relative h-full w-full bg-[#e7e1d6]">
        <PhotorealisticMap />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-[#e7e1d6]">
      {mode === "model" ? <TemporaryCityModel /> : <SatelliteEmbed />}
      <StandInChrome mode={mode} onMode={setMode} />
    </div>
  );
}
