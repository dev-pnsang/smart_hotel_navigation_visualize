"use client";

import { statusRank, type DemoStatus } from "@/lib/status";

const milestones: { status: DemoStatus; label: string }[] = [
  { status: "booking_confirmed", label: "Đặt phòng" },
  { status: "checkin_pending", label: "Check-in" },
  { status: "room_assigned", label: "Phân phòng" },
  { status: "navigation_active", label: "Dẫn đường" },
  { status: "arrived", label: "Đến nơi" },
];

export function StatusTrail({ status }: { status: DemoStatus }) {
  const rank = statusRank(status);

  return (
    <ol className="grid grid-cols-5 gap-2">
      {milestones.map((item) => {
        const itemRank = statusRank(item.status);
        const done = rank > itemRank || (item.status === "checkin_pending" && rank >= statusRank("checkin_completed"));
        const current =
          item.status === status ||
          (item.status === "checkin_pending" && status === "checkin_completed") ||
          (item.status === "checkin_pending" && status === "checkin_pending");
        return (
          <li key={item.status} className="min-w-0">
            <div className={`mb-2 h-px ${done || current ? "bg-teal" : "bg-line"}`} />
            <p className={`text-[0.68rem] leading-4 ${current ? "text-ink" : "text-muted"}`}>{item.label}</p>
          </li>
        );
      })}
    </ol>
  );
}
