import type { Metadata } from "next";
import { CheckInView } from "@/components/demo/CheckInView";

export const metadata: Metadata = {
  title: "Check-in",
};

export default function CheckInPage() {
  return <CheckInView />;
}
