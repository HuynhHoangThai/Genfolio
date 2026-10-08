import { saveUserPortfolio } from "@/lib/db";
import { sanitizePortfolioData } from "@/lib/portfolioData";

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, template, data, title, isPublic, user } = body || {};

    if (!template) {
      return Response.json({ error: "Thiếu thông tin template." }, { status: 400 });
    }

    if (!data || typeof data !== "object") {
      return Response.json({ error: "Dữ liệu portfolio không hợp lệ." }, { status: 400 });
    }

    const sanitized = sanitizePortfolioData(data);
    const userEmail = user?.email || (typeof user === "string" ? user : null);
    const userId = user?.sub || user?.id || null;
    const userName = user?.name || sanitized?.name || null;

    const saved = await saveUserPortfolio({
      id,
      userId,
      userEmail,
      userName,
      title: title || (sanitized?.name ? `Portfolio của ${sanitized.name}` : `Portfolio ${template}`),
      template,
      data: sanitized,
      isPublic: isPublic !== false,
    });

    return Response.json({
      ok: true,
      message: "Lưu portfolio thành công!",
      portfolio: saved,
    });
  } catch (err) {
    console.error("Lỗi khi lưu portfolio:", err);
    return Response.json(
      { error: "Không thể lưu portfolio. Vui lòng thử lại: " + err.message },
      { status: 500 }
    );
  }
}
