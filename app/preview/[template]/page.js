"use client";

// Renders a customer's in-progress draft with no editor chrome — this is
// the page opened in a new tab (desktop) or embedded in a phone-frame
// iframe (mobile) by the "Preview" buttons in the editor. It intentionally
// reads straight from localStorage instead of the database: nothing is
// persisted server-side until the customer actually clicks "Deploy my
// portfolio", so this is the only place a draft preview can come from.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTemplate, sanitizePortfolioData } from "@/lib/portfolioData";
import { templateComponents } from "@/components/templates";
import { loadStoredPortfolioData, saveStoredPortfolioData } from "@/lib/portfolioStorage";
import { getPalettesForTemplate } from "@/lib/palettes";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ShareModal from "@/components/ShareModal";
import { useAuth } from "@/components/auth/AuthContext";
import { ShareLinkIcon } from "@/components/icons/RetroIcons";

function CenteredMessage({ title, body }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#7a8aba] px-4 text-center">
      <div className="n2001-hardware-card w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="n2001-carbon-bar flex items-center justify-between px-3.5 py-2">
          <span className="n2001-racetrack text-[9px] py-0 px-2">GENFOLIO</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#ecab37]">
            SYSTEM PREVIEW
          </span>
        </div>
        <div className="p-6">
          <h1 className="text-sm font-bold uppercase tracking-[0.5px] text-[#21242e]">{title}</h1>
          {body && <p className="mt-2 text-xs leading-relaxed text-[#3d4f97]">{body}</p>}
          <Link
            href="/"
            className="n2001-btn-amber mt-5 inline-flex py-2 px-4 text-xs font-bold uppercase tracking-[0.5px]"
          >
            ← QUAY LẠI DANH SÁCH MẪU
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  const { template: templateId } = useParams();
  const template = getTemplate(templateId);
  const Template = templateComponents[templateId];
  const palettes = getPalettesForTemplate(templateId);
  const { user } = useAuth();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Set by the editor's Desktop/Mobile preview buttons (PortfolioEditor.js)
  // so this one page can tell which chrome it's embedded in — read via
  // window.location instead of next/navigation's useSearchParams(), which
  // would force this otherwise fully client-rendered page into a Suspense
  // boundary for no benefit (there's no server data here to stream around).
  // A direct visit with no param falls back to the desktop layout.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate one-time read from a client-only source (the URL), not a derived-state loop
    setIsMobile(new URLSearchParams(window.location.search).get("mode") === "mobile");
  }, []);

  // "loading" avoids a flash of the "no draft found" message before the
  // localStorage read (which can only happen client-side, after mount)
  // has had a chance to run.
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = loadStoredPortfolioData();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate one-time hydrate from a client-only source, not a derived-state loop
    setData(stored);
    setStatus(stored ? "ready" : "empty");
  }, []);

  if (!template || !Template) {
    return <CenteredMessage title="Không tìm thấy mẫu giao diện" />;
  }

  if (status === "loading") {
    return null;
  }

  if (status === "empty") {
    return (
      <CenteredMessage
        title="Chưa có bản nháp để xem trước"
        body="Mở mẫu này trong trình chỉnh sửa và điền thông tin của bạn trước — chế độ xem trước sẽ đọc bản nháp tự động lưu gần nhất."
      />
    );
  }

  // Written straight back to localStorage (the same draft the editor reads
  // from) so a theme picked here without ever returning to the editor tab
  // still sticks — this page is the only place a lot of users will ever
  // see the theme switcher, so it needs to actually persist the change,
  // not just re-render this one tab.
  function handlePaletteChange(paletteId) {
    const next = { ...data, paletteId };
    setData(next);
    saveStoredPortfolioData(next);
  }

  return (
    <>
      <Template data={sanitizePortfolioData(data)} />

      {/* Floating Action Bar */}
      {isMobile ? (
        <div className="n2001-carbon-bar fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-[2px] px-2.5 py-1.5 shadow-2xl border-t border-t-[rgba(255,255,255,0.4)] border-b-2 border-b-[#14161d]">
          {palettes && (
            <div className="flex items-center gap-1.5 border-r border-white/20 pr-2">
              <span className="text-[9px] font-bold uppercase text-[#ecab37]">MÀU</span>
              <ThemeSwitcher palettes={palettes} selectedId={data.paletteId} onChange={handlePaletteChange} />
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="n2001-btn-signal flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] cursor-pointer"
          >
            <ShareLinkIcon className="w-3 h-3 text-white" />
            <span>CHIA SẺ</span>
          </button>
        </div>
      ) : (
        <div className="n2001-carbon-bar fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-3 rounded-[2px] px-2 py-3 shadow-2xl border-t border-t-[rgba(255,255,255,0.4)] border-b-2 border-b-[#14161d]">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="n2001-btn-signal flex flex-col items-center gap-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.5px] cursor-pointer"
            title="Tạo liên kết chia sẻ công khai"
          >
            <ShareLinkIcon className="w-3.5 h-3.5 text-white" />
            <span style={{ writingMode: "vertical-rl" }}>CHIA SẺ</span>
          </button>
          {palettes && (
            <>
              <span className="h-px w-full bg-white/20" />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#ecab37]"
                style={{ writingMode: "vertical-rl" }}
              >
                MÀU
              </span>
              <ThemeSwitcher palettes={palettes} selectedId={data.paletteId} onChange={handlePaletteChange} vertical />
            </>
          )}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        templateId={template.id}
        data={data}
        user={user}
      />
    </>
  );
}

