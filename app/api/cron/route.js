import { cleanExpiredSharedPortfolios } from "@/lib/db";

export const dynamic = "force-dynamic";

function isAuthorized(request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    const vercelCron = request.headers.get("x-vercel-cron");
    if (authHeader === `Bearer ${cronSecret}` || vercelCron === "1") {
      return true;
    }
    return false;
  }
  return process.env.NODE_ENV !== "production";
}

export async function GET(request) {
  return handleCron(request);
}

export async function POST(request) {
  return handleCron(request);
}

async function handleCron(request) {
  if (!isAuthorized(request)) {
    return Response.json(
      { error: "Yêu cầu không được cấp quyền thực thi tác vụ nền." },
      { status: 401 }
    );
  }

  const results = {};
  const startTime = Date.now();

  try {
    // Tác vụ 1: Dọn dẹp liên kết chia sẻ đã hết hạn
    const cleanupResult = await cleanExpiredSharedPortfolios();
    results.cleanup = cleanupResult;

    const durationMs = Date.now() - startTime;

    return Response.json({
      ok: true,
      jobsExecuted: 1,
      durationMs,
      results,
      executedAt: new Date().toISOString(),
      message: "Tất cả các tác vụ nền định kỳ đã hoàn thành thành công.",
    });
  } catch (error) {
    console.error("Lỗi thực thi cron jobs:", error);
    return Response.json(
      { error: "Thực thi tác vụ nền thất bại: " + error.message, results },
      { status: 500 }
    );
  }
}
