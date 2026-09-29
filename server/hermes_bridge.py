"""
Gen-Folio Hermes Bridge — OpenRouter Adapter
Uses OpenRouter API (/chat/completions) with OpenAI compatible format.
"""

import asyncio
import json
import logging
import os
import sys
from typing import Any, Dict, List, Optional, Tuple

import httpx
from dotenv import load_dotenv

load_dotenv(override=True)

logger = logging.getLogger("genfolio.hermes_bridge")

# For OpenRouter we don't need Hermes Gemini internals
HERMES_GEMINI_AVAILABLE = False

_API_CLIENT = "genfolio-hermes/1.0"

# Model fallback chain for OpenRouter
MODEL_FALLBACK_CHAIN = [
    {"model": "nvidia/nemotron-3.5-lightning:free", "max_attempts": 3, "delay_base_ms": 1000},
    {"model": "google/gemini-flash-1.5-exp", "max_attempts": 2, "delay_base_ms": 1000},
]

def _get_api_key() -> str:
    key = os.environ.get("OPENROUTER_API_KEY") or os.environ.get("OPENAI_API_KEY") or ""
    return key.strip()

def _get_base_url() -> str:
    raw = os.environ.get("OPENROUTER_BASE_URL", "")
    return raw.strip().rstrip("/") or "https://openrouter.ai/api/v1"

async def call_gemini_generate_content(
    system_prompt: str,
    contents: List[Dict[str, Any]],
    response_mime_type: str = "application/json",
) -> Tuple[str, str]:
    """
    Call OpenRouter API using OpenAI chat/completions format.
    We translate the Gemini `contents` payload to OpenAI `messages` format.
    """
    api_key = _get_api_key()
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not configured. Set it in .env file.")

    base_url = _get_base_url()
    last_error: Optional[Exception] = None

    # Convert Gemini `contents` to OpenAI `messages`
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
        
    for item in contents:
        role = "user" if item.get("role") == "user" else "assistant"
        parts = item.get("parts", [])
        text_content = ""
        for p in parts:
            if "text" in p:
                text_content += p["text"] + "\n"
            # Note: We ignore inlineData (base64 pdf) because OpenRouter text models don't support it,
            # and we already have the MarkItDown text in the prompt.
            
        if text_content.strip():
            messages.append({"role": role, "content": text_content.strip()})

    for config in MODEL_FALLBACK_CHAIN:
        model = config["model"]
        max_attempts = config["max_attempts"]
        delay_base_ms = config["delay_base_ms"]

        for attempt in range(1, max_attempts + 1):
            try:
                logger.info(f"[HermesBridge] Calling OpenRouter model={model} (attempt {attempt}/{max_attempts})")

                payload = {
                    "model": model,
                    "messages": messages,
                    "temperature": 0.1, # Low temperature for JSON extraction
                }
                
                # OpenRouter sometimes supports response_format
                if response_mime_type == "application/json":
                    payload["response_format"] = {"type": "json_object"}

                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Gen-Folio",
                }

                url = f"{base_url}/chat/completions"

                async with httpx.AsyncClient(timeout=120.0) as client:
                    resp = await client.post(url, json=payload, headers=headers)

                if resp.status_code == 404:
                    logger.warning(f"[HermesBridge] Model {model} not found (404), switching.")
                    break

                if resp.status_code == 429:
                    logger.warning(f"[HermesBridge] Rate limited on {model} (429)")
                    if attempt < max_attempts:
                        await asyncio.sleep((delay_base_ms * attempt) / 1000)
                        continue
                    break

                if resp.status_code >= 500:
                    logger.warning(f"[HermesBridge] Server error {resp.status_code} on {model}")
                    if attempt < max_attempts:
                        await asyncio.sleep((delay_base_ms * attempt) / 1000)
                        continue
                    break

                resp.raise_for_status()

                data = resp.json()
                choices = data.get("choices", [])
                if not choices:
                    raise ValueError(f"Model {model} returned no choices")

                response_text = choices[0].get("message", {}).get("content", "").strip()

                if not response_text:
                    raise ValueError(f"Model {model} returned empty text")
                    
                # Clean markdown JSON block if present
                if response_text.startswith("```json"):
                    response_text = response_text[7:]
                if response_text.startswith("```"):
                    response_text = response_text[3:]
                if response_text.endswith("```"):
                    response_text = response_text[:-3]
                response_text = response_text.strip()

                logger.info(f"[HermesBridge] Success with {model} ({len(response_text)} chars)")
                return response_text, model

            except httpx.HTTPStatusError as e:
                last_error = e
                logger.warning(f"[HermesBridge] HTTP error with {model} (attempt {attempt}): {e} - {e.response.text}")
                if attempt < max_attempts:
                    await asyncio.sleep((delay_base_ms * attempt) / 1000)

            except Exception as e:
                last_error = e
                logger.warning(f"[HermesBridge] Error with {model} (attempt {attempt}): {e}")
                if attempt < max_attempts:
                    await asyncio.sleep((delay_base_ms * attempt) / 1000)

    raise last_error or Exception("All models failed. Please check your OpenRouter API key.")
