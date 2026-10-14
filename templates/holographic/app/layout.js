import { Outfit, Manrope } from "next/font/google";
import "./globals.css";

const display = Outfit({
  variable: "--ir-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Manrope({
  variable: "--ir-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Hồ sơ năng lực | Genfolio",
  description: "Trang hồ sơ năng lực cá nhân trực tuyến được tạo bởi Genfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full font-body bg-background text-foreground">{children}</body>
    </html>
  );
}
