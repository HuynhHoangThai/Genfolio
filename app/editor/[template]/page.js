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
      <div className="home-root flex h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-xl font-semibold" style={{ color: "var(--home-strong)" }}>
          {template.name} sắp ra mắt
        </h1>
        <p className="max-w-sm text-sm" style={{ color: "var(--home-dim)" }}>
          Mẫu giao diện này đang được hoàn thiện. Bạn có thể trải nghiệm mẫu Changelog ngay bây giờ.
        </p>
        <Link href="/" className="home-quiet-link mt-2 text-sm font-medium">
          ← Quay lại danh sách mẫu
        </Link>
      </div>
    );
  }

  return <PortfolioEditor template={template} />;
}
