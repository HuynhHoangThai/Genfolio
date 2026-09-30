"""
Gen-Folio PostgreSQL Database Module
Handles connection pooling, table migrations, and CRUD operations for:
- Shared Portfolios (portfolio_shares)
- CV Extractions history (cv_extractions)
- Real Users Authenticated with Google/Gmail (users)
- User Created Portfolios (user_portfolios)

Provides seamless dual-layer fallback to local JSON file storage if DATABASE_URL
is not set, contains invalid/missing host, or if connection fails.
"""

import json
import logging
import os
import re
import secrets
import threading
import time
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

logger = logging.getLogger("genfolio.db")

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor, Json
    from psycopg2.pool import ThreadedConnectionPool
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False
    logger.warning("[Database] psycopg2-binary not installed. PostgreSQL features disabled.")

# File paths for JSON fallback mode
TEMP_DIR = os.environ.get("TEMP", os.environ.get("TMP", "/tmp"))
LOCAL_USERS_FILE = os.path.join(TEMP_DIR, "genfolio_users.json")
LOCAL_PORTFOLIOS_FILE = os.path.join(TEMP_DIR, "genfolio_user_portfolios.json")


class DatabaseManager:
    """Manages PostgreSQL connection and operations with graceful JSON file fallback."""

    def __init__(self):
        self._pool: Optional[Any] = None
        self._is_connected = False
        self._error_msg: Optional[str] = None
        self._parsed_info: Dict[str, Any] = {}
        self._lock = threading.Lock()

        # Local fallback in-memory stores
        self._local_users: Dict[str, Dict[str, Any]] = {}
        self._local_portfolios: Dict[str, Dict[str, Any]] = {}

        self._load_local_storage()
        self.init_db()

    def _load_local_storage(self):
        """Load JSON fallback data from disk."""
        try:
            if os.path.exists(LOCAL_USERS_FILE):
                with open(LOCAL_USERS_FILE, "r", encoding="utf-8") as f:
                    self._local_users = json.load(f)
            if os.path.exists(LOCAL_PORTFOLIOS_FILE):
                with open(LOCAL_PORTFOLIOS_FILE, "r", encoding="utf-8") as f:
                    self._local_portfolios = json.load(f)
        except Exception as e:
            logger.warning(f"[Database] Could not load local fallback storage: {e}")

    def _persist_local_storage(self):
        """Persist JSON fallback data to disk."""
        try:
            with open(LOCAL_USERS_FILE, "w", encoding="utf-8") as f:
                json.dump(self._local_users, f, indent=2, ensure_ascii=False)
            with open(LOCAL_PORTFOLIOS_FILE, "w", encoding="utf-8") as f:
                json.dump(self._local_portfolios, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.warning(f"[Database] Could not persist local fallback storage: {e}")

    def _parse_database_url(self, url: str) -> Dict[str, Any]:
        """Validate and parse database connection string."""
        if not url:
            return {"valid": False, "reason": "DATABASE_URL is empty"}

        match = re.search(r"@([^:/]+)?:?(\d+)?/", url)
        if match:
            host, port = match.group(1), match.group(2)
            if not host or port == "0":
                return {
                    "valid": False,
                    "reason": "Host is missing or port is 0 (@:0). Please specify actual host and port.",
                    "host": host or "",
                    "port": port or "0",
                }

        try:
            parsed = urlparse(url)
            if not parsed.hostname or parsed.port == 0:
                return {
                    "valid": False,
                    "reason": "Host is empty or port is 0. Please update DATABASE_URL in .env",
                    "host": parsed.hostname or "",
                    "port": parsed.port or 0,
                }
            return {
                "valid": True,
                "host": parsed.hostname,
                "port": parsed.port or 5432,
                "database": parsed.path.lstrip("/"),
                "username": parsed.username or "",
            }
        except Exception as e:
            return {"valid": False, "reason": f"URL parse error: {e}"}

    def reload_config(self) -> Dict[str, Any]:
        """Reload .env and reconnect to database."""
        env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        load_dotenv(env_path, override=True)
        if self._pool:
            try:
                self._pool.closeall()
            except Exception:
                pass
            self._pool = None
        self._is_connected = False
        self.init_db()
        return self.get_status()

    def init_db(self):
        """Initialize database connection pool and create tables if configured."""
        if not PSYCOPG2_AVAILABLE:
            self._error_msg = "psycopg2-binary not installed"
            return

        db_url = os.environ.get("DATABASE_URL", "").strip()
        if not db_url:
            self._error_msg = "DATABASE_URL not configured in environment"
            logger.info("[Database] DATABASE_URL not set. Running with local JSON store.")
            return

        self._parsed_info = self._parse_database_url(db_url)
        if not self._parsed_info.get("valid"):
            self._error_msg = self._parsed_info.get("reason")
            logger.warning(
                f"[Database] DATABASE_URL configuration issue: {self._error_msg}. "
                "Backend will use local JSON store until host is updated in .env."
            )
            return

        try:
            self._pool = ThreadedConnectionPool(
                minconn=1,
                maxconn=10,
                dsn=db_url,
                connect_timeout=4,
            )
            self._create_tables()
            self._is_connected = True
            self._error_msg = None
            logger.info(
                f"[Database] Successfully connected to PostgreSQL at "
                f"{self._parsed_info.get('host')}:{self._parsed_info.get('port')}/"
                f"{self._parsed_info.get('database')}"
            )
        except Exception as e:
            self._is_connected = False
            self._error_msg = str(e)
            logger.warning(
                f"[Database] Could not connect to PostgreSQL: {e}. "
                "Operating in fallback JSON file mode."
            )

    def _create_tables(self):
        """Auto-create tables for users, user portfolios, shared portfolios, and CV archives."""
        if not self._pool:
            return
        conn = self._pool.getconn()
        try:
            with conn.cursor() as cur:
                # 1. Users table (Google / Gmail auth)
                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS users (
                        id VARCHAR(128) PRIMARY KEY,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        name VARCHAR(255) NOT NULL,
                        avatar VARCHAR(1024),
                        provider VARCHAR(32) DEFAULT 'google',
                        created_at BIGINT NOT NULL,
                        last_login_at BIGINT NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
                    """
                )

                # 2. User Created Portfolios table
                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS user_portfolios (
                        id VARCHAR(64) PRIMARY KEY,
                        user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        title VARCHAR(255) NOT NULL,
                        concept VARCHAR(64) NOT NULL DEFAULT 'cyber-neon',
                        primary_color VARCHAR(32) NOT NULL DEFAULT '#10b981',
                        profile JSONB NOT NULL,
                        is_public BOOLEAN DEFAULT true,
                        share_id VARCHAR(64),
                        created_at BIGINT NOT NULL,
                        updated_at BIGINT NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS idx_user_portfolios_user ON user_portfolios (user_id);
                    CREATE INDEX IF NOT EXISTS idx_user_portfolios_updated ON user_portfolios (updated_at DESC);
                    """
                )

                # 3. Shared portfolios table
                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS portfolio_shares (
                        id VARCHAR(64) PRIMARY KEY,
                        profile JSONB NOT NULL,
                        concept VARCHAR(64) NOT NULL DEFAULT 'terminal',
                        primary_color VARCHAR(32) NOT NULL DEFAULT '#10b981',
                        created_at BIGINT NOT NULL,
                        expires_at BIGINT NOT NULL,
                        expires_in_hours INT NOT NULL DEFAULT 48
                    );
                    CREATE INDEX IF NOT EXISTS idx_portfolio_shares_expires
                        ON portfolio_shares (expires_at);
                    """
                )

                # 4. CV extractions table
                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS cv_extractions (
                        id VARCHAR(64) PRIMARY KEY,
                        full_name VARCHAR(255),
                        profile JSONB NOT NULL,
                        file_name VARCHAR(255),
                        markdown TEXT,
                        created_at BIGINT NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS idx_cv_extractions_created
                        ON cv_extractions (created_at DESC);
                    """
                )
                conn.commit()
            logger.info("[Database] All PostgreSQL tables (users, user_portfolios, shares, cv) initialized.")
        finally:
            self._pool.putconn(conn)

    @property
    def is_connected(self) -> bool:
        return self._is_connected

    def get_status(self) -> Dict[str, Any]:
        """Return diagnostic status for health check."""
        return {
            "driver": "psycopg2-binary" if PSYCOPG2_AVAILABLE else "missing",
            "connected": self._is_connected,
            "error": self._error_msg,
            "host": self._parsed_info.get("host") or "not_configured",
            "port": self._parsed_info.get("port") or 0,
            "database": self._parsed_info.get("database") or "none",
            "mode": "postgresql" if self._is_connected else "json_file_fallback",
            "localUsersCount": len(self._local_users),
            "localPortfoliosCount": len(self._local_portfolios),
        }

    # ==========================================
    # USER AUTHENTICATION & PROFILE METHODS
    # ==========================================

    def upsert_user(
        self,
        email: str,
        name: str,
        avatar: Optional[str] = None,
        google_sub: Optional[str] = None,
        provider: str = "google",
    ) -> Dict[str, Any]:
        """Insert or update user upon Google/Gmail authentication."""
        now = int(time.time() * 1000)
        user_id = google_sub or f"usr_{secrets.token_hex(8)}"

        # 1. PostgreSQL storage
        if self._is_connected and self._pool:
            conn = self._pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        """
                        INSERT INTO users (id, email, name, avatar, provider, created_at, last_login_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (email) DO UPDATE SET
                            name = EXCLUDED.name,
                            avatar = COALESCE(EXCLUDED.avatar, users.avatar),
                            last_login_at = EXCLUDED.last_login_at
                        RETURNING id, email, name, avatar, provider, created_at AS "createdAt", last_login_at AS "lastLoginAt";
                        """,
                        (user_id, email.lower().strip(), name, avatar, provider, now, now),
                    )
                    user_record = dict(cur.fetchone())
                    conn.commit()
                    return user_record
            except Exception as e:
                logger.error(f"[Database] Postgres upsert_user error: {e}")
            finally:
                self._pool.putconn(conn)

        # 2. Local fallback storage
        with self._lock:
            # Check existing by email
            clean_email = email.lower().strip()
            existing_id = None
            for uid, u in self._local_users.items():
                if u.get("email") == clean_email:
                    existing_id = uid
                    break

            if existing_id:
                user_record = self._local_users[existing_id]
                user_record["name"] = name
                if avatar:
                    user_record["avatar"] = avatar
                user_record["lastLoginAt"] = now
            else:
                user_record = {
                    "id": user_id,
                    "email": clean_email,
                    "name": name,
                    "avatar": avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={clean_email}",
                    "provider": provider,
                    "createdAt": now,
                    "lastLoginAt": now,
                }
                self._local_users[user_id] = user_record

            self._persist_local_storage()
            return user_record

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve user by ID."""
        if self._is_connected and self._pool:
            conn = self._pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        """
                        SELECT id, email, name, avatar, provider, created_at AS "createdAt", last_login_at AS "lastLoginAt"
                        FROM users WHERE id = %s;
                        """,
                        (user_id,),
                    )
                    row = cur.fetchone()
                    if row:
                        return dict(row)
            except Exception as e:
                logger.error(f"[Database] Postgres get_user_by_id error: {e}")
            finally:
                self._pool.putconn(conn)

        with self._lock:
            return self._local_users.get(user_id)

    # ==========================================
    # USER CREATED PORTFOLIOS METHODS
    # ==========================================

    def save_user_portfolio(
        self,
        user_id: str,
        title: str,
        profile: Dict[str, Any],
        concept: str = "cyber-neon",
        primary_color: str = "#10b981",
        portfolio_id: Optional[str] = None,
        share_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Save or update a portfolio belonging to a user."""
        now = int(time.time() * 1000)
        p_id = portfolio_id or f"port_{secrets.token_hex(6)}"

        record = {
            "id": p_id,
            "userId": user_id,
            "title": title or profile.get("fullName", "My Portfolio"),
            "concept": concept,
            "primaryColor": primary_color,
            "profile": profile,
            "isPublic": True,
            "shareId": share_id,
            "createdAt": now,
            "updatedAt": now,
        }

        # 1. PostgreSQL storage
        if self._is_connected and self._pool:
            conn = self._pool.getconn()
            try:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO user_portfolios (
                            id, user_id, title, concept, primary_color, profile, is_public, share_id, created_at, updated_at
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET
                            title = EXCLUDED.title,
                            concept = EXCLUDED.concept,
                            primary_color = EXCLUDED.primary_color,
                            profile = EXCLUDED.profile,
                            share_id = COALESCE(EXCLUDED.share_id, user_portfolios.share_id),
                            updated_at = EXCLUDED.updated_at;
                        """,
                        (
                            p_id,
                            user_id,
                            record["title"],
                            concept,
                            primary_color,
                            Json(profile),
                            True,
                            share_id,
                            now,
                            now,
                        ),
                    )
                    conn.commit()
                    return record
            except Exception as e:
                logger.error(f"[Database] Postgres save_user_portfolio error: {e}")
            finally:
                self._pool.putconn(conn)

        # 2. Local fallback storage
        with self._lock:
            if p_id in self._local_portfolios:
                record["createdAt"] = self._local_portfolios[p_id].get("createdAt", now)
            self._local_portfolios[p_id] = record
            self._persist_local_storage()
            return record

    def list_user_portfolios(self, user_id: str) -> List[Dict[str, Any]]:
        """List all portfolios owned by the specified user."""
        if self._is_connected and self._pool:
            conn = self._pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        """
                        SELECT id, user_id AS "userId", title, concept, primary_color AS "primaryColor",
                               profile, is_public AS "isPublic", share_id AS "shareId",
                               created_at AS "createdAt", updated_at AS "updatedAt"
                        FROM user_portfolios
                        WHERE user_id = %s
                        ORDER BY updated_at DESC;
                        """,
                        (user_id,),
                    )
                    rows = cur.fetchall()
                    return [dict(r) for r in rows]
            except Exception as e:
                logger.error(f"[Database] Postgres list_user_portfolios error: {e}")
            finally:
                self._pool.putconn(conn)

        with self._lock:
            results = [
                p for p in self._local_portfolios.values()
                if p.get("userId") == user_id
            ]
            results.sort(key=lambda x: x.get("updatedAt", 0), reverse=True)
            return results

    def get_user_portfolio(self, user_id: str, portfolio_id: str) -> Optional[Dict[str, Any]]:
        """Get a single user portfolio by ID."""
        if self._is_connected and self._pool:
            conn = self._pool.getconn()
            try:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        """
                        SELECT id, user_id AS "userId", title, concept, primary_color AS "primaryColor",
                               profile, is_public AS "isPublic", share_id AS "shareId",
                               created_at AS "createdAt", updated_at AS "updatedAt"
                        FROM user_portfolios
                        WHERE id = %s AND user_id = %s;
                        """,
                        (portfolio_id, user_id),
                    )
                    row = cur.fetchone()
                    if row:
                        return dict(row)
            except Exception as e:
                logger.error(f"[Database] Postgres get_user_portfolio error: {e}")
            finally:
                self._pool.putconn(conn)

        with self._lock:
            p = self._local_portfolios.get(portfolio_id)
            if p and p.get("userId") == user_id:
                return p
            return None

    def delete_user_portfolio(self, user_id: str, portfolio_id: str) -> bool:
        """Delete a user portfolio."""
        deleted_pg = False
        if self._is_connected and self._pool:
            conn = self._pool.getconn()
            try:
                with conn.cursor() as cur:
                    cur.execute(
                        "DELETE FROM user_portfolios WHERE id = %s AND user_id = %s;",
                        (portfolio_id, user_id),
                    )
                    conn.commit()
                    deleted_pg = cur.rowcount > 0
            except Exception as e:
                logger.error(f"[Database] Postgres delete_user_portfolio error: {e}")
            finally:
                self._pool.putconn(conn)

        deleted_local = False
        with self._lock:
            if portfolio_id in self._local_portfolios:
                p = self._local_portfolios[portfolio_id]
                if p.get("userId") == user_id:
                    del self._local_portfolios[portfolio_id]
                    self._persist_local_storage()
                    deleted_local = True

        return deleted_pg or deleted_local

    # ==========================================
    # SHARED PORTFOLIOS (TEMPORARY 24H-48H)
    # ==========================================

    def save_share(self, record: Dict[str, Any]) -> bool:
        """Insert or update a temporary share record in PostgreSQL."""
        if not self._is_connected or not self._pool:
            return False
        conn = self._pool.getconn()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO portfolio_shares (
                        id, profile, concept, primary_color, created_at, expires_at, expires_in_hours
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        profile = EXCLUDED.profile,
                        concept = EXCLUDED.concept,
                        primary_color = EXCLUDED.primary_color,
                        expires_at = EXCLUDED.expires_at,
                        expires_in_hours = EXCLUDED.expires_in_hours;
                    """,
                    (
                        record["id"],
                        Json(record["profile"]),
                        record.get("concept", "terminal"),
                        record.get("primaryColor", "#10b981"),
                        record.get("createdAt", int(time.time() * 1000)),
                        record.get("expiresAt", 0),
                        record.get("expiresInHours", 48),
                    ),
                )
                conn.commit()
            return True
        except Exception as e:
            logger.error(f"[Database] Error saving share {record.get('id')}: {e}")
            return False
        finally:
            self._pool.putconn(conn)

    def get_share(self, share_id: str) -> Optional[Dict[str, Any]]:
        """Get an unexpired share record from PostgreSQL."""
        if not self._is_connected or not self._pool:
            return None
        conn = self._pool.getconn()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                now = int(time.time() * 1000)
                cur.execute(
                    """
                    SELECT id, profile, concept, primary_color AS "primaryColor",
                           created_at AS "createdAt", expires_at AS "expiresAt",
                           expires_in_hours AS "expiresInHours"
                    FROM portfolio_shares
                    WHERE id = %s AND expires_at > %s;
                    """,
                    (share_id, now),
                )
                row = cur.fetchone()
                return dict(row) if row else None
        except Exception as e:
            logger.error(f"[Database] Error getting share {share_id}: {e}")
            return None
        finally:
            self._pool.putconn(conn)

    def delete_share(self, share_id: str) -> bool:
        """Delete a share record from PostgreSQL."""
        if not self._is_connected or not self._pool:
            return False
        conn = self._pool.getconn()
        try:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM portfolio_shares WHERE id = %s;", (share_id,))
                conn.commit()
                return cur.rowcount > 0
        except Exception as e:
            logger.error(f"[Database] Error deleting share {share_id}: {e}")
            return False
        finally:
            self._pool.putconn(conn)

    def cleanup_expired(self) -> int:
        """Remove expired temporary records."""
        if not self._is_connected or not self._pool:
            return 0
        conn = self._pool.getconn()
        try:
            with conn.cursor() as cur:
                now = int(time.time() * 1000)
                cur.execute("DELETE FROM portfolio_shares WHERE expires_at <= %s;", (now,))
                deleted = cur.rowcount
                conn.commit()
                return deleted
        except Exception as e:
            logger.error(f"[Database] Cleanup error: {e}")
            return 0
        finally:
            self._pool.putconn(conn)

    # ==========================================
    # CV EXTRACTION HISTORY
    # ==========================================

    def log_cv_extraction(
        self,
        extraction_id: str,
        full_name: str,
        profile: Dict[str, Any],
        file_name: Optional[str] = None,
        markdown: Optional[str] = None,
    ) -> bool:
        """Archive an extracted CV for audit and history."""
        if not self._is_connected or not self._pool:
            return False
        conn = self._pool.getconn()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO cv_extractions (
                        id, full_name, profile, file_name, markdown, created_at
                    ) VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO NOTHING;
                    """,
                    (
                        extraction_id,
                        full_name,
                        Json(profile),
                        file_name or "uploaded_cv",
                        markdown or "",
                        int(time.time() * 1000),
                    ),
                )
                conn.commit()
            return True
        except Exception as e:
            logger.warning(f"[Database] Error logging CV extraction: {e}")
            return False
        finally:
            self._pool.putconn(conn)


# Global singleton database manager
db_manager = DatabaseManager()
