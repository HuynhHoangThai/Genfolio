import { publishPortfolio } from "@/lib/portfolios";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { deploymentUrl } = body || {};

    if (!deploymentUrl) {
      return Response.json(
        { error: "Thiếu địa chỉ URL triển khai của portfolio." },
        { status: 400 }
      );
    }

    const result = await publishPortfolio(id, deploymentUrl);
    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json({
      ok: true,
      message: "Xuất bản portfolio thành công!",
      publishedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Lỗi khi xuất bản portfolio:", err);
    return Response.json(
      { error: "Không thể xử lý yêu cầu xuất bản. Vui lòng thử lại: " + err.message },
      { status: 500 }
    );
  }
}
