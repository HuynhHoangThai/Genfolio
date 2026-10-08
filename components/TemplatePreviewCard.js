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
      style={{ perspective: "1200px", "--home-stagger": `${(index % 3) * 4}%` }}
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-[4px] border-t border-l border-white/70 border-r border-[#3d4f97] border-b-2 border-b-[#3d4f97] bg-[#dedede] shadow-[inset_1px_1px_0_rgba(255,255,255,0.4),0_3px_6px_rgba(33,36,46,0.25)] transition-transform duration-200 hover:-translate-y-1">
        {/* Cartridge Header Plate */}
        <div className="flex items-center justify-between border-b border-[#3d4f97] bg-[#7a8aba] px-3 py-1.5 text-[10px] font-bold text-[#21242e]">
          <span className="tracking-[0.5px]">NINTENDO 2001 ARCHIVE</span>
          <span className="font-mono text-[#3d4f97]">{cartridgeCode}</span>
        </div>

        {/* Viewport screen */}
        <div className="relative aspect-[16/10] overflow-hidden border-b border-[#3d4f97] bg-[#21242e]">
          {Template && (
            <div className="home-thumb-render pointer-events-none absolute left-0 top-0">
              <Template data={defaultPortfolioData} />
            </div>
          )}
          {/* Subtle CRT / game screen border reflection */}
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]" />
        </div>

        {/* Cartridge Body */}
        <div className="flex flex-1 flex-col bg-[#dedede] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-[18px] leading-tight text-[#21242e] uppercase tracking-[0.2px]">
                {template.name}
              </h3>
              <p className="mt-1 text-[11px] leading-[1.4] text-[#3d4f97]">
                {template.description}
              </p>
            </div>

            {/* ESRB Rating Square */}
            <div
              className="flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded-[2px] border border-[#21242e] bg-white text-[11px] font-black text-[#21242e] shadow-xs"
              title="Phù hợp cho mọi lập trình viên"
            >
              E
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-4">
            {tagLabel ? (
              <span className="rounded-[2px] border border-[#b87c14] bg-[#ecab37] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#21242e] shadow-xs">
                {tagLabel}
              </span>
            ) : <span />}

            {/* Signal Orange Forward Action Chip */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#f68d1f] group-hover:text-[#c25f00]">
              <span className="uppercase tracking-[0.5px]">BẮT ĐẦU</span>
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[2px] bg-[#f68d1f] text-[10px] font-black text-white shadow-xs group-hover:bg-[#c25f00]">
                ▶
              </span>
            </div>
          </div>
        </div>

        {/* Stretched link for full card clickability */}
        <Link
          href={`/editor/${template.id}`}
          onClick={handleCardClick}
          className="absolute inset-0 rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]"
        >
          <span className="sr-only">Thử mẫu {template.name}</span>
        </Link>
      </div>
    </div>
  );
}
