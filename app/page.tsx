import { Suspense } from "react";

import { BenchmarkDashboard } from "@/components/benchmark-dashboard";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-live="polite">
          <span className="text-sm text-muted-foreground">Loading…</span>
        </div>
      }
    >
      <BenchmarkDashboard />
    </Suspense>
  );
}
