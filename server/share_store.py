"""
Gen-Folio Shared Portfolio Store
File-based JSON store for temporary shared portfolio links.
Migrated from server.ts to Python, keeping the same data format.
"""

import json
import logging
import os
import secrets
import time
import threading
from typing import Any, Dict, Optional

logger = logging.getLogger("genfolio.share_store")

SHARES_FILE_PATH = os.environ.get(
    "GENFOLIO_SHARES_PATH",
    os.path.join(os.environ.get("TEMP", "/tmp"), "genfolio_shares.json"),
)


class SharedPortfolioStore:
    """Thread-safe in-memory + file-backed store for shared portfolio links."""

    def __init__(self, file_path: str = SHARES_FILE_PATH):
        self._file_path = file_path
        self._store: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()
        self._load_from_disk()
        self._start_cleanup_timer()

    def _load_from_disk(self):
        """Load active shares from JSON file on startup."""
        try:
            if os.path.exists(self._file_path):
                with open(self._file_path, "r", encoding="utf-8") as f:
                    records = json.load(f)
                now = time.time() * 1000  # ms
                for record in records:
                    if record.get("expiresAt", 0) > now:
                        self._store[record["id"]] = record
                logger.info(
                    f"[ShareStore] Loaded {len(self._store)} active shares from disk."
                )
        except Exception as e:
            logger.warning(f"[ShareStore] Could not load shares: {e}")

    def _persist_to_disk(self):
        """Write all shares to JSON file."""
        try:
            records = list(self._store.values())
            with open(self._file_path, "w", encoding="utf-8") as f:
                json.dump(records, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.warning(f"[ShareStore] Could not persist shares: {e}")

    def _start_cleanup_timer(self):
        """Periodic cleanup of expired shares every 15 minutes."""
        def cleanup():
            with self._lock:
                now = time.time() * 1000
                expired = [
                    sid for sid, rec in self._store.items()
                    if rec.get("expiresAt", 0) <= now
                ]
                for sid in expired:
                    del self._store[sid]
                if expired:
                    self._persist_to_disk()
                    logger.info(f"[ShareStore] Cleaned up {len(expired)} expired shares.")
            # Schedule next cleanup
            timer = threading.Timer(15 * 60, cleanup)
            timer.daemon = True
            timer.start()

        timer = threading.Timer(15 * 60, cleanup)
        timer.daemon = True
        timer.start()

    def create(
        self,
        profile: Dict[str, Any],
        concept: str = "terminal",
        primary_color: str = "#10b981",
        expires_in_hours: int = 48,
    ) -> Dict[str, Any]:
        """Create a temporary shareable portfolio link."""
        valid_hours = max(1, min(int(expires_in_hours), 336))  # 1h - 14 days
        now = int(time.time() * 1000)
        expires_at = now + (valid_hours * 60 * 60 * 1000)
        share_id = secrets.token_hex(4)  # 8 hex chars

        record = {
            "id": share_id,
            "profile": profile,
            "concept": concept,
            "primaryColor": primary_color,
            "createdAt": now,
            "expiresAt": expires_at,
            "expiresInHours": valid_hours,
        }

        with self._lock:
            self._store[share_id] = record
            self._persist_to_disk()

        logger.info(
            f"[ShareStore] Created share {share_id} for "
            f"\"{profile.get('fullName', 'Unknown')}\" (expires in {valid_hours}h)"
        )
        return record

    def get(self, share_id: str) -> Optional[Dict[str, Any]]:
        """Get a shared portfolio by ID. Returns None if not found or expired."""
        with self._lock:
            record = self._store.get(share_id)
            if not record:
                return None

            now = int(time.time() * 1000)
            if now > record.get("expiresAt", 0):
                del self._store[share_id]
                self._persist_to_disk()
                return None  # Expired

            return record

    def delete(self, share_id: str) -> bool:
        """Delete/revoke a shared portfolio link."""
        with self._lock:
            if share_id in self._store:
                del self._store[share_id]
                self._persist_to_disk()
                return True
            return False


# Singleton instance
share_store = SharedPortfolioStore()
