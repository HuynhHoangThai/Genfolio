"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";

export default function UserProfileNav() {
  const { user, isAuth, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuth || !user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-[var(--home-rule-soft,rgba(0,0,0,0.1))] bg-white/80 py-1 pl-1 pr-3 text-[13px] font-medium text-[var(--home-strong,#17140f)] transition hover:bg-white shadow-sm focus:outline-none"
        title="Tài khoản của bạn"
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="h-6 w-6 rounded-full object-cover ring-1 ring-black/10"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17140f] text-[10px] font-bold text-white">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        <span className="max-w-[100px] sm:max-w-[130px] truncate">{user.name}</span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 text-[#7d6d60] transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-black/10 bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 text-[#17140f]">
          <div className="border-b border-black/5 pb-2.5">
            <p className="text-[13px] font-semibold text-[#17140f] truncate">{user.name}</p>
            <p className="text-[11.5px] text-[#7d6d60] truncate">{user.email}</p>
            <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Đã xác thực Google
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[12.5px] font-medium text-red-600 transition hover:bg-red-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
