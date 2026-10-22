"use client";

import { floors } from "@/data/demo-hotel/floors";
import { useDemo } from "@/lib/demo-store";
import type { FloorId } from "@/data/demo-hotel/types";
import { FloorPlanSvg } from "./FloorPlanSvg";

export function FloorPlanFallback({ reason }: { reason?: string }) {
  const { state, selectFloor } = useDemo();

  return (
    <div className="flex h-full flex-col bg-ivory px-4 pt-28 pb-36 text-ink md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs tracking-[0.16em] text-muted uppercase">Sơ đồ thay thế</p>
        <h2 className="mt-2 font-display text-4xl">Mặt bằng mô phỏng</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate">
          {reason ?? "Trình duyệt không chạy được WebGL."} Bạn vẫn chọn được tầng, phòng và xem lộ trình mẫu trên sơ đồ.
        </p>
        <div className="mt-4 flex gap-2">
          {floors.map((floor) => (
            <button
              key={floor.id}
              type="button"
              onClick={() => selectFloor(floor.id as FloorId)}
              className={`min-h-11 px-4 text-sm ${state.selectedFloorId === floor.id ? "bg-ink text-paper" : "bg-paper text-ink"}`}
            >
              {floor.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-4 w-full max-w-3xl flex-1 border border-line bg-paper">
        <FloorPlanSvg />
      </div>
    </div>
  );
}
