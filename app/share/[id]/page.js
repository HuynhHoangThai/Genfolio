import Link from "next/link";
import { notFound } from "next/navigation";
import { getSharedPortfolio } from "@/lib/db";
import { getTemplate, sanitizePortfolioData } from "@/lib/portfolioData";
import { templateComponents } from "@/components/templates";
import { getPalettesForTemplate } from "@/lib/palettes";
import ShareViewClient from "./ShareViewClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const portfolio = await getSharedPortfolio(id);

  if (!portfolio || portfolio.notFound || portfolio.expired) {
    return {
      title: "Portfolio Chia Sẻ — Genfolio",
      description: "Xem portfolio lập trình viên chia sẻ trên Genfolio.",
    };
  }

  const name = portfolio.data?.name || "Lập trình viên";
  const title = portfolio.data?.title || "Portfolio Cá Nhân";

  return {
    title: `${name} — ${title} | Genfolio`,
    description: portfolio.data?.bio || `Xem portfolio chuyên nghiệp của ${name} được tạo bằng Genfolio.`,
    openGraph: {
      title: `${name} — ${title} | Genfolio`,
      description: portfolio.data?.bio || `Xem portfolio chuyên nghiệp của ${name} được tạo bằng Genfolio.`,
    },
  };
}

export default async function SharedPortfolioPage({ params }) {
  const { id } = await params;
  const result = await getSharedPortfolio(id);

  if (!result || result.notFound) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f5f1e4] px-4 text-center">
        <div className="w-full max-w-md overflow-hidden rounded-[25.5px] border border-[#d5d5d4] bg-[#ffffff] p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between px-3 py-1.5 rounded-[10px] bg-[#f5f1e4] border border-[#d5d5d4]">
            <span className="font-mono text-[9px] font-bold text-[#2c2e2a]">GENFOLIO</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#ff705d]">
              LỖI TRUY CẬP (404)
            </span>
          </div>
          <h1 className="text-base font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
            Không tìm thấy portfolio này
          </h1>
          <p className="mt-2.5 text-xs leading-relaxed text-[#80827f]">
            Liên kết chia sẻ có thể không chính xác, đã bị gỡ bỏ hoặc chưa từng tồn tại trên hệ thống.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-[0.5px]"
            >
              <span>VỀ TRANG CHỦ GENFOLIO</span>
              <span className="font-mono">▶</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (result.expired) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f5f1e4] px-4 text-center">
        <div className="w-full max-w-md overflow-hidden rounded-[25.5px] border border-[#d5d5d4] bg-[#ffffff] p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between px-3 py-1.5 rounded-[10px] bg-[#f5f1e4] border border-[#d5d5d4]">
            <span className="font-mono text-[9px] font-bold text-[#2c2e2a]">GENFOLIO</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#ff705d]">
              HẾT HẠN CHIA SẺ (410)
            </span>
          </div>
          <h1 className="text-base font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
            Liên kết chia sẻ đã hết hạn
          </h1>
          <p className="mt-2.5 text-xs leading-relaxed text-[#80827f]">
            Người tạo portfolio đã đặt thời hạn xem tạm thời cho liên kết này và thời gian đã kết thúc.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-[0.5px]"
            >
              <span>TỰ TẠO PORTFOLIO CHO BẠN</span>
              <span className="font-mono">▶</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const templateId = result.template || "newspaper";
  const template = getTemplate(templateId);
  const TemplateComponent = templateComponents[templateId] || templateComponents.newspaper;
  const palettes = getPalettesForTemplate(templateId);
  const sanitizedData = sanitizePortfolioData(result.data);

  return (
    <ShareViewClient
      id={result.id}
      templateId={templateId}
      templateName={template?.name || templateId}
      initialData={sanitizedData}
      palettes={palettes}
      expiresAt={result.expiresAt}
    />
  );
}
