// Helper functions and pre-packaged sample CV texts for testing instant extraction

export interface SampleCvOption {
  id: string;
  name: string;
  role: string;
  industry: 'tech-dev' | 'tech-devops' | 'tech-uiux' | 'tech-sec' | 'tech-data';
  filename: string;
  textSnippet: string;
}

export const SAMPLE_CVS: SampleCvOption[] = [
  {
    id: 'sample-ai-engineer',
    name: 'Phạm Hoàng Nam',
    role: 'Senior Full-Stack & AI Engineer',
    industry: 'tech-dev',
    filename: 'CV_Pham_Hoang_Nam_FullStack_AI.pdf',
    textSnippet: 'Senior Full-Stack & Generative AI Engineer với 6+ năm phát triển ứng dụng Next.js, Python FastAPI, Vector DB (Pinecone, pgvector) và tối ưu hóa LLM serving (vLLM, Ollama)...',
  },
  {
    id: 'sample-product-designer',
    name: 'Đặng Ngọc Uyên',
    role: 'Lead UI/UX & Spatial Experience Designer',
    industry: 'tech-uiux',
    filename: 'CV_Dang_Ngoc_Uyen_UIUX_Designer.pdf',
    textSnippet: 'Lead Product Designer với hơn 7 năm thiết kế Design Systems cho SaaS và E-commerce, đoạt giải Best UI Design 2024, thành thạo Figma Tokens, Micro-interactions và 3D Spline...',
  },
  {
    id: 'sample-devops',
    name: 'Lê Quốc Bảo',
    role: 'Cloud Infrastructure & SRE Architect',
    industry: 'tech-devops',
    filename: 'CV_Le_Quoc_Bao_DevOps_SRE.pdf',
    textSnippet: 'Cloud Architect với 9 năm kinh nghiệm mở rộng hạ tầng K8s khu vực Đông Nam Á, tự động hóa 100% bằng Terraform, CI/CD GitHub Actions, chịu tải hơn 15M concurrent users...',
  },
];

// Creates a valid minimal PDF buffer containing the text resume
export function createTextPdfDataUri(title: string, content: string): string {
  // A clean minimal valid single-page PDF with readable text
  const cleanTitle = title
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
  const cleanContent = content
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

  const pdfBody = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${cleanContent.length + 150} >>
stream
BT
/F1 16 Tf
50 720 Td
(${cleanTitle}) Tj
/F1 10 Tf
0 -30 Td
(${cleanContent.slice(0, 200)}) Tj
0 -20 Td
(${cleanContent.slice(200, 400)}) Tj
0 -20 Td
(${cleanContent.slice(400, 600)}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000227 00000 n 
0000000450 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
530
%%EOF`;

  // Unicode-safe base64 encoding (btoa only supports Latin1)
  const encoder = new TextEncoder();
  const bytes = encoder.encode(pdfBody);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:application/pdf;base64,${btoa(binary)}`;
}
