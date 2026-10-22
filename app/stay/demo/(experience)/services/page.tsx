import type { Metadata } from "next";
import { ServicesOverlay } from "@/components/demo/ServicesOverlay";

export const metadata: Metadata = {
  title: "Tiện ích",
};

export default function ServicesPage() {
  return <ServicesOverlay />;
}
