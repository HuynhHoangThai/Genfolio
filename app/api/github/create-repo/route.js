// Bước ba: Tạo repository trên tài khoản GitHub của người dùng chứa toàn bộ
// mã nguồn mẫu và dữ liệu portfolio trong một commit duy nhất, đồng thời
// kết nối với hệ thống webhook và bàn giao liên kết triển khai Vercel.

import { cookies } from "next/headers";
import { createRepoWithFallback, commitFiles, getViewer, repoNameFor } from "@/lib/github";
import { DATA_FILE, buildDataFile, readTemplateFiles, supportsHandoff } from "@/lib/templateFiles";
import { sanitizePortfolioData } from "@/lib/portfolioData";
import { GITHUB_TOKEN_COOKIE } from "@/lib/githubSession";
import { updatePortfolioDeployment } from "@/lib/db";

export const maxDuration = 60;

export async function POST(request) {
  // Kiểm tra cấu hình GitHub OAuth trên máy chủ trước tiên
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return Response.json(
      { error: "Chức năng triển khai chưa được thiết lập trên máy chủ. Vui lòng thử lại sau." },
      { status: 503 }
    );
  }

  const jar = await cookies();
  const token = jar.get(GITHUB_TOKEN_COOKIE)?.value;

  if (!token) {
    return Response.json({ needsAuth: true }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }

  const { template, data } = body || {};

  if (typeof template !== "string" || !supportsHandoff(template)) {
    return Response.json({ error: "Mẫu giao diện này hiện chưa hỗ trợ triển khai." }, { status: 400 });
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return Response.json({ error: "Thiếu dữ liệu portfolio." }, { status: 400 });
  }

  const clean = sanitizePortfolioData(data);

  try {
    const viewer = await getViewer(token);

    const repo = await createRepoWithFallback(
      token,
      repoNameFor(clean.name),
      "Trang portfolio cá nhân của tôi được khởi tạo từ Genfolio."
    );

    const files = await readTemplateFiles(template);
    files.push({ path: DATA_FILE, content: buildDataFile(clean), encoding: "utf-8" });

    await commitFiles(
      token,
      viewer.login,
      repo.name,
      repo.default_branch,
      files,
      "Khởi tạo mã nguồn portfolio từ Genfolio"
    );

    // Tự động cấu hình Webhook nếu server có cấu hình secret và base url
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    const origin = request.headers.get("origin");
    const appUrl = process.env.APP_URL || (origin?.startsWith("https://") ? origin : null);
    if (webhookSecret && appUrl) {
      try {
        await fetch(`https://api.github.com/repos/${viewer.login}/${repo.name}/hooks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "web",
            active: true,
            events: ["push", "deployment_status"],
            config: {
              url: `${appUrl}/api/webhooks/github`,
              content_type: "json",
              secret: webhookSecret,
              insecure_ssl: "0",
            },
          }),
        });
      } catch (webhookErr) {
        console.warn("Không thể tự động gán webhook cho repo mới:", webhookErr.message);
      }
    }

    // Ghi nhận sự kiện triển khai vào cơ sở dữ liệu nền
    try {
      await updatePortfolioDeployment({
        repoName: repo.name,
        isPublished: true,
        deployedAt: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn("Lưu trạng thái triển khai nền gặp lỗi:", dbErr.message);
    }

    const deployUrl = new URL("https://vercel.com/new/import");
    deployUrl.searchParams.set("s", repo.html_url);
    deployUrl.searchParams.set("framework", "nextjs");
    deployUrl.searchParams.set("project-name", repo.name);

    return Response.json({
      repoUrl: repo.html_url,
      editUrl: `${repo.html_url}/blob/${repo.default_branch}/${DATA_FILE}`,
      deployUrl: deployUrl.toString(),
      owner: viewer.login,
      repo: repo.name,
      branch: repo.default_branch,
    });
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      jar.delete(GITHUB_TOKEN_COOKIE);
      return Response.json({ needsAuth: true }, { status: 401 });
    }
    console.error(
      "github handoff failed:",
      error.status ?? "no-status",
      error.code ?? error.message ?? "unknown"
    );
    return Response.json(
      { error: "Không thể tạo repository trên GitHub. Vui lòng thử lại." },
      { status: 502 }
    );
  } finally {
    jar.delete(GITHUB_TOKEN_COOKIE);
  }
}
