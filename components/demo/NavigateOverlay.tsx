"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { DESTINATION_NODE_ID } from "@/data/demo-hotel/booking";
import { getAmenityByNode } from "@/data/demo-hotel/amenities";
import { getFloor } from "@/data/demo-hotel/floors";
import { nodeById } from "@/data/demo-hotel/navigation-graph";
import { FloorPlanSvg } from "@/components/hotel-3d/FloorPlanSvg";
import { bindRouteProgress } from "@/lib/nav-runtime";
import { pathDistance } from "@/lib/navigation";
import { useDemo } from "@/lib/demo-store";
import { formatMeters, formatSimDuration } from "@/lib/format";
import { statusLabel } from "@/lib/status";
import { Button } from "@/components/ui/Button";
import { AccessCard } from "./AccessCard";

export function NavigateOverlay() {
  const {
    state,
    steps,
    planRoute,
    playNavigation,
    pauseNavigation,
    nextStep,
    prevStep,
    stopNavigation,
    showOverview,
    beginExplore,
    resumeGuided,
    setAutoAdvance,
    setExplode,
    replayRoute,
  } = useDemo();
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "arrived") return;
    if (!state.showRoute || state.routeNodeIds.length === 0) {
      planRoute(state.destinationNodeId ?? DESTINATION_NODE_ID);
    }
    setExplode(0);
    playNavigation();
    // Start the walk as soon as this screen opens. Overview and free explore stay in control after that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bindRouteProgress((value) => {
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, Math.max(0, value))})`;
    });
    return () => bindRouteProgress(null);
  }, []);

  const step = steps[state.navStepIndex];
  const destination = state.destinationNodeId ? nodeById.get(state.destinationNodeId) : undefined;
  const amenity = state.destinationNodeId ? getAmenityByNode(state.destinationNodeId) : undefined;
  const destinationLabel = amenity?.name ?? (destination?.kind === "room" ? `Phòng ${destination.label}` : destination?.label ?? "Điểm đến");
  const floor = getFloor(state.selectedFloorId);
  const meters = pathDistance(state.routeNodeIds);
  const arrived = state.status === "arrived";
  const primaryLabel = state.stepHold ? "Tiếp tục" : state.navPlaying ? "Tạm dừng" : state.hasStarted ? "Tiếp tục" : "Bắt đầu dẫn đường";

  const onPrimary = () => {
    if (state.stepHold) nextStep();
    else if (state.navPlaying) pauseNavigation();
    else playNavigation();
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className={`absolute inset-0 z-20 grid place-items-center bg-ivory transition-opacity duration-500 ${state.coverFloorId ? "pointer-events-auto opacity-100" : "opacity-0"}`}
      >
        <div className="px-6 text-center">
          <p className="text-xs tracking-[0.18em] text-muted uppercase">Thang máy · mô phỏng</p>
          <p className="mt-3 font-display text-5xl">Đang đến {getFloor(state.coverFloorId ?? "")?.name ?? "tầng kế"}</p>
        </div>
      </div>

      <header className="pointer-events-auto absolute top-3 right-20 left-3 bg-paper/95 p-4 md:right-auto md:max-w-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.68rem] tracking-[0.16em] text-muted uppercase">{statusLabel[state.status]}</p>
            <h1 className="mt-1 font-display text-3xl leading-none">{destinationLabel}</h1>
          </div>
          <p className="text-sm text-teal">{floor?.name}</p>
        </div>
        <p className="mt-3 text-base leading-6">{arrived ? "Hành trình mô phỏng đã kết thúc." : step?.instruction ?? "Chưa có lộ trình."}</p>
        <p className="mt-2 text-xs text-muted">
          {steps.length ? `Bước ${Math.min(steps.length, state.navStepIndex + 1)}/${steps.length}` : "Chưa có bước"} · {formatMeters(meters)} · {formatSimDuration(meters)} · ước tính mô phỏng
        </p>
        <div className="mt-3 h-1.5 overflow-hidden bg-line">
          <div ref={bar} className="h-1.5 origin-left bg-teal" style={{ transform: "scaleX(0)" }} />
        </div>
      </header>

      <aside className="pointer-events-none absolute top-16 right-3 z-10 w-[min(62vw,280px)] border border-line bg-paper p-2 shadow-[0_12px_40px_rgba(28,25,21,0.08)] md:w-[420px] lg:w-[500px]">
        <p className="px-1 text-[0.68rem] tracking-[0.16em] text-muted uppercase">Sơ đồ · {floor?.name}</p>
        <div className="mt-1 aspect-[34/24] w-full">
          <FloorPlanSvg />
        </div>
      </aside>

      {arrived ? (
        <section className="pointer-events-auto absolute inset-x-3 bottom-3 bg-paper p-5 md:right-auto md:left-5 md:w-[380px]">
          <p className="text-xs tracking-[0.16em] text-teal uppercase">Đã đến nơi</p>
          <h2 className="mt-2 font-display text-4xl leading-none">
            {destination?.kind === "room" ? `Bạn đã đến phòng ${destination.label}` : `Bạn đã đến ${destinationLabel}`}
          </h2>
          <p className="mt-2 text-sm text-slate">{floor?.name}. Kết quả này thuộc kịch bản demo, không cần đứng trước cửa thật.</p>
          {destination?.kind === "room" ? (
            <div className="mt-4">
              <AccessCard guestName={state.guestName} />
            </div>
          ) : null}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button onClick={replayRoute}>Xem lại lộ trình</Button>
            <Link href="/stay/demo/hotel" className="inline-flex min-h-12 items-center justify-center border border-line px-5 text-sm">
              Khám phá khách sạn
            </Link>
          </div>
        </section>
      ) : (
        <section className="pointer-events-auto absolute inset-x-0 bottom-0 bg-paper px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:right-auto md:bottom-5 md:left-5 md:w-[440px]">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onPrimary} disabled={!step}>{primaryLabel}</Button>
            <Button variant="line" onClick={prevStep} disabled={!state.hasStarted || state.navStepIndex === 0}>
              Quay lại
            </Button>
            <Button variant="line" onClick={state.cameraMode === "isometric" ? resumeGuided : showOverview}>
              {state.cameraMode === "isometric" ? "Tiếp tục dẫn đường" : "Xem toàn cảnh"}
            </Button>
            <Button variant="line" onClick={state.cameraMode === "explore" ? resumeGuided : beginExplore}>
              {state.cameraMode === "explore" ? "Tiếp tục đến phòng" : "Tự khám phá"}
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 accent-teal"
                checked={state.autoAdvance}
                onChange={(event) => setAutoAdvance(event.target.checked)}
              />
              Tự chuyển bước
            </label>
            <button type="button" className="min-h-11 text-sm text-slate" onClick={stopNavigation}>
              Dừng dẫn đường
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
