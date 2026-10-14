"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EditForm from "./EditForm";
import ThemeSwitcher from "./ThemeSwitcher";
import { defaultPortfolioData, sanitizePortfolioData } from "@/lib/portfolioData";
import { HANDOFF_TEMPLATE_IDS as HANDOFF_TEMPLATES } from "@/lib/handoffTemplates";
import { templateComponents } from "@/components/templates";
import { loadStoredPortfolioData, saveStoredPortfolioData } from "@/lib/portfolioStorage";
import { getPalettesForTemplate } from "@/lib/palettes";
import UserProfileNav from "@/components/auth/UserProfileNav";
import { useAuth } from "@/components/auth/AuthContext";
import ShareModal from "@/components/ShareModal";
import SavedPortfoliosModal from "@/components/SavedPortfoliosModal";
import {
  SaveCartridgeIcon,
  ShareLinkIcon,
  FolderArchiveIcon,
  RetroCheckIcon,
  RetroCloseIcon,
  RetroStarIcon,
} from "@/components/icons/RetroIcons";

const MIN_PANE_PERCENT = 25;
const MAX_PANE_PERCENT = 75;

function DesktopIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

function MobileIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  );
}

function FileIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 3.5h7.5L18 8v12.5H6V3.5Z" />
      <path d="M13.5 3.5V8H18" />
      <path d="M9 12.5h6M9 16h4" />
    </svg>
  );
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 1.7a10.3 10.3 0 0 0-3.26 20.07c.52.1.7-.22.7-.49v-1.9c-2.86.62-3.46-1.2-3.46-1.2-.47-1.2-1.15-1.52-1.15-1.52-.93-.64.07-.63.07-.63 1.03.07 1.58 1.06 1.58 1.06.92 1.58 2.4 1.12 2.99.86.09-.67.36-1.13.65-1.39-2.28-.26-4.68-1.14-4.68-5.08 0-1.12.4-2.04 1.05-2.76-.1-.26-.45-1.3.1-2.72 0 0 .86-.27 2.8 1.06a9.8 9.8 0 0 1 5.1 0c1.94-1.33 2.8-1.06 2.8-1.06.55 1.42.2 2.46.1 2.72.65.72 1.05 1.64 1.05 2.76 0 3.95-2.4 4.82-4.7 5.07.37.32.7.94.7 1.9v2.82c0 .27.18.6.71.49A10.3 10.3 0 0 0 12 1.7Z" />
    </svg>
  );
}

// Marks the one button that leaves the page. The two preview buttons sit
// together and look alike, but only Desktop opens a tab, and without a cue
// for that the pair reads as a toggle between two in-page states.
function ExternalIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 16 16 8" />
      <path d="M9.5 8H16v6.5" />
    </svg>
  );
}

// Pinned above the live preview (not inside the scrollable form). A theme
// is only worth anything if it's seen, and it's easy to scroll past as just
// another card in a long form. Sitting right next to the render it
// controls, with zero scrolling or clicks needed to see it, is what makes
// it register as a feature rather than something to miss entirely.
function ThemeSwatchBar({ palettes, selectedId, onChange }) {
  return (
    <div
      className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#ffffff] border-b border-[#d5d5d4]"
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
          ≡ CHỦ ĐỀ MÀU (COLOR PALETTE)
        </span>
      </div>
      <ThemeSwitcher palettes={palettes} selectedId={selectedId} onChange={onChange} />
    </div>
  );
}

export default function PortfolioEditor({ template }) {
  const router = useRouter();
  const { user, isAuth, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuth) {
      router.replace(`/?auth=required&next=/editor/${template?.id || "newspaper"}`);
    }
  }, [authLoading, isAuth, router, template?.id]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
  const [currentPortfolioId, setCurrentPortfolioId] = useState(null);
  const [saveToast, setSaveToast] = useState("");
  const [shareTarget, setShareTarget] = useState(null);

  const [data, setData] = useState(defaultPortfolioData);
  const [restored, setRestored] = useState(false);
  const Template = templateComponents[template.id];
  const palettes = getPalettesForTemplate(template.id);

  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // The draft, readable from an effect without making that effect depend on it
  // and re-run on every keystroke. Synced in its own effect rather than during
  // render, and declared above the effect that reads it: effects for a commit
  // run in source order, so it is always current by the time it is read.
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const [deployStatus, setDeployStatus] = useState("idle"); // idle | saving | ready | error
  const [deployUrl, setDeployUrl] = useState("");
  const [deployError, setDeployError] = useState("");
  const [handoff, setHandoff] = useState(null);
  // Whether they have gone off to Vercel yet. All this page can honestly know
  // is that the link was followed: Vercel reports nothing back here, so the
  // dialog changes what it offers without claiming the deploy succeeded.
  const [vercelOpened, setVercelOpened] = useState(false);
  // What the build is actually doing: null before watching, then "pending",
  // "success", "failed", or "unknown" if it never resolved in the window.
  const [buildState, setBuildState] = useState(null);
  const [buildUrl, setBuildUrl] = useState("");
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Whether this template hands over a repo containing the customer's content
  // or still goes through the old clone-plus-database route. Mirrors the
  // server's own list in lib/templateFiles.js; the server refuses anything not
  // on its copy, so this only decides which button flow to run.
  const ownsItsData = HANDOFF_TEMPLATES.has(template.id);

  // Their own first name, off the form. A congratulation addressed to somebody
  // lands differently from one addressed to nobody, and this is the one moment
  // in the product that has earned it. Falls back to a plain congratulation
  // rather than to a placeholder, because greeting "Your Name" is worse than
  // not greeting at all.
  const firstName = (data.name || "").trim().split(/\s+/)[0] || "";

  // Desktop preview opens in a real new tab instead of an in-page frame:
  // that's the only way to show the actual full-width desktop rendering
  // with real browser chrome, rather than a scaled-down approximation.
  function openDesktopPreview() {
    window.open(`/preview/${template.id}?mode=desktop`, "_blank", "noopener,noreferrer");
  }

  // The handoff: create a repository in the customer's own GitHub account with
  // their content already committed into it.
  //
  // The data is posted straight from the browser rather than being saved here
  // first and read back after the GitHub round trip. That is what keeps this
  // app from holding a copy of somebody's employment history at all: it passes
  // through, it is not stored. The draft is already in localStorage, so
  // surviving the redirect costs nothing.
  const runHandoff = useCallback(async (portfolio) => {
    setDeployStatus("saving");
    setDeployError("");
    setVercelOpened(false);
    setBuildState(null);
    setBuildUrl("");
    try {
      const res = await fetch("/api/github/create-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: template.id, data: sanitizePortfolioData(portfolio) }),
      });
      const result = await res.json();

      // Not an error: the first attempt is expected to come back this way,
      // and the answer is to go and connect.
      if (res.status === 401 && result.needsAuth) {
        window.location.href = `/api/github/start?returnTo=${encodeURIComponent(
          `/editor/${template.id}`
        )}`;
        return;
      }

      if (!res.ok) throw new Error(result.error || "Không thể tạo repository.");
      setHandoff(result);
      setDeployStatus("ready");
    } catch (err) {
      setDeployStatus("error");
      setDeployError(err.message);
    }
  }, [template.id]);

  function handleDeploy() {
    return runHandoff(data);
  }

  async function handleSavePortfolio() {
    setSaveStatus("saving");
    setSaveToast("");
    try {
      const res = await fetch("/api/portfolios/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentPortfolioId,
          template: template.id,
          data: sanitizePortfolioData(data),
          user: user || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Không thể lưu portfolio.");
      if (json.portfolio?.id) {
        setCurrentPortfolioId(json.portfolio.id);
      }
      setSaveStatus("saved");
      setSaveToast("Đã lưu portfolio vào cơ sở dữ liệu!");
      setTimeout(() => {
        setSaveStatus("idle");
        setSaveToast("");
      }, 3000);
    } catch (err) {
      setSaveStatus("error");
      setSaveToast("Lỗi lưu: " + err.message);
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  }

  function handleOpenShare(targetItem = null) {
    if (targetItem) {
      setShareTarget(targetItem);
    } else {
      setShareTarget({
        portfolioId: currentPortfolioId,
        templateId: template.id,
        data: data,
      });
    }
    setIsShareModalOpen(true);
  }

  function handleSelectSavedPortfolio(savedItem) {
    if (savedItem.data) {
      setData(savedItem.data);
      setCurrentPortfolioId(savedItem.id);
      setSaveToast(`Đã mở: ${savedItem.title || savedItem.template}`);
      setTimeout(() => setSaveToast(""), 3000);
    }
  }

  // Restore any autosaved draft after mount.
  useEffect(() => {
    const stored = loadStoredPortfolioData();
    if (stored) {
      setData(stored);
    }
    setRestored(true);
  }, []);

  // Coming back from GitHub.
  useEffect(() => {
    if (!restored) return;

    const params = new URLSearchParams(window.location.search);
    const connected = params.get("github") === "connected";
    const failure = params.get("githubError");
    if (!connected && !failure) return;

    window.history.replaceState({}, "", window.location.pathname);

    if (failure) {
      setDeployStatus("error");
      setDeployError(
        failure === "cancelled"
          ? "Bạn đã hủy kết nối GitHub, do đó chưa có gì được tạo."
          : failure === "unconfigured"
            ? "Tính năng triển khai chưa được cấu hình trên máy chủ này. Vui lòng thử lại sau."
            : "Kết nối GitHub chưa hoàn tất. Vui lòng thử lại."
      );
      return;
    }

    runHandoff(dataRef.current);
  }, [restored, runHandoff]);

  // Vercel posts a commit status back to the repository, so whether a site
  // built is public information the browser can read directly. Polling from
  // here rather than the server runs against the visitor's own rate limit and
  // needs no token, so nothing has to outlive the handoff. The combined status
  // endpoint is one request per poll, which keeps a five minute watch inside
  // the anonymous allowance.
  useEffect(() => {
    if (!vercelOpened || !handoff?.branch) return undefined;

    let cancelled = false;
    let timer = 0;
    const startedAt = Date.now();
    const POLL_MS = 10000;
    const GIVE_UP_MS = 5 * 60 * 1000;

    async function check() {
      if (cancelled) return;

      let settled = false;
      try {
        const res = await fetch(
          `https://api.github.com/repos/${handoff.owner}/${handoff.repo}/commits/${handoff.branch}/status`,
          { headers: { Accept: "application/vnd.github+json" } }
        );
        if (res.ok) {
          const body = await res.json();
          const vercel = (body.statuses || []).find((s) => s.context === "Vercel");
          if (vercel?.state === "success") {
            setBuildState("success");
            setBuildUrl(vercel.target_url || "");
            settled = true;
          } else if (vercel?.state === "failure" || vercel?.state === "error") {
            setBuildState("failed");
            setBuildUrl(vercel.target_url || "");
            settled = true;
          }
        }
      } catch {
        // A refused or offline request says nothing about the build, so it is
        // treated the same as "not finished yet" and simply retried below.
      }

      if (cancelled || settled) return;
      // Never reports failure on a timeout. A slow build and a broken one look
      // identical from here, and calling a working site broken is the worse
      // of the two mistakes.
      if (Date.now() - startedAt > GIVE_UP_MS) {
        setBuildState("unknown");
        return;
      }
      timer = window.setTimeout(check, POLL_MS);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- entering the watching state as the watch begins, not derived state
    setBuildState("pending");
    check();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [vercelOpened, handoff]);

  // Escape closes the result dialog. A modal that can only be dismissed with a
  // pointer is a trap for anyone navigating by keyboard.
  useEffect(() => {
    if (deployStatus !== "ready" && deployStatus !== "error") return undefined;
    function onKey(event) {
      if (event.key === "Escape") setDeployStatus("idle");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deployStatus]);

  // Guard against writing before the restore effect above has applied,
  // otherwise this would fire once on mount with the still-default `data`
  // and briefly stomp over the real saved draft.
  useEffect(() => {
    if (!restored) return;
    saveStoredPortfolioData(data);
  }, [data, restored]);

  // Dragging mutates the CSS variable directly (like CursorGlow) instead of
  // going through React state, so resizing the panes never re-renders the
  // whole editor + template tree on every pixel of mouse movement.
  function handleDividerMouseDown(e) {
    e.preventDefault();
    setIsDragging(true);

    function handleMouseMove(moveEvent) {
      const rect = containerRef.current.getBoundingClientRect();
      let percent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      percent = Math.min(MAX_PANE_PERCENT, Math.max(MIN_PANE_PERCENT, percent));
      containerRef.current.style.setProperty("--left-width", `${percent}%`);
    }

    function handleMouseUp() {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setIsDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  function handleDividerDoubleClick() {
    containerRef.current.style.setProperty("--left-width", "50%");
  }

  return (
    // home-root carries the landing page's palette, so every --home-* token
    // below resolves without the editor keeping a second copy of it.
    <div className="home-root flex h-dvh flex-col bg-[#f5f1e4]">
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 bg-[#ffffff] border-b border-[#d5d5d4]">
        <div>
          <Link href="/" className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a] hover:text-[#8ed462] transition">
            ← QUAY LẠI MẪU GIAO DIỆN
          </Link>
          <h1 className="text-[14px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
            CHỈNH SỬA: <span className="font-extrabold text-[#2c2e2a]">{template.name}</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-y-2 gap-x-3">
          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.5px] text-[#80827f] sm:inline">
              XEM TRƯỚC
            </span>
            <div className="flex items-center rounded-[50px] border border-[#d5d5d4] bg-[#f5f1e4] p-0.5">
              <button
                type="button"
                onClick={openDesktopPreview}
                title="Xem toàn bộ giao diện máy tính trong tab mới"
                className="flex items-center gap-1.5 rounded-[50px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a] hover:bg-[#ffffff] transition cursor-pointer"
              >
                <DesktopIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                MÁY TÍNH
                <ExternalIcon className="h-2.5 w-2.5 shrink-0 opacity-60" aria-hidden="true" />
              </button>

              <span className="h-3.5 w-px shrink-0 bg-[#d5d5d4]" aria-hidden="true" />

              <button
                type="button"
                onClick={() => setShowMobilePreview(true)}
                title="Xem trước giao diện trên điện thoại"
                className="flex items-center gap-1.5 rounded-[50px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a] hover:bg-[#ffffff] transition cursor-pointer"
              >
                <MobileIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                DI ĐỘNG
              </button>
            </div>
          </div>

          <span className="hidden sm:inline-flex rounded-[50px] border border-[#d5d5d4] bg-[#f5f1e4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#80827f]">
            AUTO-SAVE ACTIVE
          </span>

          <button
            type="button"
            onClick={handleSavePortfolio}
            disabled={saveStatus === "saving"}
            className={`flex items-center gap-1.5 rounded-[50px] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.5px] transition cursor-pointer shadow-none ${
              saveStatus === "saved"
                ? "bg-[#8ed462] text-[#2c2e2a] border border-[#8ed462]"
                : "rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] hover:border-[#8ed462] hover:bg-[#f5f1e4] text-[#2c2e2a]"
            }`}
            title="Lưu bản thiết kế này vào cơ sở dữ liệu"
          >
            {saveStatus === "saving" ? (
              <>
                <span className="flex h-2 w-2 animate-ping rounded-full bg-[#2c2e2a]" />
                <span>ĐANG LƯU…</span>
              </>
            ) : saveStatus === "saved" ? (
              <>
                <RetroCheckIcon className="w-3.5 h-3.5 text-[#2c2e2a]" />
                <span>ĐÃ LƯU</span>
              </>
            ) : (
              <>
                <SaveCartridgeIcon className="w-3.5 h-3.5 text-[#2c2e2a]" />
                <span>LƯU DỰ ÁN</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleOpenShare()}
            className="rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] hover:border-[#8ed462] hover:bg-[#f5f1e4] flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a] transition cursor-pointer"
            title="Tạo liên kết xem trực tiếp và chia sẻ"
          >
            <ShareLinkIcon className="w-3.5 h-3.5 text-[#2c2e2a]" />
            <span>CHIA SẺ</span>
          </button>

          {user && (
            <button
              type="button"
              onClick={() => setIsSavedModalOpen(true)}
              className="flex items-center gap-1.5 rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] hover:border-[#8ed462] hover:bg-[#f5f1e4] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a] transition cursor-pointer"
              title="Xem danh sách các portfolio đã lưu của bạn"
            >
              <FolderArchiveIcon className="w-3.5 h-3.5 text-[#2c2e2a]" />
              <span>ĐÃ LƯU</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDeploy}
            disabled={deployStatus === "saving"}
            className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white text-[11px] font-bold uppercase tracking-[0.5px] py-1.5 px-3.5 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            <span>{deployStatus === "saving" ? "ĐANG LƯU…" : "XUẤT BẢN PORTFOLIO"}</span>
            <span className="font-mono">▶</span>
          </button>

          <UserProfileNav />
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex flex-1 flex-col overflow-hidden lg:flex-row"
        style={{ "--left-width": "50%" }}
      >
        <div
          className="overflow-y-auto border-b px-6 py-6 lg:w-[var(--left-width)] lg:shrink-0 lg:border-b-0 lg:border-r border-[#d5d5d4] bg-[#f5f1e4]"
        >
          <EditForm data={data} onChange={setData} templateId={template.id} />
        </div>

        <div
          onMouseDown={handleDividerMouseDown}
          onDoubleClick={handleDividerDoubleClick}
          className="hidden w-1.5 shrink-0 cursor-col-resize select-none transition-colors lg:block border-x border-[#d5d5d4]"
          style={{ background: isDragging ? "var(--color-fresh-grass)" : "var(--color-sandstone)" }}
          title="Kéo để đổi kích thước. Nhấp đúp để đặt lại."
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {palettes && (
            <ThemeSwatchBar
              palettes={palettes}
              selectedId={data.paletteId}
              onChange={(paletteId) => setData({ ...data, paletteId })}
            />
          )}
          <div
            className="min-w-0 flex-1 overflow-y-auto"
            style={{ transform: "translateZ(0)", background: "#ffffff" }}
          >
            <Template data={sanitizePortfolioData(data)} />
          </div>
        </div>
      </div>

      {showMobilePreview && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/75 p-6 backdrop-blur-[2px]"
          onClick={() => setShowMobilePreview(false)}
        >
          <div
            className="relative h-[780px] max-h-[85vh] w-[380px] max-w-full rounded-[1.5rem] border-[10px] border-[#21242e] bg-[#21242e] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-1/2 z-10 flex h-5 w-40 -translate-x-1/2 items-center justify-center rounded-b-md bg-[#21242e]">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.5px] text-[#9fbee7]">
                GAME BOY // MOBILE PREVIEW
              </span>
            </div>
            <iframe
              key={template.id}
              src={`/preview/${template.id}?mode=mobile`}
              title="Xem trước di động"
              className="h-full w-full rounded-[0.75rem] bg-white"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowMobilePreview(false)}
            className="n2001-btn-amber px-4 py-1.5 text-xs font-bold uppercase tracking-[0.5px]"
          >
            ĐÓNG XEM TRƯỚC [B]
          </button>
        </div>
      )}

      {deployStatus === "saving" && ownsItsData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c2e2a]/40 p-6 backdrop-blur-xs">
          <div
            role="status"
            aria-live="polite"
            className="w-full max-w-sm overflow-hidden rounded-[25.5px] border border-[#d5d5d4] bg-[#ffffff] text-center shadow-xl"
          >
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#f5f1e4] border-b border-[#d5d5d4]">
              <span className="rounded-[10px] border border-[#d5d5d4] bg-[#ffffff] px-2 py-0.5 font-mono text-[9px] font-bold text-[#2c2e2a]">GENFOLIO</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
                MEMORY CARD 59 // SAVING
              </span>
            </div>
            <div className="p-6">
              <span
                aria-hidden="true"
                className="mx-auto block h-9 w-9 animate-spin rounded-full border-3 border-[#d5d5d4] border-t-[#8ed462]"
              />
              <h2 className="mt-4 text-sm font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
                ĐANG KHỞI TẠO REPOSITORY GITHUB
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#80827f]">
                Đang tạo repo trong tài khoản GitHub của bạn và commit nội dung vào đó. Quá trình này mất vài giây, vui lòng giữ tab này mở.
              </p>
            </div>
          </div>
        </div>
      )}

      {(deployStatus === "ready" || deployStatus === "error") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c2e2a]/40 p-6 backdrop-blur-xs"
          onClick={() => setDeployStatus("idle")}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="deploy-dialog-title"
            className="relative w-full max-w-md overflow-hidden rounded-[25.5px] border border-[#d5d5d4] bg-[#ffffff] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#f5f1e4] border-b border-[#d5d5d4]">
              <div className="flex items-center gap-2">
                <span className="rounded-[10px] border border-[#d5d5d4] bg-[#ffffff] px-2 py-0.5 font-mono text-[9px] font-bold text-[#2c2e2a]">GENFOLIO</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
                  {deployStatus === "ready" ? "SYSTEM DEPLOYMENT // READY" : "SYSTEM ALERT // ERROR"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDeployStatus("idle")}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d5d5d4] bg-[#ffffff] text-[#2c2e2a] hover:bg-[#ff705d] hover:text-white hover:border-[#ff705d] transition cursor-pointer"
              >
                <RetroCloseIcon className="w-2.5 h-2.5" />
                <span className="sr-only">Đóng</span>
              </button>
            </div>

            <div className="p-6">
              {deployStatus === "ready" && handoff ? (
                <>
                  <div className={buildState === "success" && vercelOpened ? "text-center" : ""}>
                    {vercelOpened && buildState === "pending" ? (
                      <span
                        aria-hidden="true"
                        className="mx-auto block h-10 w-10 animate-spin rounded-full border-3 border-[#d5d5d4] border-t-[#8ed462]"
                      />
                    ) : vercelOpened && buildState === "failed" ? (
                      <span
                        aria-hidden="true"
                        className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#ff705d] text-white shadow-sm"
                      >
                        <RetroCloseIcon className="w-5 h-5 text-white" />
                      </span>
                    ) : vercelOpened && buildState === "success" ? (
                      <div className="mx-auto mb-3 flex flex-col items-center">
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#8ed462] bg-[#f5f1e4] p-2 text-center shadow-xs">
                          <div className="flex flex-col items-center">
                            <span className="text-[7px] font-bold uppercase tracking-wider text-[#2c2e2a]">OFFICIAL</span>
                            <span className="text-[8px] font-black uppercase text-[#2c2e2a]">GENFOLIO</span>
                            <span className="text-[7px] font-bold uppercase text-[#2c2e2a]">SEAL OF</span>
                            <span className="text-[7px] font-bold uppercase tracking-wider text-[#2c2e2a]">QUALITY</span>
                            <div className="flex items-center gap-0.5 text-[#8ed462] mt-0.5">
                              <RetroStarIcon className="w-2 h-2" />
                              <RetroStarIcon className="w-2 h-2" />
                              <RetroStarIcon className="w-2 h-2" />
                              <RetroStarIcon className="w-2 h-2" />
                              <RetroStarIcon className="w-2 h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8ed462] text-[#2c2e2a]">
                          <CheckIcon className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
                          KHỞI TẠO THÀNH CÔNG
                        </span>
                      </div>
                    )}

                    {buildState === "success" && vercelOpened ? (
                      <>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.5px] text-[#8ed462]">
                          SYSTEM ONLINE // VERIFIED
                        </p>
                        <h2
                          id="deploy-dialog-title"
                          className="home-display text-2xl font-black text-[#2c2e2a]"
                        >
                          {firstName ? `CHÚC MỪNG, ${firstName.toUpperCase()}!` : "CHÚC MỪNG BẠN!"}
                        </h2>
                        <p className="mx-auto mt-2 max-w-[34ch] text-xs leading-relaxed text-[#80827f]">
                          Portfolio của bạn đã chính thức xuất bản trên internet, lưu trữ an toàn trên tài khoản GitHub & Vercel của bạn.
                        </p>
                      </>
                    ) : (
                      <>
                        <h2
                          id="deploy-dialog-title"
                          className="mt-2 text-sm font-bold uppercase tracking-[0.5px] text-[#2c2e2a]"
                        >
                          {!vercelOpened
                            ? "REPOSITORY GITHUB ĐÃ SẴN SÀNG"
                            : buildState === "failed"
                              ? "VERCEL KHÔNG THỂ BUILD DỰ ÁN"
                              : buildState === "pending"
                                ? "ĐANG BUILD TRANG WEB TRÊN VERCEL"
                                : "ĐANG HOÀN TẤT TRÊN VERCEL"}
                        </h2>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#80827f]">
                          {!vercelOpened
                            ? "Toàn bộ thông tin bạn nhập đã được commit vào repository trên tài khoản GitHub của bạn. Bạn hoàn toàn sở hữu và kiểm soát mã nguồn này."
                            : buildState === "failed"
                              ? "Quá trình build xảy ra lỗi. Bạn có thể xem log để biết nguyên nhân, repository của bạn vẫn an toàn nguyên vẹn."
                              : buildState === "pending"
                                ? "Sau khi bạn hoàn tất bước import trên Vercel, quá trình build sẽ tự động chạy và trạng thái này sẽ cập nhật ngay sau đó."
                                : "Vercel chưa phản hồi kết quả sau vài phút. Có thể bạn chưa hoàn tất các bước ở tab Vercel, vui lòng kiểm tra lại."}
                        </p>
                      </>
                    )}
                  </div>

                  {buildUrl && buildState === "success" ? (
                    <a
                      href={buildUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white mt-4 flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-[0.5px]"
                    >
                      MỞ TRANG WEB TRỰC TIẾP ▶
                      <ExternalIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : null}

                  {buildUrl && buildState === "failed" ? (
                    <a
                      href={buildUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white mt-4 flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-[0.5px]"
                    >
                      XEM NHẬT KÝ BUILD LỖI ▶
                      <ExternalIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : null}

                  <a
                    href={handoff.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[20px] border border-[#d5d5d4] bg-[#ffffff] hover:bg-[#f5f1e4] mt-3 flex items-center gap-2.5 p-3 text-left transition-colors"
                  >
                    <GitHubIcon
                      className="h-4 w-4 shrink-0 text-[#2c2e2a]"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate font-mono text-xs font-bold text-[#2c2e2a]">
                      {handoff.owner}/{handoff.repo}
                    </span>
                    <ExternalIcon
                      className="h-3 w-3 shrink-0 text-[#80827f]"
                      aria-hidden="true"
                    />
                  </a>

                  <a
                    href={handoff.deployUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setVercelOpened(true)}
                    className={
                      !vercelOpened
                        ? "rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white mt-3 flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-[0.5px]"
                        : buildState === "success"
                          ? "home-quiet-link mt-3 flex items-center justify-center gap-1.5 text-xs font-bold"
                          : "rounded-[50px] border border-[#d5d5d4] bg-[#f5f1e4] hover:bg-[#e0dbce] text-[#2c2e2a] mt-3 flex w-full items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-[0.5px]"
                    }
                  >
                    {!vercelOpened ? "TRIỂN KHAI LÊN VERCEL ▶" : "MỞ LẠI VERCEL ▶"}
                    <ExternalIcon className={vercelOpened ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden="true" />
                  </a>

                  <div className="mt-4 rounded-[20px] border border-[#d5d5d4] bg-[#f5f1e4] p-3 text-left">
                    <div className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffffff] border border-[#d5d5d4] text-[#2c2e2a]"
                      >
                        <FileIcon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
                          SỞ HỮU & CẬP NHẬT MÃ NGUỒN
                        </h3>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#80827f]">
                          Toàn bộ dữ liệu nằm trong file{" "}
                          <span className="font-mono font-bold text-[#2c2e2a]">
                            data/portfolio.js
                          </span>
                          . Sửa file trên GitHub rồi commit, website sẽ tự động cập nhật.
                        </p>
                        <a
                          href={handoff.editUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] hover:bg-[#e0dbce] text-[#2c2e2a] mt-2 inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px]"
                        >
                          MỞ FILE DỮ LIỆU ▶
                        </a>
                      </div>
                    </div>
                  </div>

                  {vercelOpened && (
                    <button
                      type="button"
                      onClick={() => {
                        setDeployStatus("idle");
                        router.push("/");
                      }}
                      className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white mt-4 w-full py-2.5 text-xs font-bold uppercase tracking-[0.5px]"
                    >
                      HOÀN TẤT ▶
                    </button>
                  )}
                </>
              ) : deployStatus === "ready" ? (
                <div className="text-center">
                  <h2
                    id="deploy-dialog-title"
                    className="text-sm font-bold uppercase tracking-[0.5px] text-[#2c2e2a]"
                  >
                    ĐÃ LƯU BẢN NHÁP
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-[#80827f]">
                    Tiếp theo, tiếp tục đến Vercel để hoàn tất triển khai: hệ thống sẽ tạo repo thật và xuất bản website trực tiếp dưới tài khoản GitHub và Vercel của bạn.
                  </p>
                  <a
                    href={deployUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white mt-4 block w-full py-2.5 text-xs font-bold uppercase tracking-[0.5px]"
                  >
                    TIẾP TỤC ĐẾN VERCEL ▶
                  </a>
                </div>
              ) : (
                <div className="text-center">
                  <h2
                    id="deploy-dialog-title"
                    className="text-sm font-bold uppercase tracking-[0.5px] text-[#ff705d]"
                  >
                    KHÔNG THỂ BẮT ĐẦU TRIỂN KHAI
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-[#80827f]">
                    {deployError}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDeployStatus("idle")}
                    className="rounded-[50px] border border-[#d5d5d4] bg-[#f5f1e4] hover:bg-[#e0dbce] text-[#2c2e2a] mt-4 w-full py-2 text-xs font-bold uppercase tracking-[0.5px]"
                  >
                    ĐÓNG
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 left-6 z-50 rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] px-4 py-2 text-xs font-bold text-[#2c2e2a] shadow-lg animate-bounce">
          {saveToast}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        templateId={shareTarget?.templateId || template.id}
        data={shareTarget?.data || data}
        user={user}
        portfolioId={shareTarget?.portfolioId || currentPortfolioId}
      />

      {/* Saved Portfolios Modal */}
      <SavedPortfoliosModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        user={user}
        onSelectPortfolio={handleSelectSavedPortfolio}
        onSharePortfolio={(item) => {
          handleOpenShare({
            portfolioId: item.id,
            templateId: item.template,
            data: item.data,
          });
        }}
      />
    </div>
  );
}
