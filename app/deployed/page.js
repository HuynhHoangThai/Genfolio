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
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      {result.ok ? (
        <>
          <span className="text-4xl">🎉</span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Portfolio của bạn đã được xuất bản
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Website đã được triển khai trên tài khoản Vercel của bạn — repo của bạn, dashboard quản trị của bạn và bạn có thể gắn tên miền riêng bất cứ lúc nào.
          </p>
          <a
            href={deploymentUrl}
            className="mt-6 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Xem portfolio của bạn
          </a>
          {projectDashboardUrl && (
            <a
              href={projectDashboardUrl}
              className="mt-3 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Mở dự án trên Vercel →
            </a>
          )}
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Đã xảy ra sự cố
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{result.error}</p>
          <Link
            href="/"
            className="mt-6 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Quay lại danh sách mẫu
          </Link>
        </>
      )}
    </div>
  );
}
