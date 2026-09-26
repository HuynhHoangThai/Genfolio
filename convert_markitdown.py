import sys
import os
import json

def convert_to_markdown(file_path):
    try:
        from markitdown import MarkItDown
        md = MarkItDown()
        result = md.convert(file_path)
        content = result.text_content if hasattr(result, "text_content") else str(result)
        return {
            "success": True,
            "engine": "microsoft-markitdown",
            "markdown": content,
            "title": getattr(result, "title", None) or os.path.basename(file_path)
        }
    except Exception as e:
        # Fallback 1: If PDF, extract clean text page-by-page using pypdf
        if file_path.lower().endswith(".pdf"):
            try:
                import pypdf
                reader = pypdf.PdfReader(file_path)
                pages_text = []
                for idx, page in enumerate(reader.pages):
                    txt = page.extract_text() or ""
                    if txt.strip():
                        pages_text.append(f"## Section Page {idx+1}\n\n{txt.strip()}")
                if pages_text:
                    return {
                        "success": True,
                        "engine": "markitdown-pypdf-fallback",
                        "markdown": f"# Resume: {os.path.basename(file_path)}\n\n" + "\n\n".join(pages_text),
                        "warning": str(e)
                    }
            except Exception:
                pass

        # Fallback 2: Direct text files (.txt, .md, .csv, .json, .rtf)
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                raw_text = f.read()
            # Only use if text is not binary junk (e.g. no null bytes)
            if raw_text and len(raw_text.strip()) > 20 and "\x00" not in raw_text[:1000]:
                return {
                    "success": True,
                    "engine": "markitdown-text-fallback",
                    "markdown": f"# Document: {os.path.basename(file_path)}\n\n{raw_text}",
                    "warning": str(e)
                }
        except Exception:
            pass
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No input file provided"}))
        sys.exit(1)

    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(json.dumps({"success": False, "error": f"File not found: {file_path}"}))
        sys.exit(1)

    result = convert_to_markdown(file_path)
    print(json.dumps(result, ensure_ascii=False))
