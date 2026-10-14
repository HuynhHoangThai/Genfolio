"use client";

import { useEffect, useState } from "react";

function formatAgo(totalSeconds) {
  if (totalSeconds < 60) return `${Math.max(1, totalSeconds)}s ago`;
  const m = Math.floor(totalSeconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function DeployedAgo({ deployedAt = null }) {
  const [elapsed, setElapsed] = useState(() => {
    if (deployedAt) {
      const parsed = new Date(deployedAt).getTime();
      if (!isNaN(parsed)) {
        return Math.max(0, Math.floor((Date.now() - parsed) / 1000));
      }
    }
    return null;
  });

  useEffect(() => {
    if (!deployedAt) return;
    const parsed = new Date(deployedAt).getTime();
    if (isNaN(parsed)) return;

    const update = () => {
      setElapsed(Math.max(0, Math.floor((Date.now() - parsed) / 1000)));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [deployedAt]);

  const label = elapsed !== null ? `deployed ${formatAgo(elapsed)}` : "live on production";

  return (
    <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      {label}
    </span>
  );
}
