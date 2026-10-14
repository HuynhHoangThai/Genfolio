import { cleanExpiredSharedPortfolios } from "@/lib/db";

export const dynamic = "force-dynamic";

function isAuthorized(request) {
  const cronSecret = process.env.CRON_SECRET;
  // If CRON_SECRET is configured, enforce Bearer authorization or Vercel cron header
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    const vercelCron = request.headers.get("x-vercel-cron");
    if (authHeader === `Bearer ${cronSecret}` || vercelCron === "1") {
      return true;
    }
    return false;
  }
  // In development without CRON_SECRET configured, allow execution
  return process.env.NODE_ENV !== "production";
}

export async function GET(request) {
  return handleCleanup(request);
}

export async function POST(request) {
  return handleCleanup(request);
}

async function handleCleanup(request) {
  if (!isAuthorized(request)) {
    return Response.json(
      { error: "Yêu cầu không được cấp quyền thực thi tác vụ nền." },
      { status: 401 }
    );
  }

  try {
    const result = await cleanExpiredSharedPortfolios();
    return Response.json({
      ok: true,
      job: "clean-expired-shared-portfolios",
      deletedCount: result.deletedCount,
      cleanedAt: result.cleanedAt,
      message: `Đã dọn dẹp thành công ${result.deletedCount} bản ghi chia sẻ hết hạn.`,
    });
  } catch (error) {
    console.error("Lỗi thực thi cron cleanup:", error);
    return Response.json(
      { error: "Thực thi tác vụ dọn dẹp thất bại: " + error.message },
      { status: 500 }
    );
  }
}
