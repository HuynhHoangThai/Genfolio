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
      <div className="home-root flex min-h-dvh flex-col items-center justify-center bg-[#7a8aba] px-4 text-center">
        <div className="n2001-hardware-card w-full max-w-sm overflow-hidden shadow-2xl">
          <div className="n2001-carbon-bar flex items-center justify-between px-3.5 py-2">
            <span className="n2001-racetrack text-[9px] py-0 px-2">GENFOLIO</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#ecab37]">
              CARTRIDGE LOCKED
            </span>
          </div>
          <div className="p-6">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[2px] bg-[#ecab37] text-base font-bold text-[#21242e] shadow-sm">
              🔒
            </div>
            <h1 className="text-sm font-bold uppercase tracking-[0.5px] text-[#21242e]">
              {template.name} SẮP RA MẮT
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-[#3d4f97]">
              Mẫu game cartridge này đang được hoàn thiện. Bạn có thể trải nghiệm mẫu Changelog ngay bây giờ.
            </p>
            <Link href="/" className="n2001-btn-signal mt-5 inline-flex py-2 px-4 text-xs font-bold uppercase tracking-[0.5px]">
              ← QUAY LẠI DANH SÁCH MẪU ▶
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <PortfolioEditor template={template} />;
}
