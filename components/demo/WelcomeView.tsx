"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { demoBooking } from "@/data/demo-hotel/booking";
import { getFloor } from "@/data/demo-hotel/floors";
import { hotel } from "@/data/demo-hotel/hotel";
import { formatStayDate } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";
import { hasAssignedRoom, statusLabel } from "@/lib/status";
import { Button } from "@/components/ui/Button";
import { StatusTrail } from "./StatusTrail";

export function WelcomeView() {
  const router = useRouter();
  const { state, beginCheckIn } = useDemo();
  const ready = hasAssignedRoom(state.status);

  return (
    <main className="min-h-dvh lg:grid lg:grid-cols-[1.15fr_0.85fr]">
      <section className="relative min-h-[62vh] lg:min-h-dvh">
        <Image
          src="/rex-nguyen-hue.jpg"
          alt="Khách sạn Rex về đêm tại góc phố đi bộ Nguyễn Huệ, với vương miện và biển REX HOTEL"
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-ink/25" />
        <p className="absolute top-4 left-4 max-w-xs text-[0.65rem] leading-4 text-paper/80">
          Ảnh mặt tiền Nguyễn Huệ: shankar s., CC BY 2.0, Wikimedia Commons
        </p>
        <div className="absolute right-0 bottom-0 left-0 p-6 text-paper lg:p-12">
          <p className="text-xs tracking-[0.22em] uppercase">{hotel.name}</p>
          <p className="mt-3 max-w-md font-display text-4xl leading-tight lg:text-6xl">
            Một lối vào đã được chuẩn bị sẵn.
          </p>
        </div>
      </section>

      <section className="flex flex-col justify-center px-5 py-10 lg:px-14 lg:py-16">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">
          {state.source} · {demoBooking.reference}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-none text-ink lg:text-6xl">Welcome to your stay</h1>
        <p className="mt-5 max-w-md text-base leading-7 text-slate">
          Chào {state.guestName}. Hành trình này mô phỏng check-in và đường đi tới phòng {demoBooking.roomNumber}.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-6">
          <div>
            <dt className="text-xs tracking-[0.14em] text-muted uppercase">Nhận phòng</dt>
            <dd className="mt-1 text-sm">{formatStayDate(demoBooking.checkInDate)}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.14em] text-muted uppercase">Trả phòng</dt>
            <dd className="mt-1 text-sm">{formatStayDate(demoBooking.checkOutDate)}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.14em] text-muted uppercase">Khách</dt>
            <dd className="mt-1 text-sm">{state.guestCount} người · 2 đêm</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.14em] text-muted uppercase">Trạng thái</dt>
            <dd className="mt-1 text-sm text-teal">{statusLabel[state.status]}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <StatusTrail status={state.status} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              if (ready) {
                router.push("/stay/demo/hotel");
                return;
              }
              beginCheckIn();
              router.push("/stay/demo/check-in");
            }}
          >
            {ready ? "Mở khách sạn 3D" : "Bắt đầu check-in"}
          </Button>
          <Link href="#details" className="inline-flex min-h-12 items-center justify-center px-2 text-sm text-slate underline-offset-4 hover:underline">
            Xem chi tiết đặt phòng
          </Link>
        </div>
        <p className="mt-6 max-w-md text-xs leading-5 text-muted">{hotel.disclaimer}</p>
      </section>

      <section id="details" className="border-t border-line px-5 py-12 lg:col-span-2 lg:px-14">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          <div>
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Mã lưu trú</p>
            <p className="mt-2 font-display text-3xl">{demoBooking.stayId}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Phòng dự kiến</p>
            <p className="mt-2 text-sm leading-6">
              {demoBooking.roomType}. Sau check-in mô phỏng, phòng minh họa {demoBooking.roomNumber} ở {getFloor(demoBooking.floorId)?.name.toLowerCase()} được gán cho lượt ở này.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.16em] text-muted uppercase">Kênh đặt</p>
            <p className="mt-2 text-sm leading-6">
              Nguồn đang hiển thị là {state.source}. Có thể đổi sang Booking.com trong mục Demo. Không có kết nối tới kênh đặt phòng thật.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
