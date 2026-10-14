// Real system bootstrap & kernel status display linked to Genfolio deployment
export default function BootSequence({ name, sectionCount, deployedAt }) {
  const dateStr = deployedAt ? new Date(deployedAt).toISOString() : new Date().toISOString();

  return (
    <div className="terminal-fade-up mb-8 rounded border border-zinc-900 bg-zinc-950/70 p-3.5 font-mono text-[12px] leading-relaxed text-zinc-500 shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-900 pb-2 text-[11px] text-zinc-600">
        <span className="font-semibold text-zinc-400">GENFOLIO KERNEL v2.5.0-LTS (x86_64)</span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          ONLINE / SYNCED
        </span>
      </div>
      <div className="mt-2.5 space-y-1 text-zinc-400">
        <p>
          <span className="text-emerald-500">[OK]</span> Mounted portfolio root filesystem for user{" "}
          <span className="text-zinc-200">{name || "developer"}</span>
        </p>
        <p>
          <span className="text-emerald-500">[OK]</span> Activated{" "}
          <span className="text-emerald-400">{sectionCount}</span> content modules and route handlers
        </p>
        <p>
          <span className="text-emerald-500">[OK]</span> Last deployment milestone verified:{" "}
          <span className="text-zinc-300">{dateStr}</span>
        </p>
        <p className="text-zinc-600">
          &gt; All background jobs and webhook synchronizations nominal.
        </p>
      </div>
    </div>
  );
}
