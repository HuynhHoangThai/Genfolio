import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Cpu, Check, Layers, AlertCircle, RefreshCw, FileText, ArrowRight } from 'lucide-react';
import { IndustryType, MockProfile } from '../../types/portfolio';
import { MOCK_PROFILES_MAP } from '../../data/mockProfiles';

export interface UploadedFilePayload {
  base64Data: string;
  mimeType: string;
  fileName: string;
  fileSize?: string;
}

interface AiProcessingModalProps {
  industry: IndustryType;
  uploadedFile?: UploadedFilePayload | null;
  onComplete: (profile: MockProfile) => void;
  onCancel: () => void;
}

export const AiProcessingModal: React.FC<AiProcessingModalProps> = ({
  industry,
  uploadedFile,
  onComplete,
  onCancel,
}) => {
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('Đang khởi tạo engine AI...');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExtractingRealCv, setIsExtractingRealCv] = useState(!!uploadedFile);
  const hasExecutedRef = useRef(false);

  const steps = [
    {
      title: uploadedFile
        ? `Microsoft MarkItDown đang chuyển đổi ${uploadedFile.fileName} sang cấu trúc Markdown...`
        : 'Đang trích xuất cấu trúc dữ liệu CV chuẩn hóa...',
      desc: 'Giữ nguyên toàn bộ cấu trúc bảng biểu, đầu mục học vấn, dự án & dòng thời gian từ CV.',
    },
    {
      title: uploadedFile
        ? 'Gemini 3.8 Flash đang phân tích Markdown & trích xuất toàn bộ học vấn, kinh nghiệm, chứng chỉ...'
        : 'Đang phân tích kỹ năng & chuẩn hóa các chỉ số đo lường...',
      desc: 'Trích xuất chính xác thành tựu, các con số định lượng và công nghệ sử dụng.',
    },
    {
      title: `Ánh xạ và nội suy kiến trúc giao diện ngành ${
        industry === 'tech' ? 'Kỹ thuật (Tech)' : industry === 'creative' ? 'Sáng tạo (Creative)' : 'Kinh doanh (Business)'
      }...`,
      desc: 'Tự động phân bổ typography, component hiển thị và bảng màu tương thích.',
    },
    {
      title: 'Hoàn tất biên dịch Landing Page tràn viền với Framer Motion & GSAP animations...',
      desc: 'Khởi tạo website tương tác và kích hoạt Floating Widget tùy biến.',
    },
  ];

  const runExtraction = async () => {
    if (!uploadedFile) {
      // Mock data instant simulation
      const timerStep1 = setTimeout(() => {
        setProgress(40);
        setCurrentStepIndex(1);
        setStatusMessage(steps[1].title);
      }, 600);

      const timerStep2 = setTimeout(() => {
        setProgress(75);
        setCurrentStepIndex(2);
        setStatusMessage(steps[2].title);
      }, 1300);

      const timerStep3 = setTimeout(() => {
        setProgress(95);
        setCurrentStepIndex(3);
        setStatusMessage(steps[3].title);
      }, 2000);

      const timerFinish = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          onComplete(MOCK_PROFILES_MAP[industry]);
        }, 400);
      }, 2500);

      return () => {
        clearTimeout(timerStep1);
        clearTimeout(timerStep2);
        clearTimeout(timerStep3);
        clearTimeout(timerFinish);
      };
    }

    // Real CV extraction via Gemini server route
    try {
      setProgress(25);
      setCurrentStepIndex(0);
      setStatusMessage(`Đang truyền tải ${uploadedFile.fileName} tới máy chủ xử lý...`);

      // Progress bump
      setTimeout(() => {
        setProgress(50);
        setCurrentStepIndex(1);
        setStatusMessage('Gemini Multimodal đang đọc và trích xuất kinh nghiệm & dự án...');
      }, 800);

      const response = await fetch('/api/extract-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data: uploadedFile.base64Data,
          mimeType: uploadedFile.mimeType,
          fileName: uploadedFile.fileName,
          industryOverride: industry,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Lỗi máy chủ HTTP ${response.status}`);
      }

      const result = await response.json();
      if (!result.success || !result.profile) {
        throw new Error(result.error || 'Không thể trích xuất cấu trúc CV hợp lệ.');
      }

      setProgress(85);
      setCurrentStepIndex(2);
      setStatusMessage(`Đã bóc tách thành công cho ${result.profile.fullName}! Đang khớp giao diện...`);

      setTimeout(() => {
        setProgress(100);
        setCurrentStepIndex(3);
        setStatusMessage('Hoàn tất! Đang chuyển sang Landing Page...');

        setTimeout(() => {
          onComplete({
            ...result.profile,
            markitdownMarkdown: result.markitdownMarkdown || undefined,
          });
        }, 400);
      }, 700);
    } catch (err: unknown) {
      console.error('Real CV extraction failed:', err);
      const msg = err instanceof Error ? err.message : 'Có lỗi khi phân tích CV';
      setErrorMessage(
        msg.includes('503') || msg.includes('high demand')
          ? 'Máy chủ AI tạm thời đang chịu tải cao (503). Vui lòng bấm "Thử lại" hoặc dùng mẫu chuẩn ngành để xem kết quả ngay.'
          : msg
      );
    }
  };

  useEffect(() => {
    if (!hasExecutedRef.current) {
      hasExecutedRef.current = true;
      runExtraction();
    }
  }, []);

  const handleRetry = () => {
    setErrorMessage(null);
    setProgress(15);
    setCurrentStepIndex(0);
    hasExecutedRef.current = false;
    runExtraction();
  };

  const handleFallback = () => {
    // Graceful fallback to default industry template
    onComplete(MOCK_PROFILES_MAP[industry]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 backdrop-blur-xl p-4">
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl animate-pulse pointer-events-none" />

      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-7 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              {uploadedFile ? 'Gemini 3.8 Flash · Bóc tách CV thật' : 'Gen-Folio · Engine Nội Suy AI'}
            </span>
          </div>
          <span className="text-xs font-mono text-neutral-400 font-bold">{progress}%</span>
        </div>

        {/* Error State */}
        {errorMessage ? (
          <div className="py-4 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Chưa thể bóc tách CV tự động</h3>
            <p className="text-xs text-neutral-400 mb-5 max-w-sm mx-auto leading-relaxed">
              {errorMessage}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleRetry}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại với tệp này</span>
              </button>

              <button
                type="button"
                onClick={handleFallback}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-medium border border-neutral-700 hover:border-neutral-600 bg-neutral-800 text-neutral-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Dùng mẫu chuẩn ngành {industry}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Center Scanner Graphic */}
            <div className="relative flex flex-col items-center justify-center my-5 py-3">
              <div className="relative w-20 h-20 rounded-2xl bg-neutral-950 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                {uploadedFile ? (
                  <FileText className="w-9 h-9 text-emerald-400" />
                ) : (
                  <Cpu className="w-9 h-9 text-emerald-400" />
                )}
                {/* Spinning radar border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-emerald-400 border-r-teal-400 animate-spin" />
              </div>

              <div className="mt-4 text-center px-4">
                <h3 className="text-base font-bold text-white mb-1 transition-all">
                  {statusMessage}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
                  {uploadedFile
                    ? `Đang phân tích tài liệu: ${uploadedFile.fileName} (${uploadedFile.fileSize || 'PDF'})`
                    : steps[currentStepIndex]?.desc}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-950 rounded-full h-2 mb-6 overflow-hidden p-0.5 border border-neutral-800">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Dynamic step checklist */}
            <div className="space-y-2 border-t border-neutral-800/80 pt-4">
              {steps.map((st, idx) => {
                const isDone = idx < currentStepIndex || progress === 100;
                const isCurrent = idx === currentStepIndex && progress < 100;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-neutral-800 text-emerald-300'
                        : isDone
                        ? 'text-neutral-300'
                        : 'text-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isDone ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : isCurrent ? (
                        <span className="w-4 h-4 rounded-full border border-emerald-400 border-t-transparent animate-spin" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-600 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                      )}
                      <span className="truncate max-w-[320px] font-medium">
                        {st.title.replace('...', '')}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-neutral-500">
                      {isDone ? 'Hoàn tất' : isCurrent ? 'Đang bóc tách' : 'Chờ'}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
