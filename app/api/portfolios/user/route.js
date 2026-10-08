import { listUserPortfolios, deleteUserPortfolio } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json({ error: "Thiếu tham số email." }, { status: 400 });
    }

    const items = await listUserPortfolios(email);
    return Response.json({ ok: true, items });
  } catch (err) {
    console.error("Lỗi khi tải danh sách portfolio của người dùng:", err);
    return Response.json({ error: "Lỗi hệ thống khi tải danh sách portfolio." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id || !email) {
      return Response.json({ error: "Thiếu ID hoặc email xác thực." }, { status: 400 });
    }

    const deleted = await deleteUserPortfolio(id, email);
    if (!deleted) {
      return Response.json({ error: "Không tìm thấy portfolio hoặc không có quyền xóa." }, { status: 404 });
    }

    return Response.json({ ok: true, message: "Đã xóa portfolio thành công." });
  } catch (err) {
    console.error("Lỗi khi xóa portfolio:", err);
    return Response.json({ error: "Lỗi hệ thống khi xóa portfolio." }, { status: 500 });
  }
}
