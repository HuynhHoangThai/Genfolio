"use client";

import React from "react";
import { useAuth } from "./AuthContext";

export default function UserProfileNav() {
  const { user, isAuth, logout } = useAuth();

  if (!isAuth || !user) return null;

  return (
    <div className="flex items-center gap-2">
      {/* User identity pill */}
      <div
        className="flex items-center gap-2 rounded-full border border-[var(--home-rule-soft,rgba(0,0,0,0.12))] bg-white/90 py-1 pl-1 pr-3 text-[12.5px] font-medium text-[var(--home-strong,#17140f)] shadow-xs"
        title={user.email}
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name || "User"}
            className="h-5 w-5 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#17140f] text-[10px] font-bold text-white">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        )}
        <span className="max-w-[110px] truncate sm:max-w-[140px]">{user.name}</span>
      </div>

      {/* Prominent, direct Sign Out button */}
      <button
        onClick={logout}
        type="button"
        title="Đăng xuất khỏi tài khoản Google"
        className="inline-flex items-center rounded-full border border-black/15 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#17140f] shadow-xs transition hover:border-red-600 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer"
      >
        Đăng xuất
      </button>
    </div>
  );
}
