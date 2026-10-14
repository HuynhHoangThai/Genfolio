import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--warm-font-display",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--warm-font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Hồ sơ năng lực | Genfolio",
  description: "Trang hồ sơ năng lực cá nhân trực tuyến được tạo bởi Genfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${fraunces.variable} ${instrumentSans.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
