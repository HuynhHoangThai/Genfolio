"""
Gen-Folio Server Runner
Launch script for the FastAPI + Hermes backend.
Usage: python -m server.run
"""
import os
import sys
import uvicorn
from dotenv import load_dotenv

# Load .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))


def main():
    port = int(os.environ.get("PORT", 3000))
    host = os.environ.get("HOST", "0.0.0.0")
    reload_enabled = os.environ.get("NODE_ENV") != "production"

    print(f"""
====================================================
  Gen-Folio Server -- Powered by Hermes Agent
====================================================
  Backend:    FastAPI + Hermes Gemini Bridge
  Frontend:   Vite + React (proxy via Vite dev server)
  API URL:    http://{host}:{port}
  Health:     http://{host}:{port}/api/health
====================================================
""")

    uvicorn.run(
        "server.app:app",
        host=host,
        port=port,
        reload=reload_enabled,
        log_level="info",
    )


if __name__ == "__main__":
    main()
