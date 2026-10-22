"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { floors } from "@/data/demo-hotel/floors";
import { hotel } from "@/data/demo-hotel/hotel";
import { useDemo } from "@/lib/demo-store";
import { statusLabel } from "@/lib/status";
import { SelectionCard } from "./SelectionCard";
import { ServiceList } from "./ServiceList";

export function ExplorerOverlay() {
  const { state, selectFloor, setCameraMode, setFloorView, resetCamera, pauseNavigation } = useDemo();
  const [sheet, setSheet] = useState<"peek" | "open">("peek");
  const [panel, setPanel] = useState<"place" | "services">("place");

  useEffect(() => {
    pauseNavigation();
    if (state.cameraMode === "guided") setCameraMode("floor");
    // Only when the explorer opens. Starting a route from this page must keep playing after navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      <header className="pointer-events-auto flex items-start justify-between gap-3 p-3 pr-20 md:p-5 md:pr-24">
        <Link href="/stay/demo" className="bg-paper px-3 py-2">
          <span className="block font-display text-2xl leading-none">{hotel.shortName}</span>
          <span className="mt-1 block text-[0.65rem] tracking-[0.16em] text-muted uppercase">{statusLabel[state.status]}</span>
        </Link>
        <div className="flex max-w-[70%] flex-col items-end gap-2">
          <div className="flex gap-1 overflow-x-auto bg-paper p-1">
            {floors.map((floor) => (
              <button
                key={floor.id}
                type="button"
                onClick={() => {
                  selectFloor(floor.id);
                  setCameraMode("floor");
                }}
                className={`min-h-11 min-w-11 px-3 text-sm ${state.selectedFloorId === floor.id ? "bg-ink text-paper" : "text-ink"}`}
              >
                {floor.short}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            <button
              type="button"
              onClick={() => setCameraMode("isometric")}
              className={`min-h-11 bg-paper px-3 text-sm ${state.cameraMode === "isometric" ? "text-teal" : ""}`}
            >
              Toàn nhà
            </button>
            <button
              type="button"
              onClick={() => setCameraMode("floor")}
              className={`min-h-11 bg-paper px-3 text-sm ${state.cameraMode === "floor" ? "text-teal" : ""}`}
            >
              Mặt tầng
            </button>
            <button type="button" onClick={resetCamera} className="min-h-11 bg-paper px-3 text-sm">
              Đặt lại góc nhìn
            </button>
          </div>
          {state.cameraMode === "floor" ? (
            <div className="flex gap-1">
              <button type="button" className={`min-h-11 bg-paper px-3 text-sm ${state.floorView === "angled" ? "text-teal" : ""}`} onClick={() => setFloorView("angled")}>
                Nghiêng
              </button>
              <button type="button" className={`min-h-11 bg-paper px-3 text-sm ${state.floorView === "top" ? "text-teal" : ""}`} onClick={() => setFloorView("top")}>
                Từ trên
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <aside className="pointer-events-auto absolute bottom-5 left-5 hidden max-h-[72vh] w-[340px] overflow-auto bg-paper p-5 md:block">
        {state.status === "navigation_active" ? (
          <Link href="/stay/demo/navigate" className="mb-4 inline-flex bg-ink px-3 py-2 text-sm text-paper">
            Tiếp tục dẫn đường
          </Link>
        ) : null}
        <div className="mb-4 flex gap-4 text-sm">
          <button type="button" className={panel === "place" ? "text-ink" : "text-muted"} onClick={() => setPanel("place")}>
            Vị trí
          </button>
          <button type="button" className={panel === "services" ? "text-ink" : "text-muted"} onClick={() => setPanel("services")}>
            Tiện ích
          </button>
        </div>
        {panel === "place" ? <SelectionCard /> : <ServiceList />}
      </aside>

      <section className="pointer-events-auto absolute inset-x-0 bottom-0 bg-paper px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        {state.status === "navigation_active" ? (
          <Link href="/stay/demo/navigate" className="mb-3 inline-flex bg-ink px-3 py-2 text-sm text-paper">
            Tiếp tục dẫn đường
          </Link>
        ) : null}
        <button type="button" className="mx-auto mb-3 block h-1 w-12 bg-line" aria-expanded={sheet === "open"} onClick={() => setSheet(sheet === "peek" ? "open" : "peek")}>
          <span className="sr-only">{sheet === "peek" ? "Mở chi tiết" : "Thu gọn"}</span>
        </button>
        {sheet === "peek" ? (
          <SelectionCard compact />
        ) : (
          <div className="max-h-[42vh] overflow-auto pb-2">
            <div className="mb-4 flex gap-4 text-sm">
              <button type="button" onClick={() => setPanel("place")}>Vị trí</button>
              <button type="button" onClick={() => setPanel("services")}>Tiện ích</button>
            </div>
            {panel === "place" ? <SelectionCard /> : <ServiceList />}
          </div>
        )}
      </section>
    </div>
  );
}
