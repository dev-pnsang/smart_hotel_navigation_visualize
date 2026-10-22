import { demoBooking } from "@/data/demo-hotel/booking";

export function AccessCard({ guestName }: { guestName: string }) {
  return (
    <div className="border border-line bg-ink px-5 py-5 text-paper">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] tracking-[0.18em] text-gold uppercase">Demo access</p>
          <p className="mt-3 font-display text-4xl leading-none">Phòng {demoBooking.roomNumber}</p>
          <p className="mt-2 text-sm text-paper/75">Tầng 4 · {demoBooking.roomType}</p>
        </div>
        <p className="border border-paper/20 px-2 py-1 text-[0.68rem] tracking-[0.14em] uppercase">Simulated</p>
      </div>
      <p className="mt-5 text-sm text-paper/80">{guestName}</p>
      <p className="mt-1 text-xs text-paper/60">Không phải khóa điện tử hay thẻ từ thật.</p>
    </div>
  );
}
