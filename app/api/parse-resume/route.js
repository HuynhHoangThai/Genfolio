// Resume import: extract text from an uploaded PDF/DOCX, then split the work
// by field type instead of a rules-first/LLM-fallback cascade:
// deterministic regex for the handful of fields that have an unambiguous
// format (email, GitHub, LinkedIn), and the LLM for everything that requires
// actually understanding unstructured prose (experience, projects, etc.).
// Regex can't reliably do the latter regardless of how "clean" the resume
// looks, so there's no real fallback decision to make.

import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { GoogleGenAI, Type } from "@google/genai";

export const runtime = "nodejs";

// Extracting a PDF and then waiting on a model comfortably outruns the ten
// seconds a serverless function is given by default, and a function killed
// mid-flight answers with an HTML error page rather than with anything this
// route wrote, which is what a caller then fails to parse as JSON.
export const maxDuration = 60;

// Four megabytes, not five. The limit that actually bites is the platform's
// cap on a serverless request body, which is smaller than the old five and
// applies before the request ever reaches this code: a file between the two
// was rejected upstream with an HTML page, so the friendly message below was
// never the one anybody saw.
const MAX_FILE_BYTES = 4 * 1024 * 1024;

function extractContactInfo(text) {
  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "";
  const github = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i)?.[0] || "";
  const linkedin = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i)?.[0] || "";
  return { email, github, linkedin };
}

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    role: { type: Type.STRING, description: "Current or most recent job title" },
    bio: {
      type: Type.STRING,
      description: "2-3 sentence first-person professional summary, based only on what's in the resume",
    },
    website: {
      type: Type.STRING,
      description: "Personal website or portfolio URL, if present. Empty string if none. Do not guess.",
    },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    codingProfiles: {
      type: Type.ARRAY,
      description: "Competitive programming / coding profiles, e.g. LeetCode, Codeforces, HackerRank, Kaggle",
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          url: { type: Type.STRING },
        },
        required: ["platform", "url"],
      },
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          start: { type: Type.STRING },
          end: { type: Type.STRING, description: "Use 'Present' for the current role" },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["company", "role"],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          school: { type: Type.STRING },
          degree: { type: Type.STRING },
          start: { type: Type.STRING },
          end: { type: Type.STRING },
        },
        required: ["school"],
      },
    },
    achievements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Awards, certifications, publications, or other notable recognitions",
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Technologies used" },
          link: { type: Type.STRING },
          highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["name"],
      },
    },
  },
  required: ["name", "skills", "codingProfiles", "experience", "education", "achievements", "projects"],
};

async function extractWithOpenRouter(text) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = (process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1").replace(/\/+$/, "");
  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Dev Portfolio Builder",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: `Extract structured portfolio data from the provided resume text. Respond with ONLY valid JSON matching this schema:
{
  "name": "string",
  "role": "string",
  "bio": "2-3 sentence summary",
  "website": "string",
  "skills": ["string"],
  "codingProfiles": [{"platform": "string", "url": "string"}],
  "experience": [{"company": "string", "role": "string", "start": "string", "end": "string", "bullets": ["string"]}],
  "education": [{"school": "string", "degree": "string", "start": "string", "end": "string"}],
  "achievements": ["string"],
  "projects": [{"name": "string", "description": "string", "tags": ["string"], "link": "string", "highlights": ["string"]}]
}
Only extract factual information present in the resume. Return clean JSON.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter error (${response.status}): ${errText}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content || "{}";
  return JSON.parse(content);
}

export async function POST(request) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!geminiKey && !openRouterKey) {
    return Response.json(
      { error: "Resume import isn't set up yet: the server is missing GEMINI_API_KEY or OPENROUTER_API_KEY." },
      { status: 500 }
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "That upload didn't arrive intact. Please try again." },
      { status: 400 }
    );
  }

  const file = formData.get("resume");
  if (!file || typeof file === "string") {
    return Response.json({ error: "No resume file was uploaded." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return Response.json(
      { error: "That file is too large. Please upload a resume under 4MB." },
      { status: 400 }
    );
  }

  const fileName = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  let text = "";
  try {
    if (fileName.endsWith(".pdf")) {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      text = result.text;
    } else if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return Response.json(
        { error: "Unsupported file type. Please upload a PDF or DOCX resume." },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("resume text extraction failed:", err);
    return Response.json(
      { error: "Couldn't read that file. It may be corrupted or password-protected." },
      { status: 400 }
    );
  }

  if (!text || text.trim().length < 40) {
    return Response.json(
      {
        error:
          "Couldn't find readable text in that file. If it's a scanned image rather than a text-based resume, this won't work.",
      },
      { status: 400 }
    );
  }

  const contact = extractContactInfo(text);

  let extracted;
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Extract structured portfolio data from this resume text. Only use information actually present in the text. Never invent companies, dates, numbers, or achievements. Leave a field as an empty string or empty array if the resume doesn't contain it.\n\n---\n${text}\n---`,
        config: {
          responseMimeType: "application/json",
          responseSchema: resumeSchema,
        },
      });
      extracted = JSON.parse(response.text);
    } catch (err) {
      console.warn("gemini extraction failed, falling back to openrouter if available:", err.message || err);
    }
  }

  if (!extracted && openRouterKey) {
    try {
      extracted = await extractWithOpenRouter(text);
    } catch (err) {
      console.error("openrouter extraction failed:", err.message || err);
    }
  }

  if (!extracted) {
    return Response.json(
      { error: "The resume parser is temporarily unavailable. Please try again in a moment." },
      { status: 502 }
    );
  }

  const data = {
    name: extracted.name || "",
    role: extracted.role || "",
    bio: extracted.bio || "",
    email: contact.email,
    links: {
      github: contact.github,
      linkedin: contact.linkedin,
      website: extracted.website || "",
    },
    skills: extracted.skills || [],
    codingProfiles: (extracted.codingProfiles || []).map((profile) => ({
      platform: profile.platform || "",
      url: profile.url || "",
    })),
    experience: (extracted.experience || []).map((job) => ({
      company: job.company || "",
      role: job.role || "",
      start: job.start || "",
      end: job.end || "",
      bullets: job.bullets || [],
    })),
    education: (extracted.education || []).map((edu) => ({
      school: edu.school || "",
      degree: edu.degree || "",
      start: edu.start || "",
      end: edu.end || "",
    })),
    achievements: extracted.achievements || [],
    projects: (extracted.projects || []).map((project) => ({
      name: project.name || "",
      version: "",
      status: "Active",
      image: "",
      description: project.description || "",
      tags: project.tags || [],
      link: project.link || "",
      demo: "",
      highlights: project.highlights || [],
    })),
  };

  return Response.json({ data });
}
