"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAuth } from "./AuthContext";
import { RetroCloseIcon, RetroLightningIcon } from "@/components/icons/RetroIcons";

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
      {/* Global Floating Player 1 Console Identity Badge */}
      {isAuth && user && (
        <aside
          aria-label="Tài khoản người dùng"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] px-3 py-1.5 shadow-sm sm:bottom-6 sm:right-6"
        >
          <span className="font-mono text-[9px] font-bold tracking-widest text-[#8ed462]">
            P1:
          </span>

          {user.picture ? (
            <img
              src={user.picture}
              alt=""
              className="h-5 w-5 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f5f1e4] border border-[#d5d5d4] text-[10px] font-bold text-[#2c2e2a]">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}

          <span className="max-w-[120px] truncate font-medium text-[12px] text-[#2c2e2a] sm:max-w-[150px]">
            {user.name}
          </span>

          <button
            onClick={logout}
            type="button"
            className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-white transition cursor-pointer"
          >
            ĐĂNG XUẤT
          </button>
        </aside>
      )}

      {/* Login Modal Overlay (Nintendo 2001 Memory Card Save Authentication) */}
      {shouldShowModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2c2e2a]/40 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-[380px] rounded-[25.5px] border border-[#d5d5d4] bg-[#ffffff] p-6 text-center shadow-xl">
            {/* Top section label bar */}
            <div className="n2001-section-bar -mx-6 -mt-6 mb-5 rounded-t-[25.5px] rounded-b-none border-b border-[#d5d5d4] bg-[#f5f1e4] text-[#2c2e2a]">
              <span className="flex items-center gap-1.5">
                <span className="text-[#8ed462]">≡</span>
                <span>XÁC THỰC TÀI KHOẢN (PLAYER LOGIN)</span>
              </span>
              <span className="font-mono text-[#80827f]">SLOT-1</span>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={handleDismissModal}
              className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#d5d5d4] bg-[#ffffff] text-[#2c2e2a] hover:bg-[#ff705d] hover:text-white hover:border-[#ff705d] transition cursor-pointer"
              title="Đóng"
              aria-label="Đóng"
            >
              <RetroCloseIcon className="w-2.5 h-2.5" />
            </button>

            {/* Brand mark */}
            <div className="mx-auto my-2 inline-flex">
              <span className="rounded-[10px] border border-[#d5d5d4] bg-[#f5f1e4] px-3 py-1 font-mono text-[12px] font-bold tracking-tight text-[#2c2e2a]">
                GENFOLIO
              </span>
            </div>

            {/* Heading & Subtitle */}
            <h1 className="mt-3 text-[18px] font-bold text-[#2c2e2a]">
              Đăng nhập để tạo Portfolio
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#80827f]">
              Vui lòng xác thực tài khoản Google để bắt đầu lưu dữ liệu và xuất bản mã nguồn vào GitHub của bạn.
            </p>

            {/* Google Sign-In Button Container */}
            <div className="mt-5 flex min-h-[44px] items-center justify-center rounded-[50px] border border-[#d5d5d4] bg-white p-2" ref={buttonContainerRef}>
              {!scriptLoaded && (
                <span className="text-xs font-mono text-[#80827f]">ĐANG TẢI GOOGLE IDENTITY…</span>
              )}
            </div>

            {initError && (
              <p className="mt-2.5 text-xs font-bold text-[#ff705d]">{initError}</p>
            )}

            {/* Developer Fallback: Chỉ hiển thị trong môi trường development hoặc khi có cờ bật rõ ràng */}
            {(process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === "true") && (
              <div className="mt-5 border-t border-[#d5d5d4] pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setUrlAuthRequired(false);
                    loginDevFallback("developer@genfolio.dev", "Lập trình viên Genfolio");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-[50px] border border-[#d5d5d4] bg-[#f5f1e4] hover:bg-[#e0dbce] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a] transition cursor-pointer"
                >
                  <RetroLightningIcon className="w-3 h-3 text-[#2c2e2a]" />
                  <span>ĐĂNG NHẬP NHANH (CHẾ ĐỘ DEV)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
