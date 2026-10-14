import { Archivo, Azeret_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo({
  variable: "--dash-display",
  subsets: ["latin"],
  display: "swap",
});

const mono = Azeret_Mono({
  variable: "--dash-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Hồ sơ năng lực | Genfolio",
  description: "Trang hồ sơ năng lực cá nhân trực tuyến được tạo bởi Genfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${display.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0a0c10] text-[#d8dee9] font-sans">{children}</body>
    </html>
  );
}
