export default function SessionUptime({ startTime = null }) {
  if (!startTime) return null;

  const date = new Date(startTime);
  if (isNaN(date.getTime())) return null;

  const formatted = date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <span className="ml-auto hidden items-center gap-1.5 font-mono text-[11px] text-zinc-500 sm:flex">
      <span className="relative flex h-1.5 w-1.5">
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      deployed {formatted}
    </span>
  );
}
