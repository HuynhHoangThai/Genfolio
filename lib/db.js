import { Pool } from "pg";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Database configuration
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DB_URL;

let pool = null;
let isPgConnected = null; // null = untried, true = pg connected, false = file fallback
let initPromise = null;

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const PORTFOLIOS_FILE = path.join(DATA_DIR, "portfolios.json");
const SHARES_FILE = process.env.GENFOLIO_SHARES_PATH || path.join(DATA_DIR, "shares.json");

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJsonFile(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return defaultValue;
  }
}

function writeJsonFile(filePath, data) {
  try {
    ensureDirectoryExists(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
    return false;
  }
}

function generateId(prefix = "p") {
  const rand = crypto.randomBytes(6).toString("hex");
  return `${prefix}_${rand}`;
}

async function getPgPool() {
  if (isPgConnected === false) return null;
  if (!connectionString) {
    isPgConnected = false;
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 3000,
      max: 10,
    });
    pool.on("error", (err) => {
      console.warn("Unexpected PostgreSQL client error:", err.message);
    });
  }

  return pool;
}

export async function initDb() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    ensureDirectoryExists(DATA_DIR);

    const pg = await getPgPool();
    if (!pg) {
      isPgConnected = false;
      return false;
    }

    try {
      const client = await pg.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS user_portfolios (
            id VARCHAR(64) PRIMARY KEY,
            user_id VARCHAR(128),
            user_email VARCHAR(255),
            user_name VARCHAR(255),
            title VARCHAR(255),
            template VARCHAR(64) NOT NULL,
            data JSONB NOT NULL,
            is_public BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_user_portfolios_user_email ON user_portfolios(user_email);

          CREATE TABLE IF NOT EXISTS shared_portfolios (
            id VARCHAR(64) PRIMARY KEY,
            portfolio_id VARCHAR(64),
            user_email VARCHAR(255),
            template VARCHAR(64) NOT NULL,
            data JSONB NOT NULL,
            expires_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_shared_portfolios_id ON shared_portfolios(id);
        `);
        isPgConnected = true;
        console.log("PostgreSQL database tables initialized successfully.");
        return true;
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn(
        "Could not connect to PostgreSQL (switching to persistent file-based JSON store):",
        err.message
      );
      isPgConnected = false;
      return false;
    }
  })();

  return initPromise;
}

// -------------------------------------------------------------
// USER PORTFOLIOS OPERATIONS (Lưu trữ và quản lý portfolio của user)
// -------------------------------------------------------------

export async function saveUserPortfolio({
  id = null,
  userId = null,
  userEmail = null,
  userName = null,
  title = null,
  template = "newspaper",
  data = {},
  isPublic = true,
}) {
  await initDb();
  const portfolioId = id || generateId("port");
  const now = new Date().toISOString();
  const portfolioTitle = title || data.name ? `Portfolio của ${data.name}` : `Portfolio ${template.toUpperCase()}`;

  if (isPgConnected) {
    const pg = await getPgPool();
    const query = `
      INSERT INTO user_portfolios (id, user_id, user_email, user_name, title, template, data, is_public, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
      ON CONFLICT (id) DO UPDATE SET
        user_name = COALESCE(EXCLUDED.user_name, user_portfolios.user_name),
        title = EXCLUDED.title,
        template = EXCLUDED.template,
        data = EXCLUDED.data,
        is_public = EXCLUDED.is_public,
        updated_at = EXCLUDED.updated_at
      RETURNING *;
    `;
    const res = await pg.query(query, [
      portfolioId,
      userId,
      userEmail,
      userName,
      portfolioTitle,
      template,
      JSON.stringify(data),
      isPublic,
      now,
    ]);
    return res.rows[0];
  }

  // Fallback to local JSON storage
  const list = readJsonFile(PORTFOLIOS_FILE, []);
  const existingIndex = list.findIndex((item) => item.id === portfolioId);

  const newRecord = {
    id: portfolioId,
    user_id: userId,
    user_email: userEmail,
    user_name: userName,
    title: portfolioTitle,
    template,
    data,
    is_public: isPublic,
    created_at: existingIndex >= 0 ? list[existingIndex].created_at : now,
    updated_at: now,
  };

  if (existingIndex >= 0) {
    list[existingIndex] = { ...list[existingIndex], ...newRecord };
  } else {
    list.unshift(newRecord);
  }

  writeJsonFile(PORTFOLIOS_FILE, list);
  return newRecord;
}

export async function getUserPortfolio(id) {
  if (!id) return null;
  await initDb();

  if (isPgConnected) {
    const pg = await getPgPool();
    const res = await pg.query("SELECT * FROM user_portfolios WHERE id = $1 LIMIT 1;", [id]);
    return res.rows[0] || null;
  }

  const list = readJsonFile(PORTFOLIOS_FILE, []);
  return list.find((item) => item.id === id) || null;
}

export async function listUserPortfolios(userEmail) {
  if (!userEmail) return [];
  await initDb();

  if (isPgConnected) {
    const pg = await getPgPool();
    const res = await pg.query(
      "SELECT id, user_id, user_email, user_name, title, template, is_public, created_at, updated_at, data FROM user_portfolios WHERE user_email = $1 ORDER BY updated_at DESC;",
      [userEmail]
    );
    return res.rows;
  }

  const list = readJsonFile(PORTFOLIOS_FILE, []);
  return list
    .filter((item) => item.user_email?.toLowerCase() === userEmail.toLowerCase())
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

export async function deleteUserPortfolio(id, userEmail) {
  if (!id) return false;
  await initDb();

  if (isPgConnected) {
    const pg = await getPgPool();
    let query = "DELETE FROM user_portfolios WHERE id = $1";
    const params = [id];
    if (userEmail) {
      query += " AND user_email = $2";
      params.push(userEmail);
    }
    const res = await pg.query(query, params);
    return res.rowCount > 0;
  }

  const list = readJsonFile(PORTFOLIOS_FILE, []);
  const nextList = list.filter((item) => {
    if (item.id !== id) return true;
    if (userEmail && item.user_email?.toLowerCase() !== userEmail.toLowerCase()) return true;
    return false;
  });

  if (nextList.length !== list.length) {
    writeJsonFile(PORTFOLIOS_FILE, nextList);
    return true;
  }
  return false;
}

export async function updatePortfolioDeployment({
  id,
  repoName,
  deploymentUrl,
  isPublished = true,
  deployedAt = new Date().toISOString(),
}) {
  await initDb();
  if (isPgConnected) {
    try {
      const pg = await getPgPool();
      if (id) {
        await pg.query(
          "UPDATE user_portfolios SET is_public = $1, updated_at = $2 WHERE id = $3;",
          [isPublished, deployedAt, id]
        );
      } else if (repoName) {
        await pg.query(
          "UPDATE user_portfolios SET is_public = $1, updated_at = $2 WHERE title ILIKE $3;",
          [isPublished, deployedAt, `%${repoName}%`]
        );
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái triển khai trong PostgreSQL:", err);
    }
  } else {
    try {
      const list = readJsonFile(PORTFOLIOS_FILE, []);
      let modified = false;
      const nextList = list.map((item) => {
        const matchesId = id && item.id === id;
        const matchesRepo = repoName && (item.title?.includes(repoName) || item.id === repoName);
        if (matchesId || matchesRepo) {
          modified = true;
          return {
            ...item,
            is_public: isPublished,
            deployment_url: deploymentUrl || item.deployment_url,
            deployed_at: deployedAt,
            updated_at: deployedAt,
          };
        }
        return item;
      });
      if (modified) {
        writeJsonFile(PORTFOLIOS_FILE, nextList);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái triển khai trong tệp cục bộ:", err);
    }
  }
  return { ok: true, deployedAt };
}

// -------------------------------------------------------------
// SHARED PORTFOLIOS OPERATIONS (Chia sẻ liên kết trực tiếp)
// -------------------------------------------------------------

export async function createSharedPortfolio({
  portfolioId = null,
  userEmail = null,
  template = "newspaper",
  data = {},
  expiresInHours = null, // null hoặc 0 nghĩa là vĩnh viễn
}) {
  await initDb();
  const shareId = generateId("sh");
  const now = new Date();
  const expiresAt =
    expiresInHours && expiresInHours > 0
      ? new Date(now.getTime() + expiresInHours * 3600 * 1000).toISOString()
      : null;

  if (isPgConnected) {
    const pg = await getPgPool();
    const query = `
      INSERT INTO shared_portfolios (id, portfolio_id, user_email, template, data, expires_at, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await pg.query(query, [
      shareId,
      portfolioId,
      userEmail,
      template,
      JSON.stringify(data),
      expiresAt,
      now.toISOString(),
    ]);
    return res.rows[0];
  }

  // Fallback to local JSON storage
  const list = readJsonFile(SHARES_FILE, []);
  const newRecord = {
    id: shareId,
    portfolio_id: portfolioId,
    user_email: userEmail,
    template,
    data,
    expires_at: expiresAt,
    created_at: now.toISOString(),
  };

  // Dọn dẹp opportunistically các bản ghi đã hết hạn khi ghi mới
  cleanExpiredSharedPortfolios().catch((err) =>
    console.error("Lỗi dọn dẹp liên kết hết hạn ngầm:", err)
  );

  list.unshift(newRecord);
  writeJsonFile(SHARES_FILE, list);
  return newRecord;
}

export async function cleanExpiredSharedPortfolios() {
  await initDb();
  let deletedCount = 0;

  if (isPgConnected) {
    try {
      const pg = await getPgPool();
      const res = await pg.query(
        "DELETE FROM shared_portfolios WHERE expires_at IS NOT NULL AND expires_at < NOW() RETURNING id;"
      );
      deletedCount = res.rowCount || 0;
    } catch (err) {
      console.error("Lỗi khi xóa shared_portfolios hết hạn trong PostgreSQL:", err);
    }
  } else {
    try {
      const list = readJsonFile(SHARES_FILE, []);
      const nowTime = Date.now();
      const remaining = list.filter((item) => {
        if (!item.expires_at) return true;
        const expireTime = new Date(item.expires_at).getTime();
        return expireTime > nowTime;
      });
      deletedCount = list.length - remaining.length;
      if (deletedCount > 0) {
        writeJsonFile(SHARES_FILE, remaining);
      }
    } catch (err) {
      console.error("Lỗi khi xóa shared_portfolios hết hạn trong tệp cục bộ:", err);
    }
  }

  return { ok: true, deletedCount, cleanedAt: new Date().toISOString() };
}

export async function getSharedPortfolio(id) {
  if (!id) return null;
  await initDb();

  let item = null;

  if (isPgConnected) {
    const pg = await getPgPool();
    const res = await pg.query("SELECT * FROM shared_portfolios WHERE id = $1 LIMIT 1;", [id]);
    item = res.rows[0] || null;

    // Fallback: nếu không tìm thấy trong shared_portfolios, tìm trong user_portfolios với id tương ứng
    if (!item) {
      const userRes = await pg.query(
        "SELECT id, template, data, user_email, created_at, updated_at FROM user_portfolios WHERE id = $1 AND is_public = true LIMIT 1;",
        [id]
      );
      if (userRes.rows[0]) {
        item = {
          ...userRes.rows[0],
          expires_at: null,
        };
      }
    }
  } else {
    const list = readJsonFile(SHARES_FILE, []);
    item = list.find((s) => s.id === id);

    if (!item) {
      const userList = readJsonFile(PORTFOLIOS_FILE, []);
      const userItem = userList.find((p) => p.id === id && p.is_public !== false);
      if (userItem) {
        item = {
          id: userItem.id,
          template: userItem.template,
          data: userItem.data,
          user_email: userItem.user_email,
          created_at: userItem.created_at,
          expires_at: null,
        };
      }
    }
  }

  if (!item) {
    return { notFound: true };
  }

  // Kiểm tra thời hạn hết hạn (PRD 9.1 & 9.2)
  if (item.expires_at) {
    const expireTime = new Date(item.expires_at).getTime();
    if (Date.now() > expireTime) {
      cleanExpiredSharedPortfolios().catch((err) =>
        console.error("Lỗi xóa bản ghi hết hạn khi truy cập:", err)
      );
      return { expired: true, expiresAt: item.expires_at };
    }
  }

  return {
    id: item.id,
    portfolioId: item.portfolio_id || item.id,
    template: item.template,
    data: typeof item.data === "string" ? JSON.parse(item.data) : item.data,
    userEmail: item.user_email,
    createdAt: item.created_at,
    expiresAt: item.expires_at,
  };
}
