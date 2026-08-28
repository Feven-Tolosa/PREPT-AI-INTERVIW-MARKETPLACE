"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("RSC render error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <h1 className="font-serif text-2xl">Something went wrong</h1>
        <pre className="text-xs text-red-500 whitespace-pre-wrap text-left bg-card border border-border rounded-xl p-4 w-full overflow-auto">
          {error?.message || error?.digest || "Unknown error"}
        </pre>
        <Button variant="gold" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
