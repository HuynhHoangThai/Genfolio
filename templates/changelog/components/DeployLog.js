export default function DeployLog({ name, deployedAt }) {
  if (!deployedAt) return null;

  const date = new Date(deployedAt);
  if (isNaN(date.getTime())) return null;

  const dateStr = date.toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="changelog-fade-up mb-10 rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-[12px] leading-relaxed text-zinc-400">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5 text-[11px]">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold">DEPLOYMENT INFO</span>
        </div>
        <span className="text-zinc-500">{dateStr}</span>
      </div>
      <div className="mt-3 space-y-1 text-zinc-400">
        <p>
          Tác giả: <span className="text-zinc-200">{name || "Developer"}</span>
        </p>
      </div>
    </div>
  );
}
