"""
Gen-Folio Hermes Bridge — Gemini Adapter
Uses Hermes Agent's native Gemini adapter to call Google Gemini API
with proper multi-model fallback, error handling, and retry logic.
"""

import asyncio
import json
import logging
import os
import sys
from typing import Any, Dict, List, Optional, Tuple

import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("genfolio.hermes_bridge")

# --- Import Hermes Agent Gemini internals ---
# Add hermes-agent root to sys.path so we can import its modules
HERMES_ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), "hermes-agent")
if HERMES_ROOT not in sys.path:
    sys.path.insert(0, HERMES_ROOT)

# Import the key functions from Hermes' Gemini native adapter
try:
    from agent.gemini_native_adapter import (
        normalize_gemini_base_url,
        bare_gemini_model_id,
        GeminiAPIError,
        DEFAULT_GEMINI_BASE_URL,
        GEMINI_DEFAULT_MAX_OUTPUT_TOKENS,
    )
    HERMES_GEMINI_AVAILABLE = True
    logger.info("[HermesBridge] Hermes Gemini native adapter loaded successfully.")
except ImportError as e:
    HERMES_GEMINI_AVAILABLE = False
    logger.warning(f"[HermesBridge] Could not import Hermes Gemini adapter: {e}. Using standalone httpx.")


# --- Gemini API Client powered by Hermes ---
_API_CLIENT = "genfolio-hermes/1.0"

# Model fallback chain (from PRD section 9.3 & 13)
MODEL_FALLBACK_CHAIN = [
    {"model": "gemini-3.8-flash", "max_attempts": 3, "delay_base_ms": 1000},
    {"model": "gemini-3.1-flash-lite", "max_attempts": 2, "delay_base_ms": 1000},
    {"model": "gemini-flash-latest", "max_attempts": 2, "delay_base_ms": 1200},
]


def _get_api_key() -> str:
    """Resolve Gemini API key from environment (matches Hermes convention)."""
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or ""
    return key.strip()


def _get_base_url() -> str:
    """Resolve Gemini base URL, using Hermes normalization if available."""
    raw = os.environ.get("GEMINI_BASE_URL", "")
    if HERMES_GEMINI_AVAILABLE:
        return normalize_gemini_base_url(raw)
    return raw.strip().rstrip("/") or "https://generativelanguage.googleapis.com/v1beta"


async def call_gemini_generate_content(
    system_prompt: str,
    contents: List[Dict[str, Any]],
    response_mime_type: str = "application/json",
) -> Tuple[str, str]:
    """
    Call Gemini API using Hermes-style native REST with multi-model fallback.
    
    Returns:
        Tuple of (response_text, model_used)
    
    Raises:
        GeminiAPIError or Exception on total failure
    """
    api_key = _get_api_key()
    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY not configured. Set it in .env file or environment."
        )

    base_url = _get_base_url()
    last_error: Optional[Exception] = None

    for config in MODEL_FALLBACK_CHAIN:
        model = config["model"]
        max_attempts = config["max_attempts"]
        delay_base_ms = config["delay_base_ms"]

        for attempt in range(1, max_attempts + 1):
            try:
                logger.info(
                    f"[HermesBridge] Calling Gemini model={model} "
                    f"(attempt {attempt}/{max_attempts})"
                )

                # Build native Gemini generateContent payload
                payload = {
                    "contents": contents,
                    "generationConfig": {
                        "responseMimeType": response_mime_type,
                        "maxOutputTokens": GEMINI_DEFAULT_MAX_OUTPUT_TOKENS
                        if HERMES_GEMINI_AVAILABLE
                        else 65535,
                    },
                    "systemInstruction": {
                        "parts": [{"text": system_prompt}]
                    },
                }

                headers = {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Client": _API_CLIENT,
                }

                url = f"{base_url}/models/{model}:generateContent"
                params = {"key": api_key}

                async with httpx.AsyncClient(timeout=120.0) as client:
                    resp = await client.post(
                        url, params=params, json=payload, headers=headers
                    )

                if resp.status_code == 404:
                    logger.warning(
                        f"[HermesBridge] Model {model} not found (404), "
                        f"switching to next candidate."
                    )
                    break  # Skip to next model

                if resp.status_code == 429:
                    logger.warning(
                        f"[HermesBridge] Rate limited on {model} (429)"
                    )
                    if attempt < max_attempts:
                        wait_ms = delay_base_ms * attempt
                        await asyncio.sleep(wait_ms / 1000)
                        continue
                    break  # Try next model

                if resp.status_code >= 500:
                    logger.warning(
                        f"[HermesBridge] Server error {resp.status_code} on {model}"
                    )
                    if attempt < max_attempts:
                        wait_ms = delay_base_ms * attempt
                        await asyncio.sleep(wait_ms / 1000)
                        continue
                    break

                resp.raise_for_status()

                data = resp.json()
                candidates = data.get("candidates", [])
                if not candidates:
                    raise ValueError(f"Model {model} returned no candidates")

                parts = candidates[0].get("content", {}).get("parts", [])
                text_parts = [p.get("text", "") for p in parts if "text" in p]
                response_text = "".join(text_parts).strip()

                if not response_text:
                    raise ValueError(f"Model {model} returned empty text")

                logger.info(
                    f"[HermesBridge] Success with {model} "
                    f"({len(response_text)} chars)"
                )
                return response_text, model

            except httpx.HTTPStatusError as e:
                last_error = e
                logger.warning(
                    f"[HermesBridge] HTTP error with {model} "
                    f"(attempt {attempt}): {e}"
                )
                if attempt < max_attempts:
                    wait_ms = delay_base_ms * attempt
                    await asyncio.sleep(wait_ms / 1000)

            except Exception as e:
                last_error = e
                logger.warning(
                    f"[HermesBridge] Error with {model} "
                    f"(attempt {attempt}): {e}"
                )
                error_msg = str(e)
                if "NOT_FOUND" in error_msg or "no longer available" in error_msg:
                    break  # Skip to next model
                if attempt < max_attempts:
                    wait_ms = delay_base_ms * attempt
                    await asyncio.sleep(wait_ms / 1000)

    raise last_error or Exception(
        "All Gemini models failed. Please check your API key and try again."
    )
