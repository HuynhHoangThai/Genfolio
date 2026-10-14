import { Press_Start_2P, Russo_One, Chakra_Petch } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({
  variable: "--lu-pixel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const display = Russo_One({
  variable: "--lu-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const body = Chakra_Petch({
  variable: "--lu-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${pixel.variable} ${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0d091a] text-[#f3f4f6] font-body">{children}</body>
    </html>
  );
}
