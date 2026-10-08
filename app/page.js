import Image from "next/image";
import Link from "next/link";
import { templates } from "@/lib/portfolioData";
import TemplateWall from "@/components/home/TemplateWall";
import HeroDeck from "@/components/home/HeroDeck";
import FAQSection from "@/components/home/FAQSection";
import OrbitMount from "@/components/motion/OrbitMount";
import CreativeThreadMount from "@/components/motion/CreativeThreadMount";
import GearsMount from "@/components/motion/GearsMount";
import ThoughtsMount from "@/components/motion/ThoughtsMount";
import CelebrationMount from "@/components/motion/CelebrationMount";
import { ArrowRight, GitHubMark, VercelMark } from "@/components/home/marks";
import UserProfileNav from "@/components/auth/UserProfileNav";

// Real routes only: each of these resolves to /editor/<id>.
const FOOTER_TEMPLATES = templates.slice(0, 5);

// 3 Giá trị cốt lõi theo đúng PRD Gen-Folio:
// 1. Trích xuất thông minh bằng Gemini AI từ CV thật hoặc Mock 1 chạm
// 2. Bố cục đặc thù theo ngành nghề (Khối Kỹ Thuật / Khối Sáng Tạo / Khối Kinh Doanh)
// 3. Tùy biến thời gian thực & Bàn giao mã nguồn độc lập 0đ
const HANDOFF = [
  {
    title: "Trích xuất thông minh bằng Gemini AI",
    body: "Hệ thống tự động đọc CV định dạng PDF / DOCX (hoặc nạp dữ liệu mẫu 1 chạm), bóc tách kỹ năng, kinh nghiệm và dự án vào cấu trúc chuẩn chỉ trong 3 giây.",
    kind: "repo",
    mark: null,
    head: "gemini-3.8-flash / bóc tách cv",
    chip: "Tự động 100%",
    rows: [
      "Đọc trực tiếp file PDF & DOCX",
      "Bóc tách kỹ năng, kinh nghiệm, dự án",
      "Khởi tạo tức thì với dữ liệu mẫu chuẩn",
      "Thời gian xử lý đếm ngược ≤ 3 giây",
    ],
  },
  {
    title: "Bố cục thiết kế đặc thù theo ngành nghề",
    body: "Không áp đặt một khuôn mẫu đơn điệu: Khối Kỹ thuật có Terminal & Git log, Khối Sáng tạo có Thư viện ảnh Hologram, Khối Kinh doanh có Chỉ số KPIs và lộ trình thăng tiến.",
    kind: "deploy",
    mark: null,
    head: "công cụ tạo mẫu / 3 khối ngành",
    chip: "Chuẩn hóa ngành",
    rows: [
      ["Khối Kỹ Thuật", "Chế độ tối · Kiểu chữ Monospace · Dòng lệnh Terminal · Nhật ký Git"],
      ["Khối Sáng Tạo", "Kính mờ Hologram · Thư viện thị giác · Trưng bày tác phẩm"],
      ["Khối Kinh Doanh", "Phong cách trang trọng · Tối giản thanh lịch · Báo cáo chỉ số"],
    ],
  },
  {
    title: "Tùy biến tức thì & Sở hữu mã nguồn 0đ",
    body: "Nút nổi đổi màu tức thì, chuyển đổi linh hoạt Di động / Máy tính. Khi xuất bản, toàn bộ mã nguồn Next.js được clone vào GitHub và chạy trên Vercel của bạn với 0đ phí duy trì.",
    kind: "ledger",
    mark: GitHubMark,
    head: "kho lưu trữ cá nhân (github + vercel)",
    chip: "Sở hữu vĩnh viễn",
    rows: [
      ["Đổi màu chủ đạo", "Dưới 100ms (Thời gian thực)"],
      ["Kiểm thử giao diện", "Chuyển đổi Di động / Máy tính trực quan"],
      ["Mã nguồn bàn giao", "Ứng dụng Next.js độc lập trên GitHub"],
      ["Phí duy trì định kỳ", "0 đ (Trọn đời không bị tắt)"],
    ],
  },
];

export default function Home() {
  return (
    <div className="home-root relative flex w-full flex-1 flex-col">
      {/* Behind the content, never over it, so the ground gets a tooth
          without the type having to fight it. */}
      <div className="home-grain" aria-hidden="true" />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--home-strong)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--home-bg)]"
      >
        Chuyển đến nội dung chính
      </a>

      <SiteHeader />

      <main id="main" className="relative z-10">
        <Hero />

        <MotionBreak>
          <CreativeThreadMount />
        </MotionBreak>

        <Wall />

        <MotionBreak>
          <GearsMount />
        </MotionBreak>

        <Handoff />

        <MotionBreak>
          <ThoughtsMount />
        </MotionBreak>

        <FAQSection />
      </main>

      <SiteFooter />
    </div>
  );
}

// A drawn graphic in the seam between two sections. It does the work a rule
// would do, marking where one argument ends, and it earns the space by being
// the only thing on the row.
function MotionBreak({ children }) {
  return (
    <div className="home-reveal mx-auto w-full max-w-[86rem] px-6 py-1 lg:px-10 lg:py-3">
      {children}
    </div>
  );
}

function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      {/* Nintendo Red racetrack logo pill */}
      <span className="n2001-racetrack text-[13px] tracking-tight">
        GENFOLIO
      </span>
      <span className="hidden text-[10px] font-black uppercase tracking-[1px] text-[#9fbee7] sm:inline">
        2001
      </span>
    </span>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      {/* Primary Carbon Command Bar */}
      <div className="n2001-carbon-bar">
        <div className="mx-auto flex w-full max-w-[86rem] items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f68d1f]"
          >
            <Wordmark />
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            <a
              href="#templates"
              className="text-[12px] font-bold uppercase tracking-[0.5px] text-[#e48600] transition hover:brightness-125 focus-visible:outline-2 focus-visible:outline-[#f68d1f]"
            >
              MẪU GIAO DIỆN
            </a>
            <a
              href="#handoff"
              className="hidden text-[12px] font-bold uppercase tracking-[0.5px] text-[#e48600] transition hover:brightness-125 focus-visible:outline-2 focus-visible:outline-[#f68d1f] md:inline"
            >
              GIÁ TRỊ CỐT LÕI
            </a>
            <a
              href="#faq"
              className="hidden text-[12px] font-bold uppercase tracking-[0.5px] text-[#e48600] transition hover:brightness-125 focus-visible:outline-2 focus-visible:outline-[#f68d1f] md:inline"
            >
              HỎI ĐÁP
            </a>

            <a
              href="#templates"
              className="n2001-btn-amber text-[10px] sm:text-[11px]"
            >
              <span>BẮT ĐẦU TẠO</span>
              <span className="font-mono">▶</span>
            </a>

            <UserProfileNav />
          </nav>
        </div>
      </div>

      {/* Secondary Pale Sky Subnav Strip */}
      <div className="n2001-subnav">
        <div className="mx-auto flex w-full max-w-[86rem] items-center justify-between px-4 py-1 sm:px-6 lg:px-10 text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#e60012] animate-pulse" />
            <span className="uppercase tracking-[0.5px] text-[#21242e] font-bold">
              PHIÊN BẢN CONSOLE 2001 // HỆ THỐNG SẴN SÀNG
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[#3d4f97]">
            <span className="hover:text-[#21242e]">TRÍCH XUẤT CV 1 CHẠM</span>
            <span>·</span>
            <span className="hover:text-[#21242e]">3 KHỐI NGÀNH CHUẨN HÓA</span>
            <span>·</span>
            <span className="hover:text-[#21242e]">SỞ HỮU TOÀN BỘ MÃ NGUỒN</span>
            <span>·</span>
            <span className="font-bold text-[#e60012]">0 Đ PHÍ DUY TRÌ</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto w-full max-w-[86rem] px-4 pt-6 pb-8 sm:px-6 lg:px-10 lg:pt-8 lg:pb-12">
      {/* Hero Outer Console Chrome Chassis */}
      <div className="n2001-hero-plate p-5 sm:p-8 lg:p-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.98fr)] lg:gap-12">
          <div>
            {/* Mascot Speech Bubble */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-[#3d4f97] bg-[#21242e] shadow-xs">
                <span className="font-mono text-[11px] font-black text-[#f68d1f]">GF</span>
              </div>
              <div className="n2001-mascot-bubble">
                GEN-FOLIO: TỰ ĐỘNG BIÊN DỊCH CV THÀNH LANDING PAGE DƯỚI 30 GIÂY!
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-[2px] border border-[#3d4f97] bg-[#7a8aba] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
              <span>HỆ THỐNG:</span>
              <span className="text-[#e60012]">TRÌNH BIÊN DỊCH NEXT.JS 128-BIT // TRÍ TUỆ NHÂN TẠO GEMINI</span>
            </div>

            <h1 className="home-display home-display-xl mt-5">
              BIÊN DỊCH CV,
              <br />
              <span className="home-em">THÀNH LANDING PAGE 1 CHẠM.</span>
            </h1>

            <p className="mt-5 max-w-[48ch] text-[15px] font-bold leading-[1.6] text-[#21242e]">
              Hệ thống tự động chuyển hóa CV thành website Landing Page chuyên nghiệp tràn viền toàn màn hình. Tối đa 2 bước: chọn ngành nghề, tải CV hoặc thử mẫu 1 chạm.
            </p>
            <p className="mt-2.5 max-w-[44ch] text-[13px] leading-[1.6] text-[#3d4f97]">
              Trí tuệ nhân tạo Gemini tự động bóc tách kỹ năng, kinh nghiệm và kiến tạo giao diện chuẩn ngành. Mã nguồn Next.js độc lập thuộc trọn về GitHub của bạn với 0đ phí duy trì.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#templates"
                className="n2001-btn-signal flex items-center gap-2 px-6 py-3.5 text-[12px] font-black uppercase tracking-[0.5px] shadow-md transition active:translate-y-[1px]"
              >
                <span>CHỌN MẪU GIAO DIỆN NGAY</span>
                <span className="font-mono">▶</span>
              </a>
              <a
                href="#handoff"
                className="n2001-btn-base flex items-center gap-2 px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.5px] text-[#21242e] shadow-md transition active:translate-y-[1px]"
              >
                <span>TÌM HIỂU GIÁ TRỊ CỐT LÕI</span>
              </a>
            </div>

            {/* Hardware Telemetry Spec Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#3d4f97]/40 pt-4 text-[10px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
              <span className="rounded-[2px] bg-[#dedede] border border-[#3d4f97] px-2 py-0.5">
                3 KHỐI NGÀNH CHUẨN HÓA
              </span>
              <span className="rounded-[2px] bg-[#dedede] border border-[#3d4f97] px-2 py-0.5">
                ≤ 3 GIÂY XỬ LÝ DỮ LIỆU
              </span>
              <span className="rounded-[2px] bg-[#dedede] border border-[#3d4f97] px-2 py-0.5">
                HIỂN THỊ TRÀN VIỀN TOÀN MÀN HÌNH
              </span>
              <span className="rounded-[2px] bg-[#dedede] border border-[#3d4f97] px-2 py-0.5">
                0 Đ PHÍ DUY TRÌ
              </span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroDeck />
          </div>
        </div>
      </div>
    </section>
  );
}

function Wall() {
  return (
    <section id="templates" className="home-band scroll-mt-16 pb-12 pt-8 lg:pb-16 lg:pt-10">
      <div className="mx-auto w-full max-w-[86rem] px-4 sm:px-6 lg:px-10">
        {/* Section Label Bar */}
        <div className="n2001-section-bar mb-8 rounded-[2px]">
          <span className="flex items-center gap-2">
            <span className="text-[#f68d1f]">≡</span>
            <span>KHO MẪU GIAO DIỆN CHUẨN NGÀNH</span>
          </span>
          <span className="text-[#3d4f97] text-[10px] font-bold tracking-wider">PHIÊN BẢN CHUẨN // 3 KHỐI NGÀNH</span>
        </div>

        <div className="home-reveal flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <p className="home-label">
              <span className="home-nums text-[#f68d1f]">BỘ SƯU TẬP 01</span> // DANH MỤC MẪU GIAO DIỆN
            </p>
            <h2 className="home-grotesque text-[26px] sm:text-[34px] font-black uppercase tracking-tight text-[#21242e] mt-3 max-w-[28ch]">
              Một Git log. Một trang nhật báo. Một bộ thẻ bài phản quang.
            </h2>
          </div>
          <p className="max-w-[36ch] text-[13px] leading-[1.6] text-[#3d4f97] font-medium">
            12 mẫu giao diện được thiết kế đặc thù cho Khối Kỹ Thuật, Khối Sáng Tạo và Khối Kinh Doanh. Render trực tiếp dữ liệu thật, xem trước tràn viền toàn màn hình.
          </p>
        </div>

        {/* Component Wall với bộ lọc theo ngành */}
        <TemplateWall />
      </div>
    </section>
  );
}

function Handoff() {
  return (
    <section id="handoff" className="scroll-mt-16 pb-10 pt-8 lg:pb-14 lg:pt-12">
      <div className="mx-auto w-full max-w-[86rem] px-4 sm:px-6 lg:px-10">
        {/* Section Label Bar */}
        <div className="n2001-section-bar mb-8 rounded-[2px]">
          <span className="flex items-center gap-2">
            <span className="text-[#f68d1f]">≡</span>
            <span>3 GIÁ TRỊ CỐT LÕI // NỀN TẢNG CÔNG NGHỆ</span>
          </span>
          <span className="text-[#3d4f97] text-[10px] font-bold tracking-wider">BÀN GIAO TRỰC TIẾP // CÔNG NGHỆ GEMINI AI</span>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,52ch)_minmax(0,1fr)] lg:gap-12">
          <div className="home-reveal">
            <p className="home-label">
              <span className="home-nums text-[#f68d1f]">NỀN TẢNG 02</span> // GIÁ TRỊ CỐT LÕI
            </p>
            <h2 className="home-grotesque text-[28px] sm:text-[38px] font-black uppercase tracking-tight text-[#21242e] mt-4">
              Tốc độ 1 chạm. <em className="home-em">Chuẩn hóa ngành</em>. Làm chủ mã nguồn.
            </h2>
            <p className="mt-5 text-[15px] leading-[1.6] text-[#3d4f97]">
              Gen-Folio giải quyết triệt để 3 bài toán lớn nhất của việc làm website hồ sơ cá nhân: khởi tạo tức thì dưới 30 giây, bố cục chuyên biệt cho từng vị trí nghề nghiệp, và bàn giao toàn quyền sở hữu mã nguồn.
            </p>
          </div>

          <div className="home-reveal lg:pl-20" style={{ "--home-stagger": "4%" }}>
            <OrbitMount />
          </div>
        </div>

        <ol className="home-beats mt-6 lg:mt-8">
          {HANDOFF.map((item, index) => (
            <HandoffBeat key={item.title} item={item} index={index} />
          ))}
        </ol>

        <div className="flex flex-col items-start gap-3 lg:items-center mt-6">
          <span className="home-beat-end" aria-hidden="true" />
          <p className="home-label text-[#21242e]">
            MỖI MẪU GIAO DIỆN LÀ MỘT ỨNG DỤNG WEB NEXT.JS ĐỘC LẬP HOÀN CHỈNH
          </p>
        </div>
      </div>
    </section>
  );
}

function HandoffBeat({ item, index }) {
  const Mark = item.mark;
  const flipped = index % 2 === 1;

  return (
    <li className="home-beat relative grid items-center gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)] lg:gap-y-0 lg:py-10">
      <div className="home-beat-rail hidden lg:block" aria-hidden="true">
        <div className="home-beat-rail-fill" />
      </div>

      <p
        className="home-manifesto-num home-beat-num relative z-10 py-2 lg:col-start-2 lg:row-start-1 lg:justify-self-center"
        aria-hidden="true"
      >
        0{index + 1}
      </p>

      <div
        className={`home-reveal relative z-10 lg:row-start-1 ${
          flipped ? "lg:col-start-3 lg:pl-12" : "lg:col-start-1 lg:pr-12 lg:text-right"
        }`}
      >
        <h3 className="home-grotesque text-[20px] sm:text-[24px] font-bold uppercase tracking-tight text-[#21242e]">
          {item.title}
        </h3>
        <p
          className={`mt-3 max-w-[34ch] text-[14px] leading-[1.6] text-[#3d4f97] ${
            flipped ? "" : "lg:ml-auto"
          }`}
        >
          {item.body}
        </p>
      </div>

      {/* Nintendo 2001 Hardware Spec Plate */}
      <div
        className={`home-beat-art relative z-10 lg:row-start-1 ${
          flipped ? "lg:col-start-1 lg:pr-12" : "lg:col-start-3 lg:pl-12"
        }`}
      >
        <div className="home-beat-stage">
          <div
            className="home-beat-plate n2001-hardware-card-dark overflow-hidden rounded-[4px]"
            style={{ "--home-beat-tilt": flipped ? "5deg" : "-5deg" }}
          >
            <div className="flex items-center gap-3 border-b border-white/20 bg-[#21242e] px-4 py-3">
              {Mark && <Mark className="h-4 w-4 shrink-0 text-[#ecab37]" aria-hidden="true" />}
              <span className="truncate text-[12px] font-bold text-white tracking-[0.5px]">
                {item.head}
              </span>
              <span className="ml-auto shrink-0 rounded-[2px] border border-[#b87c14] bg-[#ecab37] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
                {item.chip}
              </span>
            </div>

            <div className="px-5 py-4 bg-[#21242e]/90">
              {item.kind === "repo" ? (
                <ul className="space-y-2">
                  {item.rows.map((row) => (
                    <li key={row} className="truncate text-[11px] text-[#9fbee7] font-medium">
                      ✓ {row}
                    </li>
                  ))}
                </ul>
              ) : (
                <dl className="space-y-2.5">
                  {item.rows.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-1">
                      <dt className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#9fbee7]">{label}</dt>
                      <dd className="text-[11px] font-bold text-[#dedede]">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function SiteFooter() {
  return (
    <footer className="home-invert">
      <div className="mx-auto w-full max-w-[86rem] px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-[32ch] text-[12.5px] leading-[1.65] text-[#9fbee7]">
              Tải CV lên hoặc thử mẫu 1 chạm, tự động sinh website Landing Page chuyên nghiệp tràn viền và bàn giao mã nguồn Next.js độc lập vào GitHub cá nhân của bạn.
            </p>
            <div className="mt-5">
              <span className="n2001-esrb-badge">
                BẢO MẬT TUYỆT ĐỐI // KHÔNG LƯU DỮ LIỆU RIÊNG TƯ
              </span>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#e48600]">Mẫu giao diện</p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_TEMPLATES.map((template) => (
                <li key={template.id}>
                  <Link href={`/editor/${template.id}`} className="home-footer-link">
                    {template.name}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#templates" className="home-footer-link">
                  Khám phá tất cả mẫu ▶
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#e48600]">Sản phẩm</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="#handoff" className="home-footer-link">
                  3 Giá trị cốt lõi
                </a>
              </li>
              <li>
                <a href="#templates" className="home-footer-link">
                  Khởi tạo 1 chạm từ CV
                </a>
              </li>
              <li>
                <a href="#faq" className="home-footer-link">
                  Câu hỏi thường gặp (FAQ)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#e48600]">Quyền lợi của bạn</p>
            <ul className="mt-4 space-y-2.5 text-[12px] leading-[1.5] text-[#9fbee7]">
              <li>✓ Một ứng dụng Next.js độc lập trên GitHub của bạn</li>
              <li>✓ Website chạy trực tiếp trên dự án Vercel cá nhân</li>
              <li>✓ Tự do gắn tên miền riêng bất cứ lúc nào</li>
              <li>✓ Không cần tạo tài khoản tại đây, không phí duy trì</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-[#3d4f97] pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#9fbee7]">
            &copy; 2001–2026 GENFOLIO. TOÀN BỘ QUYỀN ĐƯỢC BẢO LƯU.
          </p>
          <p className="text-[11px] text-[#7a8aba]">
            Toàn bộ dữ liệu của bạn chỉ được lưu trữ khi bạn chủ động xuất bản.
          </p>
        </div>
      </div>
    </footer>
  );
}
