import { getUserPortfolio } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return Response.json({ error: "Thiếu ID portfolio." }, { status: 400 });
    }

    const portfolio = await getUserPortfolio(id);
    if (!portfolio) {
      return Response.json({ error: "Không tìm thấy portfolio." }, { status: 404 });
    }

    return Response.json({ ok: true, portfolio });
  } catch (err) {
    console.error("Lỗi khi tải portfolio:", err);
    return Response.json({ error: "Lỗi hệ thống khi tải portfolio." }, { status: 500 });
  }
}
