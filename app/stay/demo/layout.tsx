import { DemoControls } from "@/components/demo/DemoControls";
import { DemoProvider } from "@/lib/demo-store";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      {children}
      <DemoControls />
    </DemoProvider>
  );
}
