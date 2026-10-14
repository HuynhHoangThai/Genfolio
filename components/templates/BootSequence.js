export default function BootSequence({ name, sectionCount, deployedAt }) {
  if (!deployedAt) return null;

  const date = new Date(deployedAt);
  if (isNaN(date.getTime())) return null;

  const dateStr = date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="terminal-fade-up mb-8 rounded border border-zinc-900 bg-zinc-950/70 p-3.5 font-mono text-[12px] leading-relaxed text-zinc-500 shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-900 pb-2 text-[11px] text-zinc-600">
        <span className="font-semibold text-zinc-400">system status</span>
        <span className="text-zinc-500">{dateStr}</span>
      </div>
      <div className="mt-2.5 space-y-1 text-zinc-400">
        <p>
          <span className="text-emerald-500">[OK]</span> Profile:{" "}
          <span className="text-zinc-200">{name || "developer"}</span>
        </p>
        <p>
          <span className="text-emerald-500">[OK]</span> Sections:{" "}
          <span className="text-emerald-400">{sectionCount}</span> loaded
        </p>
      </div>
    </div>
  );
}
