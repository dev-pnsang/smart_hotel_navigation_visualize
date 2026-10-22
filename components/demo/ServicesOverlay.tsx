"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDemo } from "@/lib/demo-store";
import { ServiceList } from "./ServiceList";

export function ServicesOverlay() {
  const { pauseNavigation, setCameraMode } = useDemo();

  useEffect(() => {
    pauseNavigation();
    setCameraMode("isometric");
  }, [pauseNavigation, setCameraMode]);

  return (
    <div className="pointer-events-none absolute inset-0">
      <Link href="/stay/demo/hotel" className="pointer-events-auto absolute top-3 left-3 bg-paper px-3 py-2 text-sm">
        Quay lại mô hình
      </Link>
      <aside className="pointer-events-auto absolute inset-x-0 bottom-0 max-h-[58vh] overflow-auto bg-paper p-4 md:inset-y-0 md:right-auto md:bottom-auto md:max-h-none md:w-[380px] md:p-6">
        <p className="text-xs tracking-[0.16em] text-muted uppercase">Tiện ích</p>
        <h1 className="mt-2 font-display text-4xl">Điểm đến trong khách sạn</h1>
        <p className="mt-2 mb-5 text-sm leading-6 text-slate">Chọn một nơi để xem trên mô hình hoặc bắt đầu lộ trình mô phỏng từ sảnh lễ tân.</p>
        <ServiceList />
      </aside>
    </div>
  );
}
