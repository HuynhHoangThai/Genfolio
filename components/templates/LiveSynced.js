function formatAgo(totalSeconds) {
  if (totalSeconds < 60) return `${totalSeconds}s ago`;
  const m = Math.floor(totalSeconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export default function LiveSynced({ deployedAt = null, accent, textColor }) {
  if (!deployedAt) return null;

  const parsed = new Date(deployedAt).getTime();
  if (isNaN(parsed)) return null;

  const seconds = Math.max(0, Math.floor((Date.now() - parsed) / 1000));

  return (
    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: textColor }}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
      </span>
      Synced {formatAgo(seconds)}
    </span>
  );
}
