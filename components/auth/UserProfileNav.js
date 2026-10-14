"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import SavedPortfoliosModal from "@/components/SavedPortfoliosModal";
import ShareModal from "@/components/ShareModal";
import { saveStoredPortfolioData } from "@/lib/portfolioStorage";
import { FolderArchiveIcon } from "@/components/icons/RetroIcons";

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
        className="inline-flex items-center gap-1.5 rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.2px] text-[#2c2e2a] transition hover:bg-[#e0dbce] active:translate-y-px cursor-pointer"
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2c2e2a] text-[9px] font-bold text-white">
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
          className="inline-flex items-center gap-1.5 rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] px-3 py-1 text-[11px] font-medium tracking-[0.2px] text-[#2c2e2a] hover:bg-[#e0dbce] transition cursor-pointer"
          title="Xem các portfolio đã lưu của bạn"
        >
          <FolderArchiveIcon className="w-3.5 h-3.5 text-[#2c2e2a]" />
          <span>DỰ ÁN</span>
        </button>

        {/* User Identity Badge */}
        <div
          className="flex items-center gap-2 rounded-[50px] border border-[#d5d5d4] bg-[#f5f1e4] px-3 py-1 text-[11px] font-medium text-[#2c2e2a]"
          title={user.email}
        >
          <span className="text-[10px] font-bold text-[#8ed462]">
            P1:
          </span>
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || "User"}
              className="h-4 w-4 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#8ed462] text-[9px] font-bold text-[#2c2e2a]">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
          <span className="max-w-[100px] truncate sm:max-w-[130px] font-normal lowercase text-[#2c2e2a]">
            {user.name}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          type="button"
          title="Đăng xuất khỏi tài khoản Google"
          className="inline-flex items-center rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] px-3 py-1 text-[11px] font-medium tracking-[0.2px] text-[#2c2e2a] transition hover:bg-[#ff705d] hover:text-white hover:border-[#ff705d] active:translate-y-px cursor-pointer"
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
