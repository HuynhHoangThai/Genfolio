"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import SavedPortfoliosModal from "@/components/SavedPortfoliosModal";
import ShareModal from "@/components/ShareModal";
import { saveStoredPortfolioData } from "@/lib/portfolioStorage";

export default function UserProfileNav() {
  const router = useRouter();
  const { user, isAuth, logout, openLoginModal } = useAuth();
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!isAuth || !user) {
    return (
      <button
        onClick={() => openLoginModal()}
        type="button"
        title="Đăng nhập bằng tài khoản Google"
        className="inline-flex items-center gap-1.5 rounded-[2px] border-t border-l border-white/70 border-r border-[#b87c14] border-b-2 border-b-[#8f5d04] bg-[#ecab37] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e] shadow-xs transition hover:brightness-105 active:translate-y-px cursor-pointer"
      >
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[2px] bg-[#21242e] text-[8px] font-black text-white">
          G
        </span>
        ĐĂNG NHẬP
      </button>
    );
  }

  const handleSelectPortfolio = (item) => {
    if (item.data) {
      saveStoredPortfolioData(item.data);
      router.push(`/editor/${item.template || "newspaper"}`);
    }
  };

  const handleSharePortfolio = (item) => {
    setShareTarget(item);
    setIsShareModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Saved Portfolios Quick Button */}
        <button
          type="button"
          onClick={() => setIsSavedModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-[2px] border-t border-l border-white/40 border-r border-[#3d4f97] border-b-2 border-b-[#3d4f97] bg-[#7a8aba] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#21242e] shadow-xs hover:bg-[#9fbee7] transition cursor-pointer"
          title="Xem các portfolio đã lưu của bạn"
        >
          <span>📂 DỰ ÁN</span>
        </button>

        {/* Player 1 Console Identity Badge */}
        <div
          className="flex items-center gap-2 rounded-[2px] border-t border-l border-white/20 border-r border-[#14161d] border-b border-[#14161d] bg-[#21242e] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.5px] text-white shadow-xs"
          title={user.email}
        >
          <span className="text-[9px] font-black tracking-widest text-[#ecab37]">
            P1:
          </span>
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || "User"}
              className="h-4 w-4 rounded-[1px] object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-4 w-4 items-center justify-center rounded-[1px] bg-[#3d4f97] text-[9px] font-black text-white">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
          <span className="max-w-[100px] truncate sm:max-w-[130px] font-normal lowercase text-[#9fbee7]">
            {user.name}
          </span>
        </div>

        {/* Nintendo Red Sign Out Button */}
        <button
          onClick={logout}
          type="button"
          title="Đăng xuất khỏi tài khoản Google"
          className="inline-flex items-center rounded-[2px] border-t border-l border-white/60 border-r border-[#a7282b] border-b-2 border-b-[#7a181b] bg-[#e60012] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-white shadow-xs transition hover:brightness-110 active:translate-y-px cursor-pointer"
        >
          ĐĂNG XUẤT
        </button>
      </div>

      {/* Saved Portfolios Modal */}
      <SavedPortfoliosModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        user={user}
        onSelectPortfolio={handleSelectPortfolio}
        onSharePortfolio={handleSharePortfolio}
      />

      {/* Share Modal if triggered from here */}
      {shareTarget && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setShareTarget(null);
          }}
          templateId={shareTarget.template}
          data={shareTarget.data}
          user={user}
          portfolioId={shareTarget.id}
        />
      )}
    </>
  );
}
