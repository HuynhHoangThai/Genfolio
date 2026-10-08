"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAuth } from "./AuthContext";

export default function GoogleAuthGate({ children }) {
  const { user, loading, isAuth, googleClientId, loginWithGoogleCredential, loginDevFallback, logout } = useAuth();
  const buttonContainerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [initError, setInitError] = useState("");
  const [showDevLogin, setShowDevLogin] = useState(false);

  // Load Google Identity Services script
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    const scriptId = "google-gsi-client";
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error("Không thể tải Google Identity Services SDK");
      setInitError("Không thể tải thư viện đăng nhập của Google. Vui lòng kiểm tra kết nối mạng.");
    };
    document.body.appendChild(script);
  }, []);

  // Initialize Google Sign-In and render button
  useEffect(() => {
    if (!scriptLoaded || isAuth || typeof window === "undefined" || !window.google?.accounts?.id) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (response?.credential) {
            const success = loginWithGoogleCredential(response.credential);
            if (!success) {
              setInitError("Không thể xác thực thông tin tài khoản Google. Vui lòng thử lại.");
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonContainerRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "pill",
          text: "signin_with",
          logo_alignment: "left",
          width: 290,
          locale: "vi",
        });
      }

      // Prompt One Tap if supported
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log("Google One Tap không hiển thị:", notification.getNotDisplayedReason());
          }
        });
      } catch (promptErr) {
        // One Tap may be ignored if origin isn't configured
      }
    } catch (err) {
      console.warn("Khởi tạo Google Sign-In gặp lỗi:", err);
      setInitError("Lưu ý: Domain hiện tại có thể cần được thêm vào danh sách Authorized Origins trong Google Cloud Console.");
    }
  }, [scriptLoaded, isAuth, googleClientId, loginWithGoogleCredential]);

  // Loading state while checking localStorage
  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#faf8f5] text-[#17140f]">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17140f] text-white shadow-xl">
          <Image
            src="/portfolio-generator-logo.png"
            alt="Genfolio"
            width={38}
            height={38}
            className="rounded-lg object-cover"
            priority
          />
        </div>
        <p className="mt-4 font-mono text-xs tracking-widest text-[#7d6d60] uppercase animate-pulse">
          Đang kiểm tra xác thực...
        </p>
      </div>
    );
  }

  // If user is authenticated, render the children and a floating profile indicator
  if (isAuth && user) {
    return (
      <>
        {children}
        {/* Floating User Status Pill */}
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full border border-black/10 bg-white/90 px-3.5 py-1.5 shadow-lg backdrop-blur-md transition-all hover:shadow-xl sm:bottom-6 sm:right-6">
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
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold text-[#17140f] max-w-[120px] truncate sm:max-w-[160px]">
              {user.name}
            </span>
            <span className="text-[10px] text-[#7d6d60] max-w-[120px] truncate sm:max-w-[160px]">
              {user.email}
            </span>
          </div>
          <button
            onClick={logout}
            title="Đăng xuất khỏi tài khoản"
            className="ml-1 rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-[11px] font-medium text-[#17140f] transition hover:bg-black/10 hover:text-red-600 focus:outline-none"
          >
            Đăng xuất
          </button>
        </div>
      </>
    );
  }

  // Unauthenticated: Full-screen Glassmorphic Login Gate
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#17140f]/75 p-4 sm:p-6 backdrop-blur-md">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(201, 161, 90, 0.25) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(79, 70, 229, 0.2) 0%, transparent 60%)",
        }}
      />

      {/* Main Login Card */}
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-[26px] border border-black/10 bg-[#faf8f5] p-7 shadow-2xl sm:p-9 text-[#17140f]">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#17140f] shadow-md">
              <Image
                src="/portfolio-generator-logo.png"
                alt="Genfolio"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h2 className="text-[17px] font-bold tracking-tight text-[#17140f]">Genfolio</h2>
              <p className="text-[11px] text-[#7d6d60]">Trình tạo Portfolio Lập trình viên</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Bảo mật
          </span>
        </div>

        {/* Title and Intro */}
        <div className="mt-6">
          <h1 className="text-[23px] font-semibold tracking-tight text-[#17140f] sm:text-[25px] leading-snug">
            Đăng nhập để sử dụng website
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[#5c4636]">
            Vui lòng đăng nhập bằng tài khoản Google để trải nghiệm trọn vẹn các tính năng tạo, chỉnh sửa và xuất bản website portfolio.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mt-5 space-y-2.5 rounded-2xl border border-black/5 bg-black/[0.02] p-4 text-[12.5px] text-[#5c4636]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
              ✓
            </span>
            <span>Tải lên và trích xuất thông tin CV tự động bằng AI</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
              ✓
            </span>
            <span>Tự do tùy biến 12 bộ giao diện độc bản chuyên nghiệp</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
              ✓
            </span>
            <span>Tự động tạo GitHub repository & kết nối hosting Vercel</span>
          </div>
        </div>

        {/* Google Sign-In Button Container */}
        <div className="mt-7 flex flex-col items-center">
          <div
            ref={buttonContainerRef}
            className="flex min-h-[44px] w-full items-center justify-center"
            id="googleSignInButton"
          >
            {!scriptLoaded && (
              <div className="flex items-center gap-2 text-xs text-[#7d6d60]">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#17140f] border-t-transparent" />
                Đang chuẩn bị nút đăng nhập Google...
              </div>
            )}
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-[#7d6d60]">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-emerald-600" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            Xác thực an toàn thông qua Google Identity Services
          </p>
        </div>

        {/* Warning or Error notice if origin restriction happens */}
        {initError && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
            {initError}
          </div>
        )}

        {/* Developer Fallback Mode */}
        <div className="mt-6 border-t border-black/5 pt-4 text-center">
          {!showDevLogin ? (
            <button
              type="button"
              onClick={() => setShowDevLogin(true)}
              className="text-[11.5px] text-[#7d6d60] underline underline-offset-4 hover:text-[#17140f] transition"
            >
              Bạn đang phát triển hoặc gặp lỗi origin domain? Bấm vào đây
            </button>
          ) : (
            <div className="rounded-xl border border-dashed border-black/15 bg-white/60 p-3 text-left">
              <p className="text-[11.5px] font-medium text-[#17140f]">
                Chế độ thử nghiệm phát triển (Dev Fallback):
              </p>
              <p className="mt-1 text-[11px] text-[#7d6d60]">
                Nếu domain hiện tại chưa được cấp quyền trong Google Cloud Console, bạn có thể đăng nhập thử nghiệm để tiếp tục kiểm tra tính năng website:
              </p>
              <button
                type="button"
                onClick={() => loginDevFallback("developer@genfolio.dev", "Lập trình viên Genfolio")}
                className="mt-2.5 w-full rounded-full bg-[#17140f] py-2 text-[12px] font-medium text-white transition hover:bg-black"
              >
                Đăng nhập chế độ thử nghiệm →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
