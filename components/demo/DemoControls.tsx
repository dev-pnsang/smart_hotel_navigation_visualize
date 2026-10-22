"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingSources, DESTINATION_NODE_ID } from "@/data/demo-hotel/booking";
import { hotel } from "@/data/demo-hotel/hotel";
import { useDemo } from "@/lib/demo-store";
import { demoStatuses, hasAssignedRoom, statusLabel } from "@/lib/status";

export function DemoControls() {
  const router = useRouter();
  const { state, setSource, setStatus, beginCheckIn, completeCheckIn, planRoute, startNavigation, markArrived, resetDemo } = useDemo();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!panel.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div ref={panel} className="fixed top-3 right-3 z-50 text-ink">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="min-h-11 border border-line bg-paper px-3 text-xs tracking-[0.16em] uppercase"
      >
        Demo
      </button>
      {open ? (
        <div className="mt-2 w-72 border border-line bg-paper p-4 shadow-[0_12px_40px_rgba(28,25,21,0.08)]">
          <p className="text-xs leading-5 text-muted">{hotel.disclaimer}</p>
          <p className="mt-4 text-[0.68rem] tracking-[0.16em] text-muted uppercase">Nguồn đặt phòng</p>
          <div className="mt-2 flex gap-2">
            {bookingSources.map((source) => (
              <button
                key={source}
                type="button"
                onClick={() => setSource(source)}
                className={`min-h-10 flex-1 text-sm ${state.source === source ? "bg-ink text-paper" : "border border-line"}`}
              >
                {source}
              </button>
            ))}
          </div>
          <label className="mt-4 block text-[0.68rem] tracking-[0.16em] text-muted uppercase">
            Trạng thái
            <select
              value={state.status}
              onChange={(event) => setStatus(event.target.value as (typeof demoStatuses)[number])}
              className="mt-2 w-full border border-line bg-ivory px-3 py-2 text-sm tracking-normal text-ink normal-case"
            >
              {demoStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4 grid gap-2">
            <button type="button" className="min-h-10 text-left text-sm" onClick={() => { setOpen(false); router.push("/stay/demo"); }}>
              Màn hình chào
            </button>
            <button
              type="button"
              className="min-h-10 text-left text-sm"
              onClick={() => {
                beginCheckIn();
                setOpen(false);
                router.push("/stay/demo/check-in");
              }}
            >
              Check-in
            </button>
            <button
              type="button"
              className="min-h-10 text-left text-sm"
              onClick={() => {
                if (!hasAssignedRoom(state.status)) completeCheckIn();
                setOpen(false);
                router.push("/stay/demo/hotel");
              }}
            >
              Khách sạn 3D
            </button>
            <button
              type="button"
              className="min-h-10 text-left text-sm"
              onClick={() => {
                if (!hasAssignedRoom(state.status)) completeCheckIn();
                startNavigation(DESTINATION_NODE_ID);
                setOpen(false);
                router.push("/stay/demo/navigate");
              }}
            >
              Dẫn đường
            </button>
            <button
              type="button"
              className="min-h-10 text-left text-sm"
              onClick={() => {
                if (!hasAssignedRoom(state.status)) completeCheckIn();
                planRoute(DESTINATION_NODE_ID);
                markArrived();
                setOpen(false);
                router.push("/stay/demo/navigate");
              }}
            >
              Đến phòng
            </button>
          </div>
          <button
            type="button"
            className="mt-3 min-h-11 w-full border border-line text-sm"
            onClick={() => {
              resetDemo();
              setOpen(false);
              router.push("/stay/demo");
            }}
          >
            Reset demo
          </button>
        </div>
      ) : null}
    </div>
  );
}
