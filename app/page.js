import Image from "next/image";
import Link from "next/link";
import { templates } from "@/lib/portfolioData";
import TemplatePreviewCard from "@/components/TemplatePreviewCard";
import HeroDeck from "@/components/home/HeroDeck";
import CommissionDesk from "@/components/home/CommissionDesk";
import OrbitMount from "@/components/motion/OrbitMount";
import CreativeThreadMount from "@/components/motion/CreativeThreadMount";
import GearsMount from "@/components/motion/GearsMount";
import ThoughtsMount from "@/components/motion/ThoughtsMount";
import CelebrationMount from "@/components/motion/CelebrationMount";
import { ArrowRight, GitHubMark, VercelMark } from "@/components/home/marks";
import UserProfileNav from "@/components/auth/UserProfileNav";

// Real routes only: each of these resolves to /editor/<id>.
const FOOTER_TEMPLATES = templates.slice(0, 5);


// Each beat renders as the actual artifact it produces: a repo, a
// deployment, and the list of things that keep costing you nothing. Plain
// paragraphs made the product's whole selling point read as filler.
const HANDOFF = [
  {
    title: "Bạn sở hữu mã nguồn",
    body: "Khi xuất bản, hệ thống sẽ clone trực tiếp một ứng dụng Next.js độc lập vào tài khoản GitHub của bạn.",
    kind: "repo",
    mark: GitHubMark,
    head: "you/portfolio",
    chip: "Công khai",
    rows: ["app/page.js", "components/PortfolioTemplate.js", "lib/portfolioData.js", "package.json"],
  },
  {
    title: "Bạn làm chủ hạ tầng hosting",
    body: "Website chạy trực tiếp trên dự án Vercel cá nhân của bạn, dễ dàng trỏ về bất kỳ tên miền riêng nào.",
    kind: "deploy",
    mark: VercelMark,
    head: "you.vercel.app",
    chip: "Sẵn sàng",
    rows: [
      ["Môi trường", "Production"],
      ["Nguồn", "GitHub repo của bạn"],
      ["Tên miền", "Tùy bạn trỏ"],
    ],
  },
  {
    title: "Không phí duy trì định kỳ",
    body: "Thanh toán một lần duy nhất. Không phí gia hạn hàng tháng và không ai có thể can thiệp tắt trang web của bạn.",
    kind: "ledger",
    mark: null,
    head: "Chi phí phát sinh",
    chip: "Không có",
    rows: [
      ["Hình thức", "Một lần duy nhất"],
      ["Gói đăng ký", "Không có"],
      ["Phí duy trì từ chúng tôi", "0 đ"],
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

        <Commission />
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

function Wordmark({ size = 30, textClassName = "text-[14px] font-medium" }) {
  return (
    <span className="flex items-center gap-2.5">
      {/* The logo is an app-icon style mark with its own dark field baked in,
          so it is framed as a tile rather than floated on the page. It is also
          the one piece of colour allowed in the chrome. */}
      <span className="relative shrink-0 overflow-hidden rounded-lg" style={{ width: size, height: size }}>
        <Image
          src="/portfolio-generator-logo.png"
          alt=""
          width={size}
          height={size}
          priority
          className="h-full w-full object-cover"
        />
      </span>
      <span className={`hidden tracking-tight text-[var(--home-strong)] sm:inline ${textClassName}`}>
        Genfolio
      </span>
    </span>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--home-rule-soft)] bg-[var(--home-bg)]">
      <div className="mx-auto flex w-full max-w-[86rem] items-center justify-between gap-6 px-6 py-3.5 lg:px-10">
        <Link
          href="/"
          className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-strong)]"
        >
          <Wordmark size={40} textClassName="text-[17px] font-semibold" />
        </Link>

        <nav className="flex items-center gap-6">
          <a
            href="#handoff"
            className="home-label hidden transition-colors hover:text-[var(--home-strong)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-strong)] sm:inline"
          >
            Cách hoạt động
          </a>
          <a
            href="#custom"
            className="home-label hidden transition-colors hover:text-[var(--home-strong)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-strong)] sm:inline"
          >
            Thiết kế riêng
          </a>
          <a
            href="#templates"
            className="whitespace-nowrap rounded-full bg-[var(--home-strong)] px-4 py-2 text-[13px] font-medium text-[var(--home-bg)] transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-strong)]"
          >
            Bắt đầu tạo
          </a>
          <UserProfileNav />
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto w-full max-w-[86rem] px-6 lg:px-10">
      <div className="grid items-center gap-14 pb-12 pt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14 lg:pb-16 lg:pt-20">
        <div>
          <p className="home-label">Đưa CV vào. Nhận Repo ra.</p>

          <h1 className="home-display home-display-xl mt-7">
            Biên dịch CV,
            <br />
            <span className="home-em">thành Portfolio.</span>
          </h1>

          <p className="mt-8 max-w-[46ch] text-[16px] leading-[1.6] text-[var(--home-dim)]">
            Portfolio lập trình viên với phong cách độc bản, không rập khuôn.
          </p>

          {/* The differentiator, shown rather than claimed. */}
          <div className="home-hero-slab home-inset mt-8 max-w-[36rem]">
            <span className="home-hero-slab-item">
              <GitHubMark className="home-hero-mark" width={18} height={18} aria-hidden="true" />
              github.com/you/portfolio
            </span>
            <span className="home-hero-slab-rule" aria-hidden="true" />
            <span className="home-hero-slab-item">
              <VercelMark className="home-hero-mark" width={18} height={18} aria-hidden="true" />
              you.vercel.app
            </span>
            <span className="home-hero-slab-tag">Của bạn</span>
          </div>

          <p className="mt-5 max-w-[38ch] text-[15px] leading-[1.6] text-[var(--home-dim)]">
            Cả hai đều nằm trong tài khoản cá nhân của bạn, website của bạn sẽ luôn hoạt động độc lập mà không bị ràng buộc bởi ứng dụng này.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href="#templates"
              className="group flex items-center gap-2 rounded-full bg-[var(--home-strong)] px-5 py-3 text-[14px] font-medium text-[var(--home-bg)] transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-strong)]"
            >
              Chọn mẫu giao diện
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="#handoff"
              className="border-b border-[var(--home-blue)]/40 pb-0.5 text-[14px] text-[var(--home-blue)] transition-colors hover:border-[var(--home-blue)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--home-blue)]"
            >
              Những gì bạn nhận được
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroDeck />
        </div>
      </div>

    </section>
  );
}

function Wall() {
  return (
    <section id="templates" className="home-band scroll-mt-16 pb-8 pt-12 lg:pb-10 lg:pt-16">
      <div className="mx-auto w-full max-w-[86rem] px-6 lg:px-10">
      <div className="home-reveal flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div>
          <p className="home-label">
            <span className="home-nums">01</span> Mẫu giao diện
          </p>
          <h2 className="home-grotesque home-display-lg mt-5 max-w-[22ch]">
            Một Git log. Một trang nhật báo. Một bộ thẻ bài phản quang.
          </h2>
        </div>
        <p className="max-w-[30ch] text-[14px] leading-[1.6] text-[var(--home-dim)]">
          Mỗi hình xem trước bên dưới là bản dựng trực tiếp render dữ liệu thật, không phải ảnh chụp màn hình.
        </p>
      </div>

      <div className="mt-12 grid auto-rows-fr grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <TemplatePreviewCard key={template.id} template={template} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Handoff() {
  return (
    <section id="handoff" className="scroll-mt-16 pb-2 pt-6 lg:pb-4 lg:pt-8">
      <div className="mx-auto w-full max-w-[86rem] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,52ch)_minmax(0,1fr)] lg:gap-12">
          <div className="home-reveal">
            <p className="home-label">
              <span className="home-nums">02</span> Bàn giao toàn quyền
            </p>
            <h2 className="home-grotesque home-display-shout mt-6">
              Bạn giữ <em className="home-em">toàn bộ</em>.
            </h2>
            <p className="mt-8 text-[16px] leading-[1.6] text-[var(--home-dim)]">
              Đa số nền tảng khác chỉ cho bạn thuê một trang con trên tên miền của họ. Genfolio bàn giao trọn vẹn mã nguồn cho bạn.
            </p>
          </div>

          <div className="home-reveal lg:pl-20" style={{ "--home-stagger": "4%" }}>
            <OrbitMount />
          </div>
        </div>

        <ol className="home-beats mt-4 lg:mt-6">
          {HANDOFF.map((item, index) => (
            <HandoffBeat key={item.title} item={item} index={index} />
          ))}
        </ol>

        <div className="flex flex-col items-start gap-3 lg:items-center">
          <span className="home-beat-end" aria-hidden="true" />
          <p className="home-label">
            Mỗi mẫu giao diện đều là một ứng dụng web độc lập hoàn chỉnh
          </p>
        </div>
      </div>
    </section>
  );
}

function HandoffBeat({ item, index }) {
  const Mark = item.mark;

  // The middle beat flips sides. Alternating is what turns three facts into a
  // path down the page rather than a row to be scanned.
  const flipped = index % 2 === 1;

  return (
    <li className="home-beat relative grid items-center gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)] lg:gap-y-0 lg:py-10">
      <div className="home-beat-rail hidden lg:block" aria-hidden="true">
        <div className="home-beat-rail-fill" />
      </div>

      {/* The ordinal is decorative: the real order is carried by the list. */}
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
        <h3 className="home-grotesque home-display-row">{item.title}</h3>
        <p
          className={`mt-4 max-w-[34ch] text-[15px] leading-[1.6] text-[var(--home-dim)] ${
            flipped ? "" : "lg:ml-auto"
          }`}
        >
          {item.body}
        </p>
      </div>

      {/* The artifact itself, as the object rather than as a thumbnail inside
          a card: a navy slab turned slightly away from the reader until they
          reach for it. */}
      <div
        className={`home-beat-art relative z-10 lg:row-start-1 ${
          flipped ? "lg:col-start-1 lg:pr-12" : "lg:col-start-3 lg:pl-12"
        }`}
      >
        <div className="home-beat-stage">
          <div
            className="home-beat-plate home-inset overflow-hidden rounded-xl"
            style={{ "--home-beat-tilt": flipped ? "6deg" : "-6deg" }}
          >
            <div className="flex items-center gap-3 border-b border-white/15 px-5 py-4">
              {Mark && <Mark className="h-4 w-4 shrink-0 text-[var(--home-strong)]" aria-hidden="true" />}
              <span className="home-nums truncate text-[13px] text-[var(--home-strong)]">{item.head}</span>
              <span className="home-label ml-auto shrink-0 rounded-full border border-white/20 px-2.5 py-1">
                {item.chip}
              </span>
            </div>

            <div className="px-5 py-4">
              {item.kind === "repo" ? (
                <ul className="space-y-2">
                  {item.rows.map((row) => (
                    <li key={row} className="home-nums truncate text-[12px] text-[var(--home-faint)]">
                      {row}
                    </li>
                  ))}
                </ul>
              ) : (
                <dl className="space-y-2.5">
                  {item.rows.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-3">
                      <dt className="text-[12px] text-[var(--home-faint)]">{label}</dt>
                      <dd className="home-nums text-[12px] text-[var(--home-text)]">{value}</dd>
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

// The page has spent two sections arguing for the template gallery, so it
// closes by admitting what a gallery cannot do.
function Commission() {
  return (
    <section id="custom" className="home-band scroll-mt-16 pb-24 pt-14 lg:pb-28 lg:pt-20">
      <div className="mx-auto w-full max-w-[86rem] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,52ch)_minmax(0,1fr)] lg:gap-12">
          <div className="home-reveal">
            <p className="home-label">
              <span className="home-nums">03</span> Thiết kế theo yêu cầu
            </p>
            <h2 className="home-grotesque home-display-lg mt-5">
              Chưa ưng ý mẫu nào? Tôi sẽ <em className="home-em">thiết kế riêng</em> cho bạn.
            </h2>
            <p className="mt-8 text-[16px] leading-[1.6] text-[var(--home-dim)]">
              Tôi là Shruti, kỹ sư xây dựng trang web này cùng toàn bộ các mẫu giao diện. Nếu bạn đã có ý tưởng riêng cho portfolio của mình mà không mẫu nào phía trên đáp ứng được, hãy đặt thiết kế riêng. Ý tưởng của bạn, dữ liệu của bạn, được xây dựng theo tiêu chuẩn chỉn chu nhất và bàn giao tương tự: mã nguồn nằm trọn trong GitHub và chạy trên Vercel của bạn.
            </p>
            <p className="mt-5 text-[16px] leading-[1.6] text-[var(--home-dim)]">
              Trả lời 3 câu hỏi dưới đây, bản tóm tắt yêu cầu sẽ tự động được soạn thảo. Hãy gửi đi khi bạn thấy đã đúng ý mình.
            </p>
          </div>

          <div className="home-reveal lg:pl-12" style={{ "--home-stagger": "4%" }}>
            <CelebrationMount />
          </div>
        </div>

        <div className="mt-14">
          <CommissionDesk />
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="home-invert">
      <div className="mx-auto w-full max-w-[86rem] px-6 py-20 lg:px-10">
        <div className="grid gap-x-10 gap-y-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <Wordmark size={36} textClassName="text-[16px] font-semibold" />
            <p className="mt-5 max-w-[32ch] text-[13.5px] leading-[1.65] text-[var(--home-dim)]">
              Tải CV lên, điền thông tin và xuất bản portfolio lập trình viên lên tài khoản của chính bạn. Chi phí một lần, không phí duy trì.
            </p>
          </div>

          <div>
            <p className="home-label">Mẫu giao diện</p>
            <ul className="mt-5 space-y-3">
              {FOOTER_TEMPLATES.map((template) => (
                <li key={template.id}>
                  <Link href={`/editor/${template.id}`} className="home-footer-link">
                    {template.name}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#templates" className="home-footer-link">
                  Khám phá tất cả mẫu
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="home-label">Sản phẩm</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a href="#handoff" className="home-footer-link">
                  Quy trình bàn giao
                </a>
              </li>
              <li>
                <Link href={`/editor/${FOOTER_TEMPLATES[0].id}`} className="home-footer-link">
                  Nhập dữ liệu từ CV
                </Link>
              </li>
              <li>
                <a href="#custom" className="home-footer-link">
                  Đặt thiết kế riêng
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="home-label">Quyền lợi của bạn</p>
            <ul className="mt-5 space-y-3 text-[13.5px] leading-[1.5] text-[var(--home-dim)]">
              <li>Một ứng dụng Next.js độc lập trên GitHub của bạn</li>
              <li>Website chạy trực tiếp trên dự án Vercel cá nhân</li>
              <li>Tự do gắn tên miền riêng bất cứ lúc nào</li>
              <li>Không cần tạo tài khoản tại đây, không phí duy trì</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-[var(--home-rule)] pt-8">
          <p className="text-[12.5px] text-[var(--home-faint)]">
            &copy; 2026 Genfolio
          </p>
          <p className="text-[12.5px] text-[var(--home-faint)]">
            Không có dữ liệu nào bị lưu trữ cho đến khi bạn tự mình xuất bản.
          </p>
        </div>
      </div>
    </footer>
  );
}
