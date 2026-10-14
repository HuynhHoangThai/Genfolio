function formatAgo(totalSeconds) {
  if (totalSeconds < 60) return `${Math.max(1, totalSeconds)}s ago`;
  const m = Math.floor(totalSeconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function DeployedAgo({ deployedAt = null }) {
  if (!deployedAt) return null;

  const parsed = new Date(deployedAt).getTime();
  if (isNaN(parsed)) return null;

  const elapsed = Math.max(0, Math.floor((Date.now() - parsed) / 1000));
  const label = `deployed ${formatAgo(elapsed)}`;

  return (
    <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
      <span className="relative flex h-1.5 w-1.5">
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      {label}
    </span>
  );
}
