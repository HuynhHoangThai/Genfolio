"use client";

import Link from "next/link";
import { templateComponents } from "@/components/templates";
import { defaultPortfolioData } from "@/lib/portfolioData";
import { useAuth } from "@/components/auth/AuthContext";

export default function TemplatePreviewCard({ template, index = 0 }) {
  const { isAuth, openLoginModal } = useAuth();
  const Template = templateComponents[template.id];
  const tagLabel = template.tag ? template.tag.split(",")[0].trim() : null;

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
      <div className="home-card group relative flex h-full flex-col overflow-hidden rounded-[var(--home-radius)] border border-[var(--home-rule)] bg-[var(--home-surface)]">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--home-rule)] bg-[var(--home-bg)]">
          {Template && (
            <div className="home-thumb-render pointer-events-none absolute left-0 top-0">
              <Template data={defaultPortfolioData} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="home-grotesque text-[23px] leading-none">{template.name}</h3>
            <span className="home-nums shrink-0 text-[11px] text-[var(--home-faint)]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <p className="mt-3 text-[13px] leading-[1.55] text-[var(--home-dim)]">
            {template.description}
          </p>
          {tagLabel && (
            <p className="mt-auto pt-4">
              <span className="home-label rounded-full border border-[var(--home-rose)]/45 bg-[var(--home-rose)]/12 px-2.5 py-1 text-[var(--home-strong)]">
                {tagLabel}
              </span>
            </p>
          )}
        </div>

        {/* Stretched link makes the whole card clickable. Intercepted if unauthenticated */}
        <Link
          href={`/editor/${template.id}`}
          onClick={handleCardClick}
          className="absolute inset-0 rounded-[var(--home-radius)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-strong)]"
        >
          <span className="sr-only">Thử mẫu {template.name}</span>
        </Link>
      </div>
    </div>
  );
}
