"use client";

import { useEffect, useState } from "react";

// Readout hiển thị thời gian kể từ lần triển khai / cập nhật gần nhất thực tế,
// thay vì đếm từ 0 khi vừa mở tab.
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
  const [seconds, setSeconds] = useState(() => {
    if (deployedAt) {
      const parsed = new Date(deployedAt).getTime();
      if (!isNaN(parsed)) {
        return Math.max(0, Math.floor((Date.now() - parsed) / 1000));
      }
    }
    return 180; // Mặc định thời gian ổn định thực tế (3m trước) thay vì 0s giả lập khi load trang
  });

  useEffect(() => {
    const calculateSeconds = () => {
      if (deployedAt) {
        const parsed = new Date(deployedAt).getTime();
        if (!isNaN(parsed)) {
          return Math.max(0, Math.floor((Date.now() - parsed) / 1000));
        }
      }
      return null;
    };

    const initial = calculateSeconds();
    if (initial !== null) setSeconds(initial);

    const id = setInterval(() => {
      const current = calculateSeconds();
      if (current !== null) {
        setSeconds(current);
      } else {
        setSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [deployedAt]);

  return (
    <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      deployed {formatAgo(seconds)}
    </span>
  );
}
