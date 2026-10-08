// Landing point for Vercel's redirect-url callback after the customer
// completes the clone+deploy flow. portfolioId is our own param, baked into
// the redirect-url we constructed before sending them to Vercel; everything
// else on the query string is appended by Vercel itself (see
// https://vercel.com/docs/deploy-button/callback).
import Link from "next/link";
import { publishPortfolio } from "@/lib/portfolios";

export const dynamic = "force-dynamic";

export default async function DeployedPage({ searchParams }) {
  const params = await searchParams;
  const portfolioId = params.portfolioId;
  const rawDeploymentUrl = params["deployment-url"];
  const projectDashboardUrl = params["project-dashboard-url"];

  const deploymentUrl = rawDeploymentUrl
    ? rawDeploymentUrl.startsWith("http")
      ? rawDeploymentUrl
      : `https://${rawDeploymentUrl}`
    : null;

  const result =
    portfolioId && deploymentUrl
      ? await publishPortfolio(portfolioId, deploymentUrl)
      : { ok: false, error: "Thiếu thông tin triển khai từ Vercel." };

  return (
    <div className="home-root flex min-h-dvh flex-col items-center justify-center bg-[#7a8aba] px-4 py-12">
      <div className="n2001-hardware-card w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="n2001-carbon-bar flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="n2001-racetrack text-[9px] py-0 px-2">GENFOLIO</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#ecab37]">
              {result.ok ? "CONSOLE DEPLOYMENT // ONLINE" : "SYSTEM ALERT // ERROR"}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#9fbee7]">GF-2001</span>
        </div>

        <div className="p-8 text-center">
          {result.ok ? (
            <>
              {/* Nintendo Seal of Quality Emblem */}
              <div className="mx-auto mb-4 flex flex-col items-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-3 border-[#ecab37] bg-[#fdf8e6] p-2 text-center shadow-md">
                  <div className="flex flex-col items-center">
                    <span className="text-[7px] font-black uppercase tracking-wider text-[#b87c14]">OFFICIAL</span>
                    <span className="text-[8px] font-black uppercase text-[#e60012]">GENFOLIO</span>
                    <span className="text-[7px] font-bold uppercase text-[#21242e]">SEAL OF</span>
                    <span className="text-[7px] font-black uppercase tracking-wider text-[#b87c14]">QUALITY</span>
                    <span className="text-[8px] text-[#f68d1f]">★★★★★</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] font-extrabold uppercase tracking-[0.5px] text-[#e48600]">
                STATUS: 200 OK // HOSTED & LIVE
              </p>
              <h1 className="home-display mt-2 text-2xl font-black md:text-3xl" style={{ color: "#ffffff" }}>
                PORTFOLIO ĐÃ XUẤT BẢN!
              </h1>
              <p className="mx-auto mt-3 max-w-[36ch] text-xs leading-relaxed text-[#3d4f97]">
                Website đã được triển khai hoàn tất trên tài khoản Vercel của bạn — sở hữu mã nguồn trọn đời, dashboard quản trị riêng và sẵn sàng gắn tên miền tùy chỉnh.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="n2001-btn-signal flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.5px]"
                >
                  XEM PORTFOLIO TRỰC TIẾP ▶
                </a>
                {projectDashboardUrl && (
                  <a
                    href={projectDashboardUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="n2001-btn-amber flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-[0.5px]"
                  >
                    MỞ DỰ ÁN TRÊN VERCEL ▶
                  </a>
                )}
              </div>

              <div className="mt-6 border-t border-[#3d4f97]/20 pt-4">
                <Link
                  href="/"
                  className="home-quiet-link text-xs font-bold"
                >
                  ← QUAY LẠI DANH SÁCH MẪU
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[2px] bg-[#e60012] text-xl font-bold text-white shadow-md">
                ✕
              </div>
              <h1 className="text-base font-bold uppercase tracking-[0.5px] text-[#e60012]">
                ĐÃ XẢY RA SỰ CỐ TRIỂN KHAI
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-[#3d4f97]">{result.error}</p>
              <Link
                href="/"
                className="n2001-btn-amber mt-6 inline-flex py-2 px-4 text-xs font-bold uppercase tracking-[0.5px]"
              >
                ← QUAY LẠI TRANG CHỦ
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
