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
        <div className="sticky top-0 z-50 border-b border-[#d5d5d4] bg-[#ffffff]/95 px-4 py-2.5 text-[#2c2e2a] shadow-xs backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Link href="/" className="flex items-center gap-1.5 focus:outline-none">
                <span className="rounded-[10px] border border-[#d5d5d4] bg-[#f5f1e4] px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-tight text-[#2c2e2a]">GENFOLIO</span>
              </Link>
              <span className="hidden h-3 w-px bg-[#d5d5d4] sm:inline" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#2c2e2a]">
                  {data?.name || "Portfolio"} <span className="font-extrabold text-[#2c2e2a]">({templateName})</span>
                </span>
                {formattedExpiry && (
                  <span className="text-[9px] text-[#80827f]">
                    Hết hạn: {formattedExpiry}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] hover:bg-[#f5f1e4] flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a] transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <RetroCheckIcon className="w-3 h-3 text-[#8ed462]" />
                    <span>ĐÃ SAO CHÉP</span>
                  </>
                ) : (
                  <>
                    <RetroCopyIcon className="w-3 h-3 text-[#2c2e2a]" />
                    <span>SAO CHÉP LINK</span>
                  </>
                )}
              </button>

              <Link
                href="/"
                className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white flex items-center gap-1.5 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] transition"
              >
                <span>TẠO PORTFOLIO TƯƠNG TỰ</span>
                <span className="font-mono text-[9px]">▶</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#d5d5d4] bg-[#ffffff] text-[#2c2e2a] hover:bg-[#ff705d] hover:text-white hover:border-[#ff705d] transition cursor-pointer"
                title="Ẩn thanh công cụ"
              >
                <RetroCloseIcon className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Template Render */}
      <TemplateComponent data={data} />

      {/* Floating Theme Palette Switcher if available */}
      {palettes && palettes.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] px-3.5 py-2 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">MÀU</span>
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
