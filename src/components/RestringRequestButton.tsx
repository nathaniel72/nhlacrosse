"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

export function RestringRequestButton({ token }: { token: string }) {
  const [state, setState] = React.useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleClick() {
    setState("loading");
    try {
      const res = await fetch("/api/restring-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        Got it — you&apos;ll hear back shortly about your free restring.
      </p>
    );
  }

  return (
    <div>
      <Button variant="outline" onClick={handleClick} disabled={state === "loading"}>
        {state === "loading" ? "Sending..." : "Request a Free Restring"}
      </Button>
      {state === "error" ? (
        <p className="mt-2 text-sm font-medium text-red-600">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </div>
  );
}
