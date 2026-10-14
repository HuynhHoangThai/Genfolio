"use client";

import Link from "next/link";
import { templateComponents } from "@/components/templates";
import { defaultPortfolioData } from "@/lib/portfolioData";
import { useAuth } from "@/components/auth/AuthContext";

export default function TemplatePreviewCard({ template, index = 0 }) {
  const { isAuth, openLoginModal } = useAuth();
  const Template = templateComponents[template.id];
  const tagLabel = template.tag ? template.tag.split(",")[0].trim() : null;
  const cartridgeCode = `GF-01-${String(index + 1).padStart(2, "0")}`;

  const handleCardClick = (e) => {
    if (!isAuth) {
      e.preventDefault();
      openLoginModal(`/editor/${template.id}`);
    }
  };

  return (
    <div
      className="home-reveal h-full"
      style={{ "--home-stagger": `${(index % 3) * 4}%` }}
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-[25.5px] border border-[#d5d5d4] bg-[#ffffff] transition-all duration-200 hover:-translate-y-1 hover:border-[#80827f]">
        {/* Card Header Plate */}
        <div className="flex items-center justify-between border-b border-[#e0dbce] bg-[#f5f1e4] px-4 py-2 text-[10px] sm:text-[11px] font-medium text-[#2c2e2a]">
          <span className="tracking-[0.5px]">NINTENDO 2001 ARCHIVE</span>
          <span className="font-mono text-[#80827f]">{cartridgeCode}</span>
        </div>

        {/* Viewport screen */}
        <div className="relative aspect-[16/10] overflow-hidden border-b border-[#d5d5d4] bg-[#f5f1e4]">
          {Template && (
            <div className="home-thumb-render pointer-events-none absolute left-0 top-0">
              <Template data={defaultPortfolioData} />
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col bg-[#ffffff] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-[19px] leading-tight text-[#2c2e2a] tracking-tight">
                {template.name}
              </h3>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-[#80827f]">
                {template.description}
              </p>
            </div>

            {/* Rating Pill */}
            <div
              className="flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded-full border border-[#d5d5d4] bg-[#f5f1e4] text-[10px] font-bold text-[#2c2e2a]"
              title="Phù hợp cho mọi lập trình viên"
            >
              E
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-5">
            {tagLabel ? (
              <span className="rounded-[10px] border border-[#e0dbce] bg-[#f5f1e4] px-2.5 py-1 text-[11px] font-medium text-[#2c2e2a]">
                {tagLabel}
              </span>
            ) : <span />}

            {/* Coral Action Chip per MindMarket spec */}
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#ff705d] group-hover:text-[#e05645]">
              <span className="tracking-[0.5px]">BẮT ĐẦU</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff705d] text-[9px] font-bold text-white group-hover:bg-[#e05645]">
                ▶
              </span>
            </div>
          </div>
        </div>

        {/* Stretched link for full card clickability */}
        <Link
          href={`/editor/${template.id}`}
          onClick={handleCardClick}
          className="absolute inset-0 rounded-[25.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8ed462]"
        >
          <span className="sr-only">Thử mẫu {template.name}</span>
        </Link>
      </div>
    </div>
  );
}
