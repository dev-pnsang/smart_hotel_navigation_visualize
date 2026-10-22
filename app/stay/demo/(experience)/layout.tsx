import { HotelStage } from "@/components/hotel-3d/HotelStage";

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="scene-stage relative h-dvh overflow-hidden">
      <div className="absolute inset-0">
        <HotelStage />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10">{children}</div>
    </div>
  );
}
