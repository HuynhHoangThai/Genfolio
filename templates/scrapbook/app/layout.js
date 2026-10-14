import { Courier_Prime } from "next/font/google";
import "./globals.css";

const courier = Courier_Prime({
  weight: ["400", "700"],
  variable: "--font-typewriter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Hồ sơ năng lực | Genfolio",
  description: "Trang hồ sơ năng lực cá nhân trực tuyến được tạo bởi Genfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${courier.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#e8dec8] text-[#2e2418] font-mono">{children}</body>
    </html>
  );
}
