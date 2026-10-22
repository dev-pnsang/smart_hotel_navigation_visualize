"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { demoBooking } from "@/data/demo-hotel/booking";
import { formatStayDate } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";
import { statusLabel } from "@/lib/status";
import { Button } from "@/components/ui/Button";
import { AccessCard } from "./AccessCard";

const steps = ["Xác nhận đặt phòng", "Thông tin khách", "Hoàn tất"];

export function CheckInView() {
  const router = useRouter();
  const { state, setCheckInStep, patchGuest, completeCheckIn } = useDemo();
  const step = state.checkInStep;
  const canFinish = state.guestName.trim().length > 1 && state.infoConfirmed;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-8 lg:py-16">
      <Link href="/stay/demo" className="inline-flex min-h-11 items-center gap-1 text-sm text-slate">
        <ChevronLeft size={18} />
        Quay lại
      </Link>
      <p className="mt-8 text-xs tracking-[0.18em] text-muted uppercase">Self check-in · mô phỏng</p>
      <h1 className="mt-3 font-display text-5xl leading-none">Check-in</h1>
      <p className="mt-3 text-sm text-teal">{statusLabel[state.status]}</p>

      <ol className="mt-8 grid grid-cols-3 gap-3" aria-label="Tiến trình check-in">
        {steps.map((label, index) => (
          <li key={label}>
            <div className={`mb-2 h-px ${index <= step ? "bg-teal" : "bg-line"}`} />
            <p className={`text-xs ${index === step ? "text-ink" : "text-muted"}`}>
              {index + 1}. {label}
            </p>
          </li>
        ))}
      </ol>

      <section className="mt-8 flex-1">
        {step === 0 ? (
          <dl className="grid gap-5 border-y border-line py-6">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Mã đặt phòng</dt>
              <dd>{demoBooking.reference}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Thời gian lưu trú</dt>
              <dd className="text-right">
                {formatStayDate(demoBooking.checkInDate)}
                <span className="block">{formatStayDate(demoBooking.checkOutDate)}</span>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Số khách</dt>
              <dd>{state.guestCount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Loại phòng dự kiến</dt>
              <dd>{demoBooking.roomType}</dd>
            </div>
          </dl>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-6">
            <label className="grid gap-2 text-sm">
              Tên khách
              <input
                value={state.guestName}
                onChange={(event) => patchGuest({ guestName: event.target.value })}
                className="min-h-12 border border-line bg-paper px-3 text-base"
              />
            </label>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm">Số khách lưu trú</span>
              <div className="flex items-center gap-3">
                <button type="button" className="min-h-11 min-w-11 border border-line" onClick={() => patchGuest({ guestCount: state.guestCount - 1 })}>
                  −
                </button>
                <span className="w-6 text-center">{state.guestCount}</span>
                <button type="button" className="min-h-11 min-w-11 border border-line" onClick={() => patchGuest({ guestCount: state.guestCount + 1 })}>
                  +
                </button>
              </div>
            </div>
            <label className="flex items-start gap-3 text-sm leading-6">
              <input
                type="checkbox"
                className="mt-1 size-5 accent-teal"
                checked={state.infoConfirmed}
                onChange={(event) => patchGuest({ infoConfirmed: event.target.checked })}
              />
              Tôi xác nhận thông tin mô phỏng này là đúng cho lượt demo. Không cần giấy tờ hay thanh toán.
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-6">
            <div>
              <p className="text-xs tracking-[0.16em] text-teal uppercase">Check-in mô phỏng đã hoàn tất</p>
              <h2 className="mt-3 font-display text-5xl">Phòng {demoBooking.roomNumber}</h2>
              <p className="mt-2 text-sm text-slate">Tầng 4 đã được gán cho lượt ở mẫu. Đây không phải phân phòng của khách sạn thật.</p>
            </div>
            <AccessCard guestName={state.guestName} />
          </div>
        ) : null}
      </section>

      <div className="mt-8 flex gap-3 pb-4">
        {step > 0 ? (
          <Button variant="line" onClick={() => setCheckInStep((step - 1) as 0 | 1 | 2)}>
            Quay lại bước
          </Button>
        ) : null}
        {step < 2 ? (
          <Button
            className="flex-1"
            disabled={step === 1 && !canFinish}
            onClick={() => {
              if (step === 0) setCheckInStep(1);
              if (step === 1) completeCheckIn();
            }}
          >
            Tiếp tục
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => router.push("/stay/demo/hotel")}>
            Khám phá khách sạn 3D
          </Button>
        )}
      </div>
    </main>
  );
}
