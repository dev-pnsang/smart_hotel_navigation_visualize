"use client";

import { useRouter } from "next/navigation";
import { getAmenity } from "@/data/demo-hotel/amenities";
import { DESTINATION_ROOM_ID, demoBooking } from "@/data/demo-hotel/booking";
import { getFloor } from "@/data/demo-hotel/floors";
import { getRoom } from "@/data/demo-hotel/rooms";
import { useDemo } from "@/lib/demo-store";
import { hasAssignedRoom, statusLabel } from "@/lib/status";
import { Button } from "@/components/ui/Button";

export function SelectionCard({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { state, startNavigation } = useDemo();
  const room = state.selection?.kind === "room" ? getRoom(state.selection.id) : undefined;
  const amenity =
    state.selection?.kind === "amenity"
      ? getAmenity(state.selection.id)
      : state.selection
        ? undefined
        : undefined;
  const assigned = hasAssignedRoom(state.status) ? getRoom(DESTINATION_ROOM_ID) : undefined;
  const focusRoom = room ?? (amenity?.nodeId === DESTINATION_ROOM_ID ? getRoom(DESTINATION_ROOM_ID) : undefined);
  const floor = getFloor(focusRoom?.floorId ?? amenity?.floorId ?? state.selectedFloorId);

  const title = focusRoom
    ? `Phòng ${focusRoom.number}`
    : amenity
      ? amenity.name
      : assigned
        ? `Phòng ${assigned.number}`
        : "Chọn một điểm";
  const nodeId = focusRoom?.nodeId ?? amenity?.nodeId ?? assigned?.nodeId ?? null;

  return (
    <div className={compact ? "grid gap-3" : "grid gap-4"}>
      <div>
        <p className="text-[0.68rem] tracking-[0.16em] text-muted uppercase">{floor?.name ?? "Khách sạn"}</p>
        <h2 className="mt-1 font-display text-4xl leading-none">{title}</h2>
      </div>
      {focusRoom && !compact ? (
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted">Loại phòng</dt>
            <dd>{focusRoom.type}</dd>
          </div>
          <div>
            <dt className="text-muted">Trạng thái demo</dt>
            <dd>{focusRoom.id === assigned?.id ? "Đã gán cho lượt ở" : "Phòng minh họa"}</dd>
          </div>
        </dl>
      ) : amenity && !compact ? (
        <p className="text-sm leading-6 text-slate">{amenity.summary}</p>
      ) : compact ? (
        <p className="mt-2 text-sm text-slate">
          {focusRoom ? `${focusRoom.type} · ${floor?.name}` : amenity ? floor?.name : `Phòng minh họa ${demoBooking.roomNumber}`}
        </p>
      ) : (
        <p className="text-sm leading-6 text-slate">
          Chạm một phòng hoặc tiện ích trên mô hình. Phòng {demoBooking.roomNumber} là điểm đến của kịch bản này.
        </p>
      )}
      <p className="text-xs text-muted">{statusLabel[state.status]}</p>
      <Button
        disabled={!nodeId}
        onClick={() => {
          if (!nodeId) return;
          startNavigation(nodeId);
          router.push("/stay/demo/navigate");
        }}
      >
        {focusRoom ? "Dẫn đường đến đây" : amenity ? "Đi đến đây" : `Dẫn đường đến phòng ${demoBooking.roomNumber}`}
      </Button>
    </div>
  );
}
