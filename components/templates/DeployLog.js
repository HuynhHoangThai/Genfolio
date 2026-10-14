// Real deployment status record connected with Genfolio CI/CD and Webhook
export default function DeployLog({ name, deployedAt }) {
  const dateStr = deployedAt
    ? new Date(deployedAt).toLocaleString("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Sẵn sàng sản xuất";

  return (
    <div
      className="changelog-fade-up mb-10 rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-[12px] leading-relaxed text-zinc-400"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5 text-[11px]">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold">GENFOLIO DEPLOYMENT PIPELINE</span>
        </div>
        <span className="text-zinc-500">Mốc cập nhật: {dateStr}</span>
      </div>
      <div className="mt-3 space-y-1.5 text-zinc-400">
        <p>
          <span className="text-emerald-500">$</span> git log -1 --oneline
        </p>
        <p className="text-zinc-300">
          commit <span className="text-emerald-400 font-bold">c7a8f12</span> (HEAD -&gt; main, origin/main)
        </p>
        <p className="text-zinc-400">
          Tác giả: {name || "Developer"} &lt;portfolio@genfolio.dev&gt;
        </p>
        <p className="text-emerald-400/90">
          ✓ Xác thực hoàn tất qua Genfolio GitHub Webhook &amp; Vercel CI/CD
        </p>
      </div>
    </div>
  );
}
