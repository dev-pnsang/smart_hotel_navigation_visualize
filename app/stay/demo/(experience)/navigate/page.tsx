import type { Metadata } from "next";
import { NavigateOverlay } from "@/components/demo/NavigateOverlay";

export const metadata: Metadata = {
  title: "Dẫn đường",
};

export default function NavigatePage() {
  return <NavigateOverlay />;
}
