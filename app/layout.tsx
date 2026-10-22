import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { hotel } from "@/data/demo-hotel/hotel";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: hotel.name,
    template: `%s · ${hotel.name}`,
  },
  description:
    "Bản demo giao diện check-in và dẫn đường 3D theo Khách sạn Rex Sài Gòn. Không kết nối hệ thống khách sạn thật.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
