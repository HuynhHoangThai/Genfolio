// Quản lý trạng thái xuất bản của Portfolio trên hệ thống máy chủ và cơ sở dữ liệu.
import { getSupabaseAdmin } from "./supabase";
import { updatePortfolioDeployment } from "./db";

export async function publishPortfolio(id, deploymentUrl) {
  let hostname;
  try {
    hostname = new URL(deploymentUrl).hostname;
  } catch {
    return { ok: false, error: "Địa chỉ URL triển khai không hợp lệ." };
  }
  if (!hostname.endsWith(".vercel.app")) {
    return { ok: false, error: "URL triển khai phải có định dạng miền Vercel (*.vercel.app)." };
  }

  // Cập nhật vào cơ sở dữ liệu nội bộ (PostgreSQL / Local JSON)
  try {
    await updatePortfolioDeployment({
      id,
      deploymentUrl,
      isPublished: true,
      deployedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Cập nhật trạng thái xuất bản trong cơ sở dữ liệu chính gặp lỗi:", err.message);
  }

  // Cập nhật Supabase nếu có cấu hình
  try {
    const admin = getSupabaseAdmin();
    if (admin) {
      const { error } = await admin
        .from("portfolios")
        .update({ is_published: true, deployment_url: deploymentUrl })
        .eq("id", id);

      if (error) {
        console.warn("publish portfolio supabase warning:", error.message);
      }
    }
  } catch (err) {
    console.warn("Bỏ qua cập nhật Supabase nếu chưa cấu hình:", err.message);
  }

  return { ok: true };
}
