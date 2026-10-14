import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/portfolioData";
import PortfolioEditor from "@/components/PortfolioEditor";

export default async function EditorPage({ params }) {
  const { template: templateId } = await params;
  const template = getTemplate(templateId);

  if (!template) notFound();

  if (template.locked) {
    return (
      <div className="home-root flex min-h-dvh flex-col items-center justify-center bg-[#f5f1e4] px-4 text-center">
        <div className="w-full max-w-sm overflow-hidden rounded-[25.5px] border border-[#d5d5d4] bg-[#ffffff] shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#f5f1e4] border-b border-[#d5d5d4]">
            <span className="rounded-[10px] border border-[#d5d5d4] bg-[#ffffff] px-2 py-0.5 font-mono text-[9px] font-bold text-[#2c2e2a]">GENFOLIO</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
              MẪU ĐANG KHÓA
            </span>
          </div>
          <div className="p-6">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#d5d5d4] bg-[#f5f1e4] text-[11px] font-bold text-[#2c2e2a]">
              KHÓA
            </div>
            <h1 className="text-sm font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
              {template.name} SẮP RA MẮT
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-[#80827f]">
              Mẫu giao diện này đang được hoàn thiện. Bạn có thể trải nghiệm các mẫu giao diện khả dụng khác ngay bây giờ.
            </p>
            <Link href="/" className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white mt-5 inline-flex py-2 px-4 text-xs font-bold uppercase tracking-[0.5px]">
              ← QUAY LẠI DANH SÁCH MẪU ▶
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <PortfolioEditor template={template} />;
}
