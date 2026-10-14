import crypto from "node:crypto";
import { updatePortfolioDeployment } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Xác thực chữ ký webhook từ GitHub sử dụng HMAC-SHA256
 */
function verifySignature(payload, signature, secret) {
  if (!secret) {
    // Trong môi trường dev nếu chưa cấu hình secret thì cho phép qua kèm cảnh báo
    return process.env.NODE_ENV !== "production";
  }
  if (!signature) {
    return false;
  }

  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = "sha256=" + hmac.update(payload).digest("hex");
    const sigBuffer = Buffer.from(signature);
    const digestBuffer = Buffer.from(digest);

    if (sigBuffer.length !== digestBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(sigBuffer, digestBuffer);
  } catch (err) {
    console.error("Lỗi khi kiểm tra chữ ký webhook GitHub:", err);
    return false;
  }
}

export async function POST(request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event") || "unknown";

  const rawBody = await request.text();

  if (!verifySignature(rawBody, signature, secret)) {
    return Response.json(
      { error: "Chữ ký webhook GitHub không hợp lệ hoặc bị từ chối." },
      { status: 401 }
    );
  }

  let payload = {};
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return Response.json({ error: "Nội dung webhook không phải JSON hợp lệ." }, { status: 400 });
  }

  const timestamp = new Date().toISOString();

  // 1. Phản hồi sự kiện ping khi cấu hình webhook trên GitHub
  if (event === "ping") {
    return Response.json({
      ok: true,
      event: "ping",
      message: "Webhook đã kết nối thành công với Genfolio.",
      zen: payload.zen,
      hookId: payload.hook_id,
    });
  }

  // 2. Xử lý sự kiện push: commit mới vào repository portfolio
  if (event === "push") {
    const repoName = payload.repository?.name;
    const commitId = payload.head_commit?.id || payload.after;
    const commitMsg = payload.head_commit?.message || "Cập nhật dữ liệu portfolio";
    const commitTime = payload.head_commit?.timestamp || timestamp;

    try {
      await updatePortfolioDeployment({
        repoName,
        isPublished: true,
        deployedAt: commitTime,
      });

      console.log(`[GitHub Webhook] Push event ghi nhận: repo=${repoName}, commit=${commitId?.slice(0, 7)}`);

      return Response.json({
        ok: true,
        event: "push",
        repo: repoName,
        commit: commitId,
        message: commitMsg,
        deployedAt: commitTime,
      });
    } catch (err) {
      console.error("[GitHub Webhook] Lỗi khi xử lý push event:", err);
      return Response.json({ error: "Lỗi xử lý sự kiện push: " + err.message }, { status: 500 });
    }
  }

  // 3. Xử lý sự kiện deployment_status từ Vercel hoặc GitHub Actions
  if (event === "deployment_status") {
    const repoName = payload.repository?.name;
    const state = payload.deployment_status?.state;
    const targetUrl = payload.deployment_status?.target_url || payload.deployment?.payload?.web_url;

    if (state === "success" && targetUrl) {
      try {
        await updatePortfolioDeployment({
          repoName,
          deploymentUrl: targetUrl,
          isPublished: true,
          deployedAt: timestamp,
        });

        console.log(`[GitHub Webhook] Triển khai thành công: repo=${repoName}, url=${targetUrl}`);

        return Response.json({
          ok: true,
          event: "deployment_status",
          state,
          targetUrl,
          message: "Đã cập nhật trạng thái xuất bản thành công từ webhook triển khai.",
        });
      } catch (err) {
        console.error("[GitHub Webhook] Lỗi khi cập nhật deployment_status:", err);
      }
    }

    return Response.json({
      ok: true,
      event: "deployment_status",
      state,
      logged: true,
    });
  }

  // 4. Xử lý sự kiện workflow_run
  if (event === "workflow_run") {
    const workflowName = payload.workflow?.name;
    const conclusion = payload.workflow_run?.conclusion;
    const repoName = payload.repository?.name;

    return Response.json({
      ok: true,
      event: "workflow_run",
      workflow: workflowName,
      conclusion,
      repo: repoName,
    });
  }

  return Response.json({
    ok: true,
    event,
    message: "Sự kiện webhook đã được tiếp nhận và xử lý.",
  });
}
