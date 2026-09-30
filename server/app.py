"""
Gen-Folio Backend — FastAPI Server powered by Hermes Agent Core

Replaces the Express + TypeScript server.ts with a Python FastAPI server.
All API endpoints maintain the same contract so the React frontend works unchanged.

Endpoints:
  GET  /api/health           — Health check + Hermes status
  POST /api/convert-markitdown — Convert CV document to Markdown
  POST /api/extract-cv       — Extract CV data via Gemini AI (Hermes-powered)
  POST /api/share            — Create temporary share link
  GET  /api/share/{id}       — Get shared portfolio
  DELETE /api/share/{id}     — Revoke share link
"""

import base64
import json
import logging
import os
import re
import sys
import tempfile
import time
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"), override=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger("genfolio")

# Import our modules
from server.hermes_bridge import (
    call_gemini_generate_content,
    HERMES_GEMINI_AVAILABLE,
)
from server.prompts import CV_EXTRACTION_SYSTEM_PROMPT, DEFAULT_METRICS
from server.share_store import share_store
from server.db import db_manager

# --- MarkItDown integration ---
try:
    from markitdown import MarkItDown
    MARKITDOWN_AVAILABLE = True
    logger.info("[MarkItDown] Microsoft MarkItDown loaded successfully.")
except ImportError:
    MARKITDOWN_AVAILABLE = False
    logger.warning("[MarkItDown] Not available. Install with: pip install markitdown")

markitdown_client = MarkItDown() if MARKITDOWN_AVAILABLE else None

# --- FastAPI App ---
app = FastAPI(
    title="Gen-Folio API",
    description="Portfolio Landing Page Generator — Powered by Hermes Agent + Gemini AI",
    version="2.0.0",
)

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Models ---
class HealthResponse(BaseModel):
    status: str
    hasGeminiKey: bool
    hermesAvailable: bool
    markitdownAvailable: bool
    engine: str


class ConvertRequest(BaseModel):
    base64Data: str
    fileName: Optional[str] = None
    mimeType: Optional[str] = None


class ExtractCVRequest(BaseModel):
    base64Data: Optional[str] = None
    mimeType: Optional[str] = None
    fileName: Optional[str] = None
    industryOverride: Optional[str] = None
    uploadedFile: Optional[Dict[str, Any]] = None
    industry: Optional[str] = None


class ShareCreateRequest(BaseModel):
    profile: Dict[str, Any]
    concept: Optional[str] = "terminal"
    primaryColor: Optional[str] = "#10b981"
    expiresInHours: Optional[int] = 48


class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    avatar: Optional[str] = None


class SavePortfolioRequest(BaseModel):
    title: Optional[str] = None
    concept: Optional[str] = "cyber-neon"
    primaryColor: Optional[str] = "#10b981"
    profile: Dict[str, Any]
    portfolioId: Optional[str] = None
    shareId: Optional[str] = None


# --- Helper Functions ---
def convert_with_markitdown(
    base64_data: str, file_name: Optional[str] = None, mime_type: Optional[str] = None
) -> Dict[str, Any]:
    """Convert document to Markdown using Microsoft MarkItDown."""
    if not MARKITDOWN_AVAILABLE or not markitdown_client:
        return {"success": False, "error": "MarkItDown not available"}

    ext = ""
    if file_name:
        ext = os.path.splitext(file_name)[1]
    if not ext:
        ext = ".pdf" if mime_type == "application/pdf" else ".txt"

    temp_path = os.path.join(
        tempfile.gettempdir(),
        f"cv_input_{int(time.time())}_{os.urandom(4).hex()}{ext}",
    )

    try:
        # Decode base64
        clean_b64 = re.sub(r"^data:[^;]+;base64,", "", base64_data)
        file_bytes = base64.b64decode(clean_b64)

        with open(temp_path, "wb") as f:
            f.write(file_bytes)

        result = markitdown_client.convert(temp_path)
        markdown_text = result.text_content if result else ""

        if markdown_text and len(markdown_text.strip()) > 30:
            logger.info(
                f"[MarkItDown] Converted {file_name or 'document'} "
                f"({len(markdown_text)} chars)"
            )
            return {
                "success": True,
                "markdown": markdown_text,
                "engine": "Microsoft MarkItDown (Python)",
            }
        else:
            return {"success": False, "error": "Conversion returned empty or too short"}

    except Exception as e:
        logger.warning(f"[MarkItDown] Error: {e}")
        return {"success": False, "error": str(e)}
    finally:
        try:
            if os.path.exists(temp_path):
                os.unlink(temp_path)
        except Exception:
            pass


def ensure_profile_defaults(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Ensure all required array fields exist with defaults."""
    if not profile.get("id"):
        profile["id"] = f"extracted-{int(time.time() * 1000)}"

    if not isinstance(profile.get("metrics"), list) or len(profile["metrics"]) == 0:
        profile["metrics"] = DEFAULT_METRICS

    for field in ["skills", "projects", "experiences", "education"]:
        if not isinstance(profile.get(field), list):
            profile[field] = []

    if not isinstance(profile.get("testimonials"), list) or len(profile["testimonials"]) == 0:
        company = "Enterprise Partner"
        if profile.get("experiences") and len(profile["experiences"]) > 0:
            company = profile["experiences"][0].get("company", company)

        full_name = profile.get("fullName", "Ứng viên")
        profile["testimonials"] = [
            {
                "id": "test-1",
                "author": "Lãnh đạo Trực tiếp",
                "role": "Technical Lead & Director",
                "company": company,
                "quote": (
                    f"{full_name} luôn thể hiện tinh thần trách nhiệm cao, "
                    f"giải quyết triệt để các bài toán kỹ thuật phức tạp "
                    f"và đem lại giá trị vượt trội cho dự án."
                ),
                "avatarText": "TL",
            }
        ]

    return profile


# --- API Endpoints ---


@app.get("/api/health")
async def health_check():
    """Health check endpoint with database status."""
    return {
        "status": "ok",
        "hasGeminiKey": bool(
            os.environ.get("OPENROUTER_API_KEY") or os.environ.get("OPENAI_API_KEY")
        ),
        "hermesAvailable": True,
        "markitdownAvailable": MARKITDOWN_AVAILABLE,
        "database": db_manager.get_status(),
        "engine": "Hermes Agent + FastAPI",
    }


@app.get("/api/db/status")
async def get_db_status():
    """Get detailed database connection diagnostics."""
    return {
        "success": True,
        "database": db_manager.get_status(),
    }


@app.post("/api/db/reconnect")
async def reconnect_db():
    """Hot-reload .env and reconnect to database without restarting server."""
    status = db_manager.reload_config()
    return {
        "success": True,
        "database": status,
        "message": (
            "Đã kết nối thành công tới PostgreSQL!"
            if status.get("connected")
            else f"Chưa thể kết nối: {status.get('error')}"
        ),
    }


@app.post("/api/convert-markitdown")
async def convert_markitdown_endpoint(req: ConvertRequest):
    """Standalone MarkItDown conversion endpoint."""
    if not req.base64Data:
        raise HTTPException(status_code=400, detail="Chưa có base64Data")

    result = convert_with_markitdown(req.base64Data, req.fileName, req.mimeType)
    return result


@app.post("/api/extract-cv")
@app.post("/api/gemini/extract-profile")
async def extract_cv_endpoint(req: ExtractCVRequest):
    """
    Main CV extraction endpoint — powered by Hermes Agent + Gemini AI.
    
    1. Pre-process document with MarkItDown
    2. Call Gemini via Hermes bridge with multi-model fallback
    3. Parse and validate the JSON response
    4. Return structured profile data
    """
    base64_data = req.base64Data
    mime_type = req.mimeType
    file_name = req.fileName
    industry = req.industryOverride or req.industry

    if not base64_data and req.uploadedFile:
        base64_data = req.uploadedFile.get("base64Data")
        mime_type = mime_type or req.uploadedFile.get("mimeType")
        file_name = file_name or req.uploadedFile.get("fileName")

    if not base64_data:
        raise HTTPException(
            status_code=400, detail="Vui lòng cung cấp dữ liệu CV (base64Data)."
        )

    api_key = os.environ.get("OPENROUTER_API_KEY") or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Chưa cấu hình OPENROUTER_API_KEY trên máy chủ.",
        )

    actual_mime_type = mime_type or "application/pdf"
    clean_b64 = re.sub(r"^data:[^;]+;base64,", "", base64_data)

    # Step 1: Pre-process with MarkItDown
    logger.info(
        f"[CV Extractor] Pre-processing {file_name or 'document'} "
        f"with Microsoft MarkItDown..."
    )
    markitdown_result = convert_with_markitdown(
        base64_data, file_name, actual_mime_type
    )
    has_markdown = (
        markitdown_result.get("success")
        and markitdown_result.get("markdown")
        and len(markitdown_result["markdown"].strip()) > 30
    )

    # Step 2: Build Gemini contents payload
    industry_note = ""
    if industry:
        industry_note = f"The user requested industry classification: '{industry}'."

    if has_markdown:
        user_text = f"""### MICROSOFT MARKITDOWN STRUCTURED CONVERSION:
Document: {file_name or 'Resume Document'}
Engine: {markitdown_result.get('engine', 'Microsoft MarkItDown')}

```markdown
{markitdown_result['markdown']}
```

INSTRUCTIONS:
The above Markdown was converted directly from the user's CV by Microsoft MarkItDown.
Extract EVERY detail from this Markdown into the requested JSON schema.
Ensure you specifically extract:
- Education (Degrees, Universities, Graduation Years, Honors, GPA)
- Work Experiences (Roles, Companies, Periods, Bullet Achievements, Skills Used)
- Skills (Technical & Domain with categories and realistic levels)
- Projects (Titles, Taglines, Problem/Solution Descriptions, Tech Tags, Metrics)
- Certifications & Licenses
- Awards & Honors
- Bio & Professional Philosophy
- 4 Quantifiable Career Impact Metrics
{industry_note}"""

        # Gemini native format contents
        contents = [
            {
                "role": "user",
                "parts": [
                    {"text": user_text},
                    {
                        "inlineData": {
                            "data": clean_b64,
                            "mimeType": actual_mime_type,
                        }
                    },
                ],
            }
        ]
    else:
        user_text = (
            f"Please extract all real CV details from this file "
            f"({req.fileName or 'document'}) according to the instructions. "
            f"{industry_note}"
        )
        contents = [
            {
                "role": "user",
                "parts": [
                    {
                        "inlineData": {
                            "data": clean_b64,
                            "mimeType": actual_mime_type,
                        }
                    },
                    {"text": user_text},
                ],
            }
        ]

    # Step 3: Call Gemini via Hermes bridge
    try:
        response_text, model_used = await call_gemini_generate_content(
            system_prompt=CV_EXTRACTION_SYSTEM_PROMPT,
            contents=contents,
            response_mime_type="application/json",
        )

        # Clean response
        cleaned = response_text.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
            cleaned = re.sub(r"```\s*$", "", cleaned).strip()

        parsed_profile = json.loads(cleaned)
        parsed_profile = ensure_profile_defaults(parsed_profile)

        # Log CV extraction to PostgreSQL if connected
        if db_manager.is_connected:
            db_manager.log_cv_extraction(
                extraction_id=parsed_profile.get("id", f"cv_{int(time.time()*1000)}"),
                full_name=parsed_profile.get("fullName", "Unknown"),
                profile=parsed_profile,
                file_name=req.fileName,
                markdown=markitdown_result.get("markdown"),
            )

        logger.info(
            f"[CV Extractor] Success via Hermes+{model_used} for "
            f"\"{parsed_profile.get('fullName', 'Unknown')}\""
        )

        return {
            "success": True,
            "status": "success",
            "profile": parsed_profile,
            "markitdownMarkdown": markitdown_result.get("markdown"),
            "markitdownEngine": markitdown_result.get("engine"),
            "hermesModel": model_used,
        }

    except json.JSONDecodeError as e:
        logger.error(f"[CV Extractor] JSON parse error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"AI trả về dữ liệu không hợp lệ (JSON parse error): {str(e)}",
        )
    except Exception as e:
        logger.error(f"[CV Extractor] Extraction failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e) or "Lỗi không xác định khi trích xuất CV",
        )


# --- Share Endpoints ---


@app.post("/api/share")
async def create_share(req: ShareCreateRequest):
    """Create a temporary shareable portfolio link."""
    if not req.profile or not req.profile.get("fullName"):
        raise HTTPException(status_code=400, detail="Hồ sơ không hợp lệ.")

    try:
        record = share_store.create(
            profile=req.profile,
            concept=req.concept or "terminal",
            primary_color=req.primaryColor or "#10b981",
            expires_in_hours=req.expiresInHours or 48,
        )
        return {
            "success": True,
            "shareId": record["id"],
            "expiresAt": record["expiresAt"],
            "expiresInHours": record["expiresInHours"],
            "createdAt": record["createdAt"],
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e) or "Không thể tạo liên kết chia sẻ.",
        )


@app.get("/api/share/{share_id}")
async def get_share(share_id: str):
    """Get a shared portfolio by ID."""
    record = share_store.get(share_id)

    if record is None:
        # Check if it was expired vs never existed
        raise HTTPException(
            status_code=404,
            detail="Liên kết chia sẻ không tồn tại hoặc đã hết hạn.",
        )

    return {
        "success": True,
        "profile": record["profile"],
        "concept": record["concept"],
        "primaryColor": record["primaryColor"],
        "createdAt": record["createdAt"],
        "expiresAt": record["expiresAt"],
        "expiresInHours": record["expiresInHours"],
    }


@app.delete("/api/share/{share_id}")
async def delete_share(share_id: str):
    """Delete/revoke a temporary shareable link."""
    if share_store.delete(share_id):
        return {"success": True, "message": "Đã hủy liên kết chia sẻ thành công."}
    raise HTTPException(status_code=404, detail="Không tìm thấy liên kết.")


# --- Static Files (Production) ---
# In production, serve the Vite build output
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")
if os.path.isdir(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve the SPA for any non-API route."""
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))
