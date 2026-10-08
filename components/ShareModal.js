"use client";

import { useState, useEffect } from "react";

export default function ShareModal({
  isOpen,
  onClose,
  templateId,
  data,
  user,
  portfolioId = null,
}) {
  const [expiresInHours, setExpiresInHours] = useState(0); // 0 = vĩnh viễn
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareId, setShareId] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);

  // Reset or initialize when modal opens
  useEffect(() => {
    if (!isOpen) {
      setShareUrl("");
      setError("");
      setCopied(false);
      return;
    }

    // Auto generate share link when modal opens
    handleCreateShare(0);
  }, [isOpen]);

  async function handleCreateShare(hours = expiresInHours) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/portfolios/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioId,
          template: templateId,
          data,
          expiresInHours: hours === 0 ? null : hours,
          userEmail: user?.email || null,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Không thể tạo liên kết chia sẻ.");

      const fullUrl = `${window.location.origin}/share/${json.shareId}`;
      setShareId(json.shareId);
      setShareUrl(fullUrl);
      setExpiresAt(json.expiresAt);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleOpenLink() {
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#21242e]/80 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="n2001-hardware-card w-full max-w-lg overflow-hidden border-2 border-[#3d4f97] bg-[#7a8aba] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="n2001-carbon-bar flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="n2001-racetrack text-[9px] py-0 px-2 tracking-tight">GENFOLIO</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#ecab37]">
              CHIA SẺ PORTFOLIO TRỰC TUYẾN
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-5 w-5 items-center justify-center rounded-[2px] border border-[#3d4f97] bg-[#21242e] text-[11px] font-bold text-white hover:bg-[#e60012] transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.5px] text-[#21242e]">
              LIÊN KẾT XEM TRỰC TIẾP
            </h3>
            <p className="mt-1 text-xs text-[#3d4f97]">
              Bất kỳ ai có liên kết này đều có thể xem portfolio của bạn với giao diện hoàn chỉnh, dữ liệu thật và tương thích mọi thiết bị.
            </p>
          </div>

          {/* Expiration Options */}
          <div className="mb-5 rounded-[4px] border border-[#3d4f97] bg-[#dedede] p-3">
            <label className="block text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e] mb-2">
              Thời hạn của liên kết:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Vĩnh viễn", value: 0 },
                { label: "24 Giờ", value: 24 },
                { label: "7 Ngày", value: 168 },
                { label: "30 Ngày", value: 720 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setExpiresInHours(opt.value);
                    handleCreateShare(opt.value);
                  }}
                  className={`rounded-[2px] border px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.5px] transition cursor-pointer ${
                    expiresInHours === opt.value
                      ? "border-[#21242e] bg-[#f68d1f] text-white shadow-xs"
                      : "border-[#3d4f97] bg-white text-[#21242e] hover:bg-[#9fbee7]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Share Link Input & Copy */}
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <span className="flex h-3 w-3 animate-ping rounded-full bg-[#f68d1f] mr-2" />
              <span className="text-xs font-bold text-[#21242e]">Đang khởi tạo liên kết chia sẻ…</span>
            </div>
          ) : error ? (
            <div className="mb-4 rounded-[2px] border border-[#e60012] bg-white p-3 text-xs text-[#e60012]">
              {error}
            </div>
          ) : (
            <div>
              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-[2px] border border-[#3d4f97] bg-white px-3 py-2 text-xs font-mono text-[#21242e] select-all focus:outline-none shadow-inner"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="n2001-btn-signal shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-[0.5px] cursor-pointer"
                >
                  {copied ? "✓ ĐÃ SAO CHÉP" : "SAO CHÉP"}
                </button>
              </div>

              {expiresAt && (
                <p className="mt-2 text-[10px] text-[#3d4f97] font-semibold">
                  * Liên kết sẽ tự động hết hạn vào:{" "}
                  {new Date(expiresAt).toLocaleString("vi-VN")}
                </p>
              )}

              {/* Quick Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#3d4f97]/40 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-[#21242e]">Chia sẻ qua:</span>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Khám phá portfolio lập trình viên của tôi trên Genfolio! 🚀 ${shareUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-[#3d4f97] bg-white text-xs font-bold text-[#21242e] hover:bg-[#9fbee7] transition"
                    title="Chia sẻ lên X / Twitter"
                  >
                    𝕏
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-[#3d4f97] bg-white text-xs font-bold text-[#21242e] hover:bg-[#9fbee7] transition"
                    title="Chia sẻ lên LinkedIn"
                  >
                    in
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-[#3d4f97] bg-white text-xs font-bold text-[#21242e] hover:bg-[#9fbee7] transition"
                    title="Chia sẻ lên Facebook"
                  >
                    fb
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleOpenLink}
                  className="n2001-btn-base flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#21242e] cursor-pointer"
                >
                  <span>MỞ XEM THỬ</span>
                  <span className="font-mono">↗</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
