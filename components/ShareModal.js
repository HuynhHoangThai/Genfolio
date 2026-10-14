"use client";

import { useState, useEffect } from "react";
import {
  RetroCheckIcon,
  RetroCloseIcon,
  RetroCopyIcon,
  RetroSocialTwitterIcon,
  RetroSocialLinkedInIcon,
  RetroSocialFacebookIcon,
} from "@/components/icons/RetroIcons";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c2e2a]/40 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-[25.5px] border border-[#d5d5d4] bg-[#ffffff] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#f5f1e4] border-b border-[#d5d5d4]">
          <div className="flex items-center gap-2">
            <span className="rounded-[10px] border border-[#d5d5d4] bg-[#ffffff] px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-tight text-[#2c2e2a]">
              GENFOLIO
            </span>
            <span className="text-[12px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
              CHIA SẺ PORTFOLIO TRỰC TUYẾN
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d5d5d4] bg-[#ffffff] text-[#2c2e2a] hover:bg-[#ff705d] hover:text-white hover:border-[#ff705d] transition cursor-pointer"
          >
            <RetroCloseIcon className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#2c2e2a]">
              LIÊN KẾT XEM TRỰC TIẾP
            </h3>
            <p className="mt-1 text-xs text-[#80827f]">
              Bất kỳ ai có liên kết này đều có thể xem portfolio của bạn với giao diện hoàn chỉnh, dữ liệu thật và tương thích mọi thiết bị.
            </p>
          </div>

          {/* Expiration Options */}
          <div className="mb-5 rounded-[20px] border border-[#d5d5d4] bg-[#f5f1e4] p-3.5">
            <label className="block text-[11px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a] mb-2">
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
                  className={`rounded-[50px] border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.5px] transition cursor-pointer ${
                    expiresInHours === opt.value
                      ? "border-[#8ed462] bg-[#8ed462] text-[#2c2e2a]"
                      : "border-[#d5d5d4] bg-[#ffffff] text-[#2c2e2a] hover:bg-[#e0dbce]"
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
              <span className="flex h-3 w-3 animate-ping rounded-full bg-[#8ed462] mr-2" />
              <span className="text-xs font-bold text-[#2c2e2a]">Đang khởi tạo liên kết chia sẻ…</span>
            </div>
          ) : error ? (
            <div className="mb-4 rounded-[20px] border border-[#ff705d] bg-white p-3 text-xs text-[#ff705d]">
              {error}
            </div>
          ) : (
            <div>
              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-[50px] border border-[#d5d5d4] bg-white px-3.5 py-2 text-xs font-mono text-[#2c2e2a] select-all focus:outline-none focus:border-[#8ed462]"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-[0.5px] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <RetroCheckIcon className="w-3.5 h-3.5" />
                      <span>ĐÃ SAO CHÉP</span>
                    </>
                  ) : (
                    <>
                      <RetroCopyIcon className="w-3.5 h-3.5" />
                      <span>SAO CHÉP</span>
                    </>
                  )}
                </button>
              </div>

              {expiresAt && (
                <p className="mt-2 text-[10px] text-[#80827f] font-semibold">
                  * Liên kết sẽ tự động hết hạn vào:{" "}
                  {new Date(expiresAt).toLocaleString("vi-VN")}
                </p>
              )}

              {/* Quick Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#d5d5d4] pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-[#2c2e2a]">Chia sẻ qua:</span>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Khám phá portfolio lập trình viên của tôi trên Genfolio: ${shareUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d5d5d4] bg-white text-[#2c2e2a] hover:bg-[#f5f1e4] hover:border-[#8ed462] transition cursor-pointer"
                    title="Chia sẻ lên X / Twitter"
                  >
                    <RetroSocialTwitterIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d5d5d4] bg-white text-[#2c2e2a] hover:bg-[#f5f1e4] hover:border-[#8ed462] transition cursor-pointer"
                    title="Chia sẻ lên LinkedIn"
                  >
                    <RetroSocialLinkedInIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d5d5d4] bg-white text-[#2c2e2a] hover:bg-[#f5f1e4] hover:border-[#8ed462] transition cursor-pointer"
                    title="Chia sẻ lên Facebook"
                  >
                    <RetroSocialFacebookIcon className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleOpenLink}
                  className="rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] hover:bg-[#f5f1e4] flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a] cursor-pointer"
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
