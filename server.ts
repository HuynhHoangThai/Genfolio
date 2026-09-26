import express from 'express';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Helper: Convert document to Markdown using Microsoft MarkItDown (Python)
async function convertWithMarkItDown(base64Data: string, fileName?: string, mimeType?: string): Promise<{ success: boolean; markdown?: string; engine?: string; error?: string }> {
  const ext = (fileName && path.extname(fileName)) || (mimeType === 'application/pdf' ? '.pdf' : '.txt');
  const tempPath = path.join('/tmp', `cv_input_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`);
  
  try {
    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    fs.writeFileSync(tempPath, buffer);

    const scriptPath = path.join(__dirname, 'convert_markitdown.py');
    const { stdout } = await execFileAsync('python3', [scriptPath, tempPath], {
      timeout: 20000,
      maxBuffer: 10 * 1024 * 1024,
    });

    const parsed = JSON.parse(stdout.trim());
    if (parsed.success && parsed.markdown) {
      console.log(`[MarkItDown] Successfully converted ${fileName || 'document'} to Markdown (${parsed.markdown.length} chars) using ${parsed.engine}`);
      return { success: true, markdown: parsed.markdown, engine: parsed.engine };
    } else {
      console.warn('[MarkItDown] Conversion returned failure or empty:', parsed.error);
      return { success: false, error: parsed.error };
    }
  } catch (err: any) {
    console.warn('[MarkItDown] Execution error:', err?.message || err);
    return { success: false, error: err?.message || String(err) };
  } finally {
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch {
      // Ignore cleanup error
    }
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// Standalone MarkItDown conversion endpoint
app.post('/api/convert-markitdown', async (req, res) => {
  try {
    const { base64Data, fileName, mimeType } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, error: 'Chưa có base64Data' });
    }
    const result = await convertWithMarkItDown(base64Data, fileName, mimeType);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Lỗi chuyển đổi MarkItDown' });
  }
});

// Extraction endpoint using Gemini Flash
app.post('/api/extract-cv', async (req, res) => {
  try {
    const { base64Data, mimeType, fileName, industryOverride } = req.body;

    if (!base64Data) {
      return res.status(400).json({ error: 'Vui lòng cung cấp dữ liệu CV (base64Data).' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra cấu hình Secrets.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const actualMimeType = mimeType || 'application/pdf';

    const systemPrompt = `You are a world-class Executive Resume Parser & Portfolio Architect.
Your task is to analyze the provided CV/Resume document and extract ALL real candidate data into a rich, structured JSON object for a personal landing page portfolio.

Requirements:
1. ACCURACY: Extract the real full name, real contact info, real companies, real dates, real degrees, real projects, and real achievements found in the document.
2. INDUSTRY CLASSIFICATION:
   - Determine whether the candidate belongs to:
     * 'tech': Software Engineer, DevOps, Full-stack, Mobile, Frontend, Backend, Architect, QA, AI/ML, Data Engineer, System Admin, etc.
     * 'creative': UI/UX Designer, Product Designer, Art Director, Graphic Designer, Branding, 3D Artist, Illustrator, etc.
     * 'business': Sales Director, Account Executive, GTM Lead, Marketing Manager, CEO, Founder, HR, Operations, Finance, Product/Project Manager, Consultant, etc.
   - If industryOverride is specified ('tech', 'creative', or 'business'), honor it. Otherwise, classify automatically based on their career profile.
3. QUANTIFIABLE METRICS:
   - Extract or formulate 4 key metrics that capture their impact (e.g. years of experience, projects delivered, revenue generated, team size, SLA uptime, user base, etc.).
4. RICH EXPANSION:
   - For skills: list all concrete technical/domain skills extracted, with level (70-98), realistic category, and highlight: true for the top 4.
   - For projects: include all projects/accomplishments stated in the CV. Formulate clear titles, problem/solution taglines, descriptions, and technology tags.
   - For experiences: list roles chronologically, with company name, location, time period, clear description, bullet achievements, and skills used.
   - For testimonials: formulate 2 realistic peer/executive endorsements reflecting their true strengths and work style.

CRITICAL: Return ONLY a valid JSON object matching the exact schema below, without any markdown code blocks or additional text.

JSON Schema:
{
  "id": "string",
  "industry": "tech" | "creative" | "business",
  "fullName": "string",
  "title": "string",
  "tagline": "string",
  "bio": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "socials": {
    "github": "string (optional)",
    "linkedin": "string (optional)",
    "behance": "string (optional)",
    "dribbble": "string (optional)",
    "twitter": "string (optional)",
    "website": "string (optional)"
  },
  "metrics": [
    { "value": "string", "label": "string", "change": "string (optional)", "subtext": "string (optional)" }
  ],
  "skills": [
    { "name": "string", "level": number (1-100), "category": "string", "highlight": boolean }
  ],
  "projects": [
    {
      "id": "string",
      "title": "string",
      "tagline": "string",
      "description": "string",
      "category": "string",
      "year": "string",
      "metrics": [{ "label": "string", "value": "string" }],
      "tags": ["string"],
      "link": "string (optional)",
      "github": "string (optional)",
      "featured": boolean
    }
  ],
  "experiences": [
    {
      "id": "string",
      "role": "string",
      "company": "string",
      "period": "string",
      "location": "string",
      "description": "string",
      "achievements": ["string"],
      "skillsUsed": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string",
      "honors": "string (optional)"
    }
  ],
  "testimonials": [
    {
      "id": "string",
      "author": "string",
      "role": "string",
      "company": "string",
      "quote": "string",
      "avatarText": "string"
    }
  ],
  "awards": ["string (optional)"],
  "certifications": ["string (optional)"],
  "philosophy": "string (optional)"
}`;

    // Step 1: Pre-process document using Microsoft MarkItDown
    console.log(`[CV Extractor] Pre-processing ${fileName || 'document'} with Microsoft MarkItDown...`);
    const markitdownResult = await convertWithMarkItDown(base64Data, fileName, actualMimeType);
    const hasMarkItDownText = markitdownResult.success && !!markitdownResult.markdown && markitdownResult.markdown.trim().length > 30;

    let userPromptContent = '';
    if (hasMarkItDownText) {
      userPromptContent = `### MICROSOFT MARKITDOWN STRUCTURED CONVERSION:
Document: ${fileName || 'Resume Document'}
Engine: ${markitdownResult.engine || 'Microsoft MarkItDown'}

\`\`\`markdown
${markitdownResult.markdown}
\`\`\`

INSTRUCTIONS:
The above Markdown was converted directly from the user's CV by Microsoft MarkItDown.
Extract EVERY detail from this Markdown into the requested JSON schema.
Ensure you specifically extract:
- Education (Degrees, Universities, Graduation Years, Honors, GPA)
- Work Experiences (Roles, Companies, Periods, Bullet Achievements, Skills Used)
- Skills (Technical & Domain with categories and realistic levels)
- Projects (Titles, Taglines, Problem/Solution Descriptions, Tech Tags, Metrics)
- Certifications & Licenses (e.g. AWS, CKA, PMI, Google Cloud, Scrum, etc.)
- Awards & Honors (Hackathon, Dean's List, Red Dot, Awwwards, Corporate awards)
- Bio & Professional Philosophy/Manifesto
- 4 Quantifiable Career Impact Metrics
${industryOverride ? `The user requested industry classification: '${industryOverride}'.` : ''}`;
    } else {
      userPromptContent = `Please extract all real CV details from this file (${fileName || 'document'}) according to the instructions. ${
        industryOverride ? `The user explicitly requested industry: ${industryOverride}.` : ''
      }`;
    }

    // Build Gemini contents payload: include Markdown text and/or inlineData
    const contentsPayload: any[] = [];
    if (hasMarkItDownText) {
      contentsPayload.push(userPromptContent);
      // Also provide inlineData for multimodal validation
      contentsPayload.push({
        inlineData: {
          data: cleanBase64,
          mimeType: actualMimeType,
        },
      });
    } else {
      contentsPayload.push(
        {
          inlineData: {
            data: cleanBase64,
            mimeType: actualMimeType,
          },
        },
        userPromptContent
      );
    }

    // Use current active models; 'gemini-3.8-flash' is the official primary model
    const candidateConfigs = [
      { model: 'gemini-3.8-flash', maxAttempts: 3, delayBaseMs: 1000 },
      { model: 'gemini-3.1-flash-lite', maxAttempts: 2, delayBaseMs: 1000 },
      { model: 'gemini-flash-latest', maxAttempts: 2, delayBaseMs: 1200 },
    ];

    let lastError: Error | null = null;
    let parsedProfile = null;

    outerLoop: for (const config of candidateConfigs) {
      for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
          console.log(`[CV Extractor] Attempting extraction with model: ${config.model} (attempt ${attempt}/${config.maxAttempts})`);

          const response = await ai.models.generateContent({
            model: config.model,
            contents: contentsPayload,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
            },
          });

          const responseText = response.text || '';
          if (!responseText) {
            throw new Error(`Model ${config.model} returned empty text`);
          }

          let cleaned = responseText.trim();
          if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
          }

          parsedProfile = JSON.parse(cleaned);
          console.log(`[CV Extractor] Successfully extracted CV using ${config.model} for ${parsedProfile.fullName || 'Candidate'}`);
          break outerLoop; // Success! Break out of both loops
        } catch (err: any) {
          console.warn(`[CV Extractor] Error with ${config.model} (attempt ${attempt}):`, err?.message || err);
          lastError = err;

          const errorMsg = String(err?.message || '');
          const status = err?.status || err?.code;

          // If it's a 404 NOT_FOUND, do not retry this model - immediately proceed to next candidate
          if (status === 404 || errorMsg.includes('NOT_FOUND') || errorMsg.includes('no longer available')) {
            console.log(`[CV Extractor] Model ${config.model} not available, switching immediately to next candidate.`);
            break;
          }

          // For 503 temporary overload or 429 rate limit, wait with backoff before retrying
          if (attempt < config.maxAttempts) {
            const waitTime = config.delayBaseMs * attempt;
            console.log(`[CV Extractor] Waiting ${waitTime}ms before retry...`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          }
        }
      }
    }

    if (!parsedProfile) {
      throw lastError || new Error('Không thể kết nối đến các model AI hiện tại. Vui lòng thử lại.');
    }

    // Fallback ID if not generated
    if (!parsedProfile.id) {
      parsedProfile.id = `extracted-${Date.now()}`;
    }

    // Ensure array structures exist
    if (!Array.isArray(parsedProfile.metrics) || parsedProfile.metrics.length === 0) {
      parsedProfile.metrics = [
        { value: '5+ năm', label: 'Kinh nghiệm chuyên môn', subtext: 'Thực chiến dự án' },
        { value: '100%', label: 'Cam kết chất lượng SLA', subtext: 'Chuẩn quy trình doanh nghiệp' },
        { value: '20+', label: 'Dự án & Tính năng', subtext: 'Đã triển khai thành công' },
        { value: 'Top 5%', label: 'Năng lực cốt lõi', subtext: 'Đánh giá năng lực chuyên sâu' },
      ];
    }
    if (!Array.isArray(parsedProfile.skills)) {
      parsedProfile.skills = [];
    }
    if (!Array.isArray(parsedProfile.projects)) {
      parsedProfile.projects = [];
    }
    if (!Array.isArray(parsedProfile.experiences)) {
      parsedProfile.experiences = [];
    }
    if (!Array.isArray(parsedProfile.education)) {
      parsedProfile.education = [];
    }
    if (!Array.isArray(parsedProfile.testimonials) || parsedProfile.testimonials.length === 0) {
      parsedProfile.testimonials = [
        {
          id: 'test-1',
          author: 'Lãnh đạo Trực tiếp',
          role: 'Technical Lead & Director',
          company: parsedProfile.experiences[0]?.company || 'Enterprise Partner',
          quote: `${parsedProfile.fullName} luôn thể hiện tinh thần trách nhiệm cao, giải quyết triệt để các bài toán kỹ thuật phức tạp và đem lại giá trị vượt trội cho dự án.`,
          avatarText: 'TL'
        }
      ];
    }

    res.json({
      success: true,
      profile: parsedProfile,
      markitdownMarkdown: markitdownResult.markdown || null,
      markitdownEngine: markitdownResult.engine || null,
    });
  } catch (err: unknown) {
    console.error('Error during CV extraction:', err);
    const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định khi trích xuất CV';
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

// ==========================================
// TEMPORARY SHARE PORTFOLIO STORE & ENDPOINTS
// ==========================================
interface SharedPortfolioRecord {
  id: string;
  profile: any;
  concept: string;
  primaryColor: string;
  createdAt: number;
  expiresAt: number;
  expiresInHours: number;
}

const SHARES_FILE_PATH = path.join('/tmp', 'genfolio_shares.json');
const sharedPortfolios = new Map<string, SharedPortfolioRecord>();

// Load shares from /tmp on server launch
try {
  if (fs.existsSync(SHARES_FILE_PATH)) {
    const rawData = fs.readFileSync(SHARES_FILE_PATH, 'utf-8');
    const records: SharedPortfolioRecord[] = JSON.parse(rawData);
    const now = Date.now();
    for (const record of records) {
      if (record.expiresAt > now) {
        sharedPortfolios.set(record.id, record);
      }
    }
    console.log(`[Share API] Loaded ${sharedPortfolios.size} active temporary shares from storage.`);
  }
} catch (e) {
  console.warn('[Share API] Could not load temporary shares from cache:', e);
}

// Helper to persist to file
function persistShares() {
  try {
    const list = Array.from(sharedPortfolios.values());
    fs.writeFileSync(SHARES_FILE_PATH, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[Share API] Could not persist temporary shares:', e);
  }
}

// Periodic cleanup of expired shares every 15 minutes
setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const [id, record] of sharedPortfolios.entries()) {
    if (record.expiresAt <= now) {
      sharedPortfolios.delete(id);
      changed = true;
    }
  }
  if (changed) {
    persistShares();
  }
}, 15 * 60 * 1000);

// Endpoint 1: Create a temporary shareable link
app.post('/api/share', (req, res) => {
  try {
    const { profile, concept, primaryColor, expiresInHours = 48 } = req.body;

    if (!profile || !profile.fullName) {
      return res.status(400).json({ success: false, error: 'Hồ sơ không hợp lệ.' });
    }

    // Limit expiration hours between 1 and 336 (up to 14 days)
    const validHours = Math.min(Math.max(Number(expiresInHours) || 48, 1), 336);
    const now = Date.now();
    const expiresAt = now + (validHours * 60 * 60 * 1000);

    // Generate unique short ID (8 characters)
    const shareId = crypto.randomBytes(4).toString('hex');

    const record: SharedPortfolioRecord = {
      id: shareId,
      profile,
      concept: concept || 'terminal',
      primaryColor: primaryColor || '#10b981',
      createdAt: now,
      expiresAt,
      expiresInHours: validHours,
    };

    sharedPortfolios.set(shareId, record);
    persistShares();

    console.log(`[Share API] Created temporary share ${shareId} for "${profile.fullName}" (Expires in ${validHours}h)`);

    res.json({
      success: true,
      shareId,
      expiresAt,
      expiresInHours: validHours,
      createdAt: now,
    });
  } catch (err: any) {
    console.error('[Share API] Error creating share link:', err);
    res.status(500).json({ success: false, error: err?.message || 'Không thể tạo liên kết chia sẻ.' });
  }
});

// Endpoint 2: Get shared portfolio by ID
app.get('/api/share/:id', (req, res) => {
  try {
    const { id } = req.params;
    const record = sharedPortfolios.get(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Liên kết chia sẻ không tồn tại hoặc đã bị gỡ bỏ.',
      });
    }

    const now = Date.now();
    if (now > record.expiresAt) {
      sharedPortfolios.delete(id);
      persistShares();
      return res.status(410).json({
        success: false,
        expired: true,
        error: 'Liên kết chia sẻ tạm thời này đã hết hạn.',
      });
    }

    res.json({
      success: true,
      profile: record.profile,
      concept: record.concept,
      primaryColor: record.primaryColor,
      createdAt: record.createdAt,
      expiresAt: record.expiresAt,
      expiresInHours: record.expiresInHours,
    });
  } catch (err: any) {
    console.error('[Share API] Error getting shared portfolio:', err);
    res.status(500).json({ success: false, error: err?.message || 'Lỗi khi tải hồ sơ chia sẻ.' });
  }
});

// Endpoint 3: Delete/Revoke a temporary shareable link
app.delete('/api/share/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (sharedPortfolios.has(id)) {
      sharedPortfolios.delete(id);
      persistShares();
      return res.json({ success: true, message: 'Đã hủy liên kết chia sẻ thành công.' });
    }
    res.status(404).json({ success: false, error: 'Không tìm thấy liên kết.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Lỗi khi hủy liên kết.' });
  }
});

// Setup Vite middleware for development or Static Serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server ready at http://0.0.0.0:${port}`);
  });
}

startServer();
