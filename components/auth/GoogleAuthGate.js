"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAuth } from "./AuthContext";

export default function GoogleAuthGate({ children }) {
  const {
    user,
    loading,
    isAuth,
    googleClientId,
    isLoginModalOpen,
    closeLoginModal,
    loginWithGoogleCredential,
    loginDevFallback,
    logout,
  } = useAuth();

  const buttonContainerRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [initError, setInitError] = useState("");
  const [urlAuthRequired, setUrlAuthRequired] = useState(false);

  // Check if URL contains ?auth=required from proxy redirect
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("auth") === "required") {
      setUrlAuthRequired(true);
    }
  }, []);

  const shouldShowModal = !isAuth && (isLoginModalOpen || urlAuthRequired);

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
      setInitError("Không thể tải Google Sign-In. Vui lòng kiểm tra kết nối mạng.");
    };
    document.body.appendChild(script);
  }, []);

  // Initialize Google Sign-In and render button when modal is visible
  useEffect(() => {
    if (!shouldShowModal || !scriptLoaded || isAuth || typeof window === "undefined" || !window.google?.accounts?.id) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (response?.credential) {
            const ok = loginWithGoogleCredential(response.credential);
            if (!ok) {
              setInitError("Xác thực Google không thành công. Vui lòng thử lại.");
            } else {
              setUrlAuthRequired(false);
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
          width: 280,
          locale: "vi",
        });
      }

      try {
        window.google.accounts.id.prompt();
      } catch (e) {
        // Prompt ignored if origin not allowed
      }
    } catch (err) {
      console.warn("Google Sign-In init error:", err);
    }
  }, [shouldShowModal, scriptLoaded, isAuth, googleClientId, loginWithGoogleCredential]);

  const handleDismissModal = () => {
    closeLoginModal();
    setUrlAuthRequired(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("auth")) {
        url.searchParams.delete("auth");
        window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#faf8f5]">
        <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#17140f]">
          <Image
            src="/portfolio-generator-logo.png"
            alt="Genfolio"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {children}

      {/* Global Floating Account & Sign Out Pill (Visible when logged in) */}
      {isAuth && user && (
        <aside
          aria-label="Tài khoản người dùng"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full border border-black/10 bg-white/95 py-1.5 pl-2 pr-2.5 shadow-md backdrop-blur-xs sm:bottom-6 sm:right-6"
        >
          {user.picture ? (
            <img
              src={user.picture}
              alt=""
              className="h-6 w-6 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17140f] text-[10px] font-bold text-white">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}

          <span className="max-w-[130px] truncate text-[12px] font-medium text-[#17140f] sm:max-w-[170px]">
            {user.name}
          </span>

          <button
            onClick={logout}
            type="button"
            className="rounded-full bg-[#17140f] px-3 py-1 text-[11.5px] font-semibold text-white transition hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer"
          >
            Đăng xuất
          </button>
        </aside>
      )}

      {/* Login Modal Overlay (Triggered when creating template unauthenticated or via auth=required) */}
      {shouldShowModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17140f]/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-[360px] rounded-2xl border border-black/10 bg-[#faf8f5] p-7 text-center shadow-xl">
            {/* Close button */}
            <button
              type="button"
              onClick={handleDismissModal}
              className="absolute top-4 right-4 rounded-full p-1 text-[#7d6d60] transition hover:bg-black/5 hover:text-[#17140f] cursor-pointer"
              title="Đóng"
              aria-label="Đóng"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Brand mark */}
            <div className="mx-auto relative h-11 w-11 overflow-hidden rounded-xl bg-[#17140f]">
              <Image
                src="/portfolio-generator-logo.png"
                alt="Genfolio"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Heading & Subtitle — direct and purposeful */}
            <h1 className="mt-4 text-[19px] font-semibold tracking-tight text-[#17140f]">
              Đăng nhập để tạo Portfolio
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#7d6d60]">
              Vui lòng đăng nhập bằng tài khoản Google để bắt đầu tạo và xuất bản website của bạn.
            </p>

            {/* Google Sign-In Button Container */}
            <div className="mt-6 flex min-h-[44px] items-center justify-center" ref={buttonContainerRef}>
              {!scriptLoaded && (
                <span className="text-xs text-[#7d6d60]">Đang tải đăng nhập Google…</span>
              )}
            </div>

            {initError && (
              <p className="mt-3 text-xs text-red-600">{initError}</p>
            )}

            {/* Developer Fallback for localhost / origin mismatch */}
            <div className="mt-5 border-t border-black/8 pt-3.5">
              <button
                type="button"
                onClick={() => {
                  setUrlAuthRequired(false);
                  loginDevFallback("developer@genfolio.dev", "Lập trình viên Genfolio");
                }}
                className="text-[11.5px] text-[#7d6d60] transition hover:text-[#17140f] cursor-pointer underline underline-offset-3"
              >
                Đăng nhập nhanh (Chế độ phát triển)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
