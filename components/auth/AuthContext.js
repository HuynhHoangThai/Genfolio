"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY_USER = "genfolio_auth_user";
const STORAGE_KEY_TOKEN = "genfolio_auth_token";
const COOKIE_KEY = "genfolio_auth";

// Google Client ID from environment or fallback to user-provided ID
export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  process.env.VITE_GOOGLE_CLIENT_ID ||
  "392966697563-3p2v2oejp2lcc02sc683l8g9vate7as8.apps.googleusercontent.com";

/**
 * Decodes Google JWT credential token without external libraries
 */
function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Lỗi giải mã Google JWT token:", err);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage / cookie on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && (parsed.email || parsed.sub)) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn("Không thể đọc phiên đăng nhập từ localStorage:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogleCredential = useCallback((credential) => {
    if (!credential) return false;
    const payload = decodeJwt(credential);
    if (!payload || !payload.email) {
      console.error("Token Google không hợp lệ hoặc thiếu email");
      return false;
    }

    const userData = {
      id: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      givenName: payload.given_name || "",
      familyName: payload.family_name || "",
      picture: payload.picture || "",
      emailVerified: !!payload.email_verified,
      provider: "google",
      loggedInAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEY_TOKEN, credential);
      // Set simple session cookie for multi-tab / server awareness
      if (typeof document !== "undefined") {
        document.cookie = `${COOKIE_KEY}=${encodeURIComponent(userData.email)}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch (e) {
      console.warn("Lỗi lưu trữ phiên đăng nhập:", e);
    }

    setUser(userData);
    return true;
  }, []);

  const loginDevFallback = useCallback((customEmail = "developer@genfolio.dev", customName = "Developer") => {
    const userData = {
      id: "dev-" + Date.now(),
      email: customEmail,
      name: customName,
      givenName: "Dev",
      familyName: "User",
      picture: "https://api.dicebear.com/7.x/bottts/svg?seed=GenfolioDev",
      emailVerified: true,
      provider: "google-dev-mode",
      loggedInAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEY_TOKEN, "dev-mock-token");
      if (typeof document !== "undefined") {
        document.cookie = `${COOKIE_KEY}=${encodeURIComponent(userData.email)}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch (e) {
      console.warn("Lỗi lưu trữ phiên đăng nhập:", e);
    }

    setUser(userData);
    return true;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      if (typeof document !== "undefined") {
        document.cookie = `${COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
      }
      // If Google Identity client is active, revoke session prompt
      if (typeof window !== "undefined" && window.google?.accounts?.id?.disableAutoSelect) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (e) {
      console.warn("Lỗi khi đăng xuất:", e);
    }
    setUser(null);
  }, []);

  const value = {
    user,
    isAuth: !!user,
    loading,
    googleClientId: GOOGLE_CLIENT_ID,
    loginWithGoogleCredential,
    loginDevFallback,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
}
