import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  variable: "--np-display",
  subsets: ["latin"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--np-serif",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--np-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Hồ sơ năng lực | Genfolio",
  description: "Trang hồ sơ năng lực cá nhân trực tuyến được tạo bởi Genfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${display.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-[#111111]">{children}</body>
    </html>
  );
}
