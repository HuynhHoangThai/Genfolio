import { createSharedPortfolio, getSharedPortfolio } from "@/lib/db";
import { sanitizePortfolioData } from "@/lib/portfolioData";

export async function POST(request) {
  try {
    const body = await request.json();
    const { portfolioId, template, data, expiresInHours, userEmail } = body || {};

    if (!template) {
      return Response.json({ error: "Thiếu thông tin template." }, { status: 400 });
    }

    if (!data || typeof data !== "object") {
      return Response.json({ error: "Dữ liệu portfolio không hợp lệ." }, { status: 400 });
    }

    const sanitized = sanitizePortfolioData(data);
    const hours = typeof expiresInHours === "number" ? expiresInHours : null;

    const shared = await createSharedPortfolio({
      portfolioId,
      userEmail,
      template,
      data: sanitized,
      expiresInHours: hours,
    });

    return Response.json({
      ok: true,
      message: "Tạo liên kết chia sẻ thành công!",
      shareId: shared.id,
      expiresAt: shared.expires_at,
    });
  } catch (err) {
    console.error("Lỗi khi tạo chia sẻ portfolio:", err);
    return Response.json(
      { error: "Không thể tạo liên kết chia sẻ: " + err.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Thiếu mã chia sẻ." }, { status: 400 });
    }

    const result = await getSharedPortfolio(id);

    if (result.notFound) {
      return Response.json({ error: "Không tìm thấy portfolio chia sẻ này." }, { status: 404 });
    }

    if (result.expired) {
      return Response.json(
        { error: "expired", message: "Liên kết chia sẻ này đã hết hạn.", expiresAt: result.expiresAt },
        { status: 410 }
      );
    }

    return Response.json({ ok: true, portfolio: result });
  } catch (err) {
    console.error("Lỗi khi đọc portfolio chia sẻ:", err);
    return Response.json({ error: "Lỗi hệ thống khi tải portfolio chia sẻ." }, { status: 500 });
  }
}
