import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Palette, 
  Briefcase, 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Zap, 
  FileCheck,
  AlertCircle,
  X,
  FileUp,
  Cpu,
  Flame,
  Radio,
  Building2,
  Layers,
  Wand2,
  Sliders,
  LayoutGrid
} from 'lucide-react';
import { IndustryType, LayoutConcept, MockProfile } from '../../types/portfolio';
import { MOCK_PROFILES_MAP } from '../../data/mockProfiles';
import { UploadedFilePayload } from '../loading/AiProcessingModal';
import { SAMPLE_CVS, createTextPdfDataUri } from '../../data/samplePdfs';

interface HomeHeroProps {
  onGenerate: (
    industry: IndustryType,
    customProfile?: MockProfile,
    uploadedFile?: UploadedFilePayload,
    concept?: LayoutConcept
  ) => void;
}

export const CONCEPTS_METADATA: {
  id: LayoutConcept;
  industry: IndustryType;
  title: string;
  badge: string;
  desc: string;
  wireframeHighlight: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    id: 'terminal',
    industry: 'tech',
    title: 'Terminal Dev HUD',
    badge: 'Kỹ thuật · Monospace',
    desc: 'Bố cục dòng lệnh CLI, sơ đồ hệ phân tán, telemetry server và git commit log.',
    wireframeHighlight: 'CLI interactive runner & status ping',
    icon: Terminal,
    color: '#10b981',
  },
  {
    id: 'bento-glass',
    industry: 'creative',
    title: 'Spatial Bento Glass',
    badge: 'Sáng tạo · Glassmorphism',
    desc: 'Lưới Bento đa kích thước, chiều sâu thị giác 3D, quả cầu ambient phản chiếu ánh sáng.',
    wireframeHighlight: 'Asymmetric Bento grid & lightbox',
    icon: Palette,
    color: '#f43f5e',
  },
  {
    id: 'brutalist',
    industry: 'tech',
    title: 'Neo-Brutalist Raw',
    badge: 'Phá cách · High-Contrast',
    desc: 'Viền đậm 4px, sọc chéo hazard cảnh báo, bóng offset 3D và typography bản in nổi bật.',
    wireframeHighlight: 'Sticker badges & raw ticker banner',
    icon: Flame,
    color: '#facc15',
  },
  {
    id: 'cyberpunk-holo',
    industry: 'tech',
    title: 'Cyberpunk Holo-Deck',
    badge: 'Tương lai · Hex Matrix',
    desc: 'Lưới ma trận neon, thước ngắm điện tử HUD, sóng vi mạch và hiệu ứng quét quang học.',
    wireframeHighlight: 'Real-time telemetry HUD & cyber scanline',
    icon: Radio,
    color: '#06b6d4',
  },
  {
    id: 'executive-kpi',
    industry: 'business',
    title: 'Executive Boardroom',
    badge: 'Kinh doanh · Bảng điều khiển',
    desc: 'Thẻ định lượng $65M+ Pipeline, đồ thị tăng trưởng ARR, chứng thực từ ban giám đốc.',
    wireframeHighlight: 'Financial scorecard & enterprise milestones',
    icon: Building2,
    color: '#f59e0b',
  },
  {
    id: 'swiss-editorial',
    industry: 'creative',
    title: 'Swiss Minimalist Editorial',
    badge: 'Tối giản · Monograph',
    desc: 'Lưới bất đối xứng Thụy Sĩ, đường kẻ mảnh hairline, đánh số lưu trữ bảo tàng.',
    wireframeHighlight: 'Fine-line grid & monograph archive index',
    icon: Layers,
    color: '#ededed',
  },
];

export const HomeHero: React.FC<HomeHeroProps> = ({ onGenerate }) => {
  const [selectedConcept, setSelectedConcept] = useState<LayoutConcept>('terminal');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('tech');
  const [uploadedFilePayload, setUploadedFilePayload] = useState<UploadedFilePayload | null>(null);
  const [customProfileData, setCustomProfileData] = useState<MockProfile | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'upload' | 'sample' | 'preset'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSelectConcept = (c: typeof CONCEPTS_METADATA[0]) => {
    setSelectedConcept(c.id);
    setSelectedIndustry(c.industry);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectedFile(e.target.files[0]);
    }
  };

  const handleSelectedFile = (file: File) => {
    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      // JSON directly parsed
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.industry && ['tech', 'creative', 'business'].includes(parsed.industry)) {
            setSelectedIndustry(parsed.industry);
          }
          if (parsed.concept) {
            setSelectedConcept(parsed.concept);
          }
          setCustomProfileData(parsed);
          setUploadedFilePayload(null);
        } catch {
          alert('File JSON không đúng định dạng.');
        }
      };
      reader.readAsText(file);
    } else {
      // PDF or other documents: read as Data URL (base64)
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUploadedFilePayload({
          base64Data: base64,
          mimeType: file.type || 'application/pdf',
          fileName: file.name,
          fileSize: formatFileSize(file.size),
        });
        setCustomProfileData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSampleCv = (sample: typeof SAMPLE_CVS[0]) => {
    setSelectedIndustry(sample.industry);
    // map concept matching industry
    if (sample.industry === 'tech') setSelectedConcept('terminal');
    else if (sample.industry === 'creative') setSelectedConcept('bento-glass');
    else setSelectedConcept('executive-kpi');

    const pdfDataUri = createTextPdfDataUri(sample.name, sample.textSnippet);
    setUploadedFilePayload({
      base64Data: pdfDataUri,
      mimeType: 'application/pdf',
      fileName: sample.filename,
      fileSize: '45 KB (Sample PDF)',
    });
    setCustomProfileData(null);
  };

  const handleClearUploadedFile = () => {
    setUploadedFilePayload(null);
    setCustomProfileData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartGenerate = () => {
    onGenerate(
      selectedIndustry,
      customProfileData || undefined,
      uploadedFilePayload || undefined,
      selectedConcept
    );
  };

  const activeConceptMeta = CONCEPTS_METADATA.find((c) => c.id === selectedConcept)!;
  const currentPreviewProfile = customProfileData || MOCK_PROFILES_MAP[selectedIndustry];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl opacity-70" />
      <div className="pointer-events-none absolute inset-0 tech-grid-pattern opacity-25" />

      {/* Top Bar */}
      <header className="relative z-10 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight font-creative text-white">
              Gen<span className="text-emerald-400">Folio</span>
            </span>
            <span className="hidden sm:inline text-xs text-neutral-400 border-l border-neutral-800 pl-3">
              AI-Powered CV Extractor &amp; Multi-Concept Engine
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs text-neutral-400 font-medium">
            <span className="text-neutral-200">6 Concept Wireframe Độc bản</span>
            <span>·</span>
            <span>Tự sinh Visual AI</span>
            <span>·</span>
            <span>Trích xuất PDF Gemini Flash</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartGenerate}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Khởi tạo 1 chạm ngay</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex-1 flex flex-col justify-center">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs text-emerald-400 mb-3 bg-emerald-950/50 border border-emerald-800/60 px-3.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">6 Concept Kiến Trúc Độc Bản · Tự sinh Visual AI theo ngành nghề</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 font-creative text-balance">
            Tạo Landing Page Portfolio <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              đa Concept &amp; tự sinh ảnh AI
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Chọn một trong 6 phong cách kiến trúc giao diện, tải CV PDF hoặc dùng mẫu có sẵn. Hệ thống bóc tách dữ liệu thật và tự động tạo hình ảnh AI tràn viền độc quyền.
          </p>
        </div>

        {/* 2-Column Generator Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto w-full">
          {/* Left Column: Concept Selector & File Upload */}
          <div className="lg:col-span-7 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-sm">
            <div>
              {/* Step 1: Layout Concept Choice (6 Diverse Architectural Wireframes) */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Bước 1: Chọn phong cách Layout (6 Concept)
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">Đa dạng Wireframe</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                {CONCEPTS_METADATA.map((c) => {
                  const Icon = c.icon;
                  const isSelected = selectedConcept === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectConcept(c)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-950/40 ring-1 ring-emerald-400'
                          : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 hover:bg-neutral-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-neutral-400'}`} />
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="text-xs font-semibold text-white mb-0.5 leading-snug">{c.title}</div>
                      <div className="text-[10px] text-neutral-400 truncate">{c.badge}</div>
                    </button>
                  );
                })}
              </div>

              {/* Step 2: Upload Real CV / Sample PDF */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-semibold">
                    Bước 2: Tải lên CV của bạn (PDF / DOCX / JSON)
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 font-mono text-[11px]">Gemini 3.8 Flash Ready</span>
                  </div>
                </div>

                {/* Dropzone & Upload Box */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleFileDrop}
                  className={`border border-dashed rounded-xl p-5 text-center transition-all ${
                    dragActive
                      ? 'border-emerald-400 bg-emerald-950/40'
                      : uploadedFilePayload
                      ? 'border-emerald-500/60 bg-emerald-950/20'
                      : 'border-neutral-800 bg-neutral-950/50 hover:border-neutral-700'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept=".pdf,.docx,.json,.txt"
                    className="hidden"
                  />

                  {uploadedFilePayload ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2 shadow-lg shadow-emerald-500/10">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-semibold text-white mb-1">
                        {uploadedFilePayload.fileName}
                      </div>
                      <div className="text-xs text-emerald-400 mb-3 font-mono">
                        {uploadedFilePayload.fileSize} · Đã sẵn sàng bóc tách tự động
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                        >
                          Đổi file khác
                        </button>
                        <button
                          type="button"
                          onClick={handleClearUploadedFile}
                          className="text-xs px-3 py-1 rounded bg-red-950/60 border border-red-800/60 text-red-300 hover:bg-red-900/80 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          <span>Gỡ bỏ</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 mb-2">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-neutral-300 font-medium mb-1">
                        Kéo thả file CV PDF vào đây hoặc{' '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-emerald-400 hover:underline font-semibold cursor-pointer"
                        >
                          chọn tệp từ máy
                        </button>
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Hỗ trợ .pdf, .docx, .json chuẩn CV (Tối đa 25MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Sample Selector */}
                <div className="mt-3 pt-3 border-t border-neutral-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-neutral-400">
                      Chưa có sẵn CV PDF? Thử nhanh với file mẫu:
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SAMPLE_CVS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectSampleCv(sample)}
                        className="p-2 rounded-lg bg-neutral-950/80 border border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-800/60 text-left transition-all cursor-pointer group"
                      >
                        <div className="text-xs font-semibold text-white group-hover:text-emerald-400 truncate">
                          {sample.name}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">{sample.role}</div>
                        <div className="text-[9px] font-mono text-emerald-400/80 mt-1">
                          [Mẫu PDF {sample.industry.toUpperCase()}]
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5 mb-6 text-xs text-neutral-400 bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Concept đã chọn: <strong className="text-white">{activeConceptMeta.title}</strong> ({activeConceptMeta.desc})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Đặc trưng wireframe: <strong className="text-cyan-300">{activeConceptMeta.wireframeHighlight}</strong></span>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div>
              <button
                type="button"
                onClick={handleStartGenerate}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-neutral-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <span>
                  {uploadedFilePayload
                    ? `Bóc tách CV & Tạo Web phong cách ${activeConceptMeta.title}`
                    : `Tải CV & Tạo Web theo phong cách ${activeConceptMeta.title}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 px-1">
                <span>
                  {uploadedFilePayload ? 'Trích xuất Gemini AI bóc tách nội dung thật' : 'Khởi tạo tức thì 1 chạm'}
                </span>
                <span>Tự động responsive tràn viền</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Data & Concept Wireframe Preview Card */}
          <div className="lg:col-span-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                <div className="text-xs font-mono text-neutral-400">Concept Architecture Preview</div>
                <div className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 text-emerald-400 font-mono">
                  {activeConceptMeta.id.toUpperCase()}
                </div>
              </div>

              {/* Sample Profile Header Card */}
              <div className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-neutral-800 text-neutral-300 mb-2">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: activeConceptMeta.color }}
                    />
                    <span>{activeConceptMeta.badge}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {uploadedFilePayload ? `(Sẽ bóc tách từ ${uploadedFilePayload.fileName})` : currentPreviewProfile.fullName}
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium">
                    {uploadedFilePayload ? `Tự động trích xuất chức danh & kỹ năng chuyên môn` : currentPreviewProfile.title}
                  </p>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                    {uploadedFilePayload
                      ? `Gemini AI sẽ quét tóm tắt chuyên môn, quá trình làm việc, các chứng chỉ và dự án nổi bật từ tệp ${uploadedFilePayload.fileName}.`
                      : currentPreviewProfile.bio}
                  </p>
                </div>

                {/* KPI Highlights */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/80">
                  {currentPreviewProfile.metrics.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/60">
                      <div className="text-base font-extrabold text-white font-mono">{m.value}</div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Skills tags preview */}
                <div className="pt-2 border-t border-neutral-800/80">
                  <div className="text-[11px] text-neutral-400 mb-1.5 font-medium">Kỹ năng tiêu biểu:</div>
                  <div className="flex flex-wrap gap-1.5 text-xs text-neutral-300 font-mono">
                    {currentPreviewProfile.skills.slice(0, 5).map((s, idx) => (
                      <span key={idx} className="bg-neutral-800/70 px-2 py-0.5 rounded text-[11px]">
                        {s.name}
                      </span>
                    ))}
                    {currentPreviewProfile.skills.length > 5 && (
                      <span className="text-[11px] text-neutral-500 self-center">
                        +{currentPreviewProfile.skills.length - 5} khác
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Visual Engine Feature Callout */}
                <div className="pt-3 border-t border-neutral-800/80 bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/70">
                  <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-white">
                    <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AI Visual Synthesizer</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Hệ thống sẽ tự động tạo ảnh banner, thumbnail dự án và avatar mang âm hưởng kiến trúc <strong>{activeConceptMeta.title}</strong>, có thể tùy biến lại bất cứ lúc nào!
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>ZERO-CONFIG 1-TOUCH</span>
              <span>100% RESPONSIVE</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-900 bg-neutral-950 py-4 px-6 text-center text-xs text-neutral-600">
        <p>Gen-Folio MVP · Tích hợp trích xuất PDF thực tế qua Gemini 3.8 Flash · Thiết kế cho Vibe Code Challenge</p>
      </footer>
    </div>
  );
};
