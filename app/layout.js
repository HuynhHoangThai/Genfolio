import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthContext";
import GoogleAuthGate from "@/components/auth/GoogleAuthGate";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans-main",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

// Relative OG/Twitter image paths need an absolute base to resolve against.
// VERCEL_PROJECT_PRODUCTION_URL is injected by Vercel on every deployment,
// so this stays correct in production without asking anyone to configure a
// site-url env var locally.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Genfolio — Trình tạo Portfolio Lập trình viên",
    template: "%s | Genfolio",
  },
  description:
    "Tải CV lên, chọn từ 12 mẫu giao diện độc bản và xuất bản website portfolio cá nhân lên GitHub và Vercel của chính bạn. Bạn sở hữu toàn bộ mã nguồn.",
  openGraph: {
    title: "Genfolio — Trình tạo Portfolio Lập trình viên",
    description:
      "Tải CV lên, chọn từ 12 mẫu giao diện độc bản và xuất bản website portfolio cá nhân lên GitHub và Vercel của chính bạn. Bạn sở hữu toàn bộ mã nguồn.",
    url: "/",
    siteName: "Genfolio",
    images: [{ url: "/portfolio-generator-logo.png", width: 1024, height: 1024 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genfolio — Trình tạo Portfolio Lập trình viên",
    description: "12 mẫu portfolio lập trình viên độc bản. Triển khai trực tiếp lên GitHub và Vercel cá nhân của bạn.",
    images: ["/portfolio-generator-logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <GoogleAuthGate>{children}</GoogleAuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
