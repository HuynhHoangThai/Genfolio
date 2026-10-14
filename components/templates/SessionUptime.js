"use client";

import { useEffect, useState } from "react";

// Readout "session uptime" / "system uptime" — hiển thị thời gian hoạt động
// của phiên hoặc thời gian kể từ khi hệ thống khởi động.
function formatUptime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function SessionUptime({ startTime = null }) {
  const [seconds, setSeconds] = useState(() => {
    if (startTime) {
      const parsed = new Date(startTime).getTime();
      if (!isNaN(parsed)) {
        return Math.max(0, Math.floor((Date.now() - parsed) / 1000));
      }
    }
    return 0;
  });

  useEffect(() => {
    const baseStart = startTime ? new Date(startTime).getTime() : Date.now();
    const id = setInterval(() => {
      setSeconds(Math.max(0, Math.floor((Date.now() - baseStart) / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  return (
    <span className="ml-auto hidden items-center gap-1.5 font-mono text-[11px] text-zinc-500 sm:flex">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      session {formatUptime(seconds)}
    </span>
  );
}
