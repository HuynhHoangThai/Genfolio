"use client";

import { useState } from "react";
import Link from "next/link";
import { templateComponents } from "@/components/templates";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {
  RetroCheckIcon,
  RetroCloseIcon,
  RetroCopyIcon,
} from "@/components/icons/RetroIcons";

export default function ShareViewClient({
  id,
  templateId,
  templateName,
  initialData,
  palettes,
  expiresAt,
}) {
  const [data, setData] = useState(initialData);
  const [copied, setCopied] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const TemplateComponent = templateComponents[templateId] || templateComponents.newspaper;

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePaletteChange = (paletteId) => {
    setData((prev) => ({ ...prev, paletteId }));
  };

  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <div className="relative min-h-screen">
      {/* Top Floating Control Bar for Shared Portfolio */}
      {showBanner && (
        <div className="sticky top-0 z-50 border-b border-[#3d4f97] bg-[#21242e]/95 px-3 py-2 text-[#dedede] shadow-lg backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Link href="/" className="flex items-center gap-1.5 focus:outline-none">
                <span className="n2001-racetrack text-[10px] py-0 px-2 tracking-tight">GENFOLIO</span>
              </Link>
              <span className="hidden h-3 w-px bg-white/20 sm:inline" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white">
                  {data?.name || "Portfolio"} <span className="text-[#ecab37]">({templateName})</span>
                </span>
                {formattedExpiry && (
                  <span className="text-[9px] text-[#9fbee7]">
                    Hết hạn: {formattedExpiry}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="n2001-btn-base flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#21242e] shadow-sm cursor-pointer"
              >
                {copied ? (
                  <>
                    <RetroCheckIcon className="w-3 h-3 text-[#f68d1f]" />
                    <span>ĐÃ SAO CHÉP</span>
                  </>
                ) : (
                  <>
                    <RetroCopyIcon className="w-3 h-3 text-[#21242e]" />
                    <span>SAO CHÉP LINK</span>
                  </>
                )}
              </button>

              <Link
                href="/"
                className="n2001-btn-signal flex items-center gap-1.5 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] shadow-sm"
              >
                <span>TẠO PORTFOLIO TƯƠNG TỰ</span>
                <span className="font-mono text-[9px]">▶</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="ml-1 flex h-4 w-4 items-center justify-center rounded-[1px] bg-white/10 text-white hover:bg-[#e60012] cursor-pointer"
                title="Ẩn thanh công cụ"
              >
                <RetroCloseIcon className="w-2.5 h-2.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Template Render */}
      <TemplateComponent data={data} />

      {/* Floating Theme Palette Switcher if available */}
      {palettes && palettes.length > 0 && (
        <div className="n2001-carbon-bar fixed bottom-4 right-4 z-40 flex items-center gap-2.5 rounded-[2px] px-3 py-2 shadow-2xl border-t border-t-[rgba(255,255,255,0.4)] border-b-2 border-b-[#14161d]">
          <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#ecab37]">MÀU</span>
          <ThemeSwitcher
            palettes={palettes}
            selectedId={data.paletteId}
            onChange={handlePaletteChange}
          />
        </div>
      )}
    </div>
  );
}
