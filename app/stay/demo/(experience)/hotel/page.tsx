import type { Metadata } from "next";
import { ExplorerOverlay } from "@/components/demo/ExplorerOverlay";

export const metadata: Metadata = {
  title: "Khách sạn 3D",
};

export default function HotelPage() {
  return <ExplorerOverlay />;
}
