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
    id: 'sample-tech-kyson',
    name: 'Huỳnh Kỳ Sơn',
    role: 'Senior Full-Stack & Cloud Architect',
    industry: 'tech-dev',
    filename: 'CV_Huynh_Ky_Son_Tech.pdf',
    textSnippet: 'Senior Full-Stack & Cloud System Architect với hơn 8 năm kinh nghiệm chuyên sâu trong hệ sinh thái React, TypeScript, Python FastAPI, Go, Microservices phân tán và Kubernetes...',
  },
  {
    id: 'sample-creative-alex',
    name: 'Alex Rivera',
    role: 'Lead UI/UX & Spatial Designer',
    industry: 'tech-uiux',
    filename: 'CV_Alex_Rivera_Creative.pdf',
    textSnippet: 'Lead Product Designer với hơn 7 năm kiến tạo Design Systems toàn diện cho các sản phẩm SaaS cao cấp, đoạt giải Red Dot & Awwwards 2024, thành thạo Figma Tokens, Micro-interactions và 3D Spline...',
  },
  {
    id: 'sample-business-marcus',
    name: 'Marcus Vance',
    role: 'Principal Solution Architect & BA',
    industry: 'tech-devops',
    filename: 'CV_Marcus_Vance_Business.pdf',
    textSnippet: 'Chuyên gia tư vấn kiến trúc giải pháp Enterprise và phân tích nghiệp vụ kỹ thuật cao cấp (TOGAF, CBAP) với hơn 10 năm kinh nghiệm dẫn dắt các chương trình Chuyển đổi số Quy mô lớn...',
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
