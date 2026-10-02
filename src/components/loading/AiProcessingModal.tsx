import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { createStyles } from 'antd-style';
import { Center, Flexbox } from 'react-layout-kit';
import { Icon } from '@lobehub/ui';
import { Check, AlertCircle, RefreshCw, ArrowRight, Loader2, Sparkles } from 'lucide-react';
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

const useStyles = createStyles(({ css, token }) => ({
  overlay: css`
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    padding: 16px;
    user-select: none;
  `,
  modalCard: css`
    position: relative;
    width: 100%;
    max-width: 480px;
    background: ${token.colorBgContainer || '#141416'};
    border: 1px solid ${token.colorBorderSecondary || 'rgba(255, 255, 255, 0.1)'};
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.85);
    overflow: hidden;
  `,
  progressTrack: css`
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    overflow: hidden;
    margin-block: 20px 16px;
  `,
  progressBar: css`
    height: 100%;
    background: var(--primary-color, #FAFAFA);
    border-radius: 4px;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 12px var(--primary-color, #FAFAFA);
  `,
  stepItem: css`
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 8px;
    transition: all 0.2s ease;
  `,
  stepItemActive: css`
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
    font-weight: 600;
  `,
  stepItemDone: css`
    color: rgba(255, 255, 255, 0.65);
  `,
  stepItemWaiting: css`
    color: rgba(255, 255, 255, 0.25);
  `,
}));

/**
 * Refined LobeChat Minimalist AI Processing Modal
 * - Mounted via createPortal(..., document.body) to guarantee 100% viewport centering
 * - Minimalist color palette: Dark frosted surfaces + single primary accent
 * - Replaces jarring green/emerald gradients with clean typography and LobeChat brand loader
 */
export const AiProcessingModal: React.FC<AiProcessingModalProps> = ({
  industry,
  uploadedFile,
  onComplete,
  onCancel,
}) => {
  const { styles } = useStyles();
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('Đang khởi tạo Engine AI...');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasExecutedRef = useRef(false);

  const steps = [
    {
      title: uploadedFile
        ? `MarkItDown chuyển đổi ${uploadedFile.fileName} sang cấu trúc...`
        : 'Chuẩn hóa dữ liệu hồ sơ cá nhân...',
      desc: 'Trích xuất học vấn, kinh nghiệm, dự án từ CV.',
    },
    {
      title: uploadedFile
        ? 'LLM Extractor phân tích dữ liệu & định lượng thành tựu...'
        : 'Phân tích kỹ năng & chuẩn hóa chỉ số đo lường...',
      desc: 'Trích xuất chính xác thành tựu và công nghệ cốt lõi.',
    },
    {
      title: 'Ánh xạ wireframe và bảng màu theo nhóm ngành...',
      desc: 'Tự động phân bổ layout, typography và design tokens.',
    },
    {
      title: 'Hoàn tất biên dịch Landing Page tràn viền (Full-screen)...',
      desc: 'Kích hoạt website tương tác tức thì trong ≤ 3 giây.',
    },
  ];

  const runExtraction = async () => {
    if (!uploadedFile) {
      // Mock data instant simulation
      const timerStep1 = setTimeout(() => {
        setProgress(40);
        setCurrentStepIndex(1);
        setStatusMessage(steps[1].title);
      }, 500);

      const timerStep2 = setTimeout(() => {
        setProgress(75);
        setCurrentStepIndex(2);
        setStatusMessage(steps[2].title);
      }, 1100);

      const timerStep3 = setTimeout(() => {
        setProgress(95);
        setCurrentStepIndex(3);
        setStatusMessage(steps[3].title);
      }, 1700);

      const timerFinish = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          onComplete(MOCK_PROFILES_MAP[industry]);
        }, 350);
      }, 2100);

      return () => {
        clearTimeout(timerStep1);
        clearTimeout(timerStep2);
        clearTimeout(timerStep3);
        clearTimeout(timerFinish);
      };
    }

    // Real CV extraction via backend FastAPI / MarkItDown / Hermes
    try {
      setProgress(25);
      setCurrentStepIndex(0);
      setStatusMessage(`Đang tải lên ${uploadedFile.fileName} tới MarkItDown...`);

      setTimeout(() => {
        setProgress(50);
        setCurrentStepIndex(1);
        setStatusMessage('MarkItDown đã bóc tách xong text. Đang gọi LLM Extractor...');
      }, 1000);

      const response = await fetch('/api/extract-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data: uploadedFile.base64Data,
          fileName: uploadedFile.fileName,
          mimeType: uploadedFile.mimeType,
          industryOverride: industry,
        }),
      });

      if (!response.ok) {
        throw new Error(`Máy chủ trả về mã lỗi: ${response.status}`);
      }

      const data = await response.json();

      if ((data.status === 'success' || data.success) && data.profile) {
        setProgress(90);
        setCurrentStepIndex(2);
        setStatusMessage('Đang tổng hợp wireframe và bố cục hiển thị...');

        setTimeout(() => {
          setProgress(100);
          setCurrentStepIndex(3);
          setTimeout(() => {
            onComplete(data.profile);
          }, 350);
        }, 400);
      } else {
        throw new Error(data.message || data.detail || 'Không thể trích xuất cấu trúc dữ liệu từ tài liệu này.');
      }
    } catch (err: any) {
      console.error('Extraction API issue:', err);
      setErrorMessage(
        err.message || 'Không thể trích xuất cấu trúc dữ liệu từ tệp này. Vui lòng bấm Thử lại hoặc chọn mẫu chuẩn ngành.'
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
    onComplete(MOCK_PROFILES_MAP[industry]);
  };

  const content = (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        {/* Top Header */}
        <Flexbox align="center" distribution="space-between" horizontal style={{ marginBottom: 20 }}>
          <Flexbox align="center" gap={8} horizontal>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--primary-color, #FAFAFA)',
                boxShadow: '0 0 10px var(--primary-color, #FAFAFA)',
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
              {uploadedFile ? 'MarkItDown & LLM Extractor' : 'Genfolio Engine Nội Suy'}
            </span>
          </Flexbox>
          <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-color, #FAFAFA)' }}>
            {progress}%
          </span>
        </Flexbox>

        {/* Error State */}
        {errorMessage ? (
          <Center gap={12} padding="16px 0">
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(255, 77, 79, 0.1)',
                border: '1px solid rgba(255, 77, 79, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ff4d4f',
              }}
            >
              <AlertCircle style={{ width: 26, height: 26 }} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>
              Chưa thể bóc tách CV tự động
            </h3>
            <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.55)', margin: 0, textAlign: 'center', maxWidth: 360 }}>
              {errorMessage}
            </p>

            <Flexbox gap={8} horizontal style={{ marginTop: 12 }}>
              <button
                type="button"
                onClick={handleRetry}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  background: 'var(--primary-color, #FAFAFA)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: 12,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <RefreshCw style={{ width: 14, height: 14 }} />
                <span>Thử lại</span>
              </button>

              <button
                type="button"
                onClick={handleFallback}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 12,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>Dùng mẫu chuẩn ngành</span>
                <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </Flexbox>
          </Center>
        ) : (
          <>
            {/* Center Genfolio Minimalist Brand Loader */}
            <Center gap={14} padding="12px 0 6px">
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  position: 'relative',
                }}
              >
                <Sparkles size={26} style={{ color: 'var(--primary-color, #FAFAFA)' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                  {statusMessage}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)', maxWidth: 360 }}>
                  {uploadedFile
                    ? `Phân tích tệp: ${uploadedFile.fileName} (${uploadedFile.fileSize || 'PDF'})`
                    : steps[currentStepIndex]?.desc}
                </div>
              </div>
            </Center>

            {/* Progress Track */}
            <div className={styles.progressTrack}>
              <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            </div>

            {/* Checklist */}
            <Flexbox gap={4}>
              {steps.map((st, idx) => {
                const isDone = idx < currentStepIndex || progress === 100;
                const isCurrent = idx === currentStepIndex && progress < 100;

                return (
                  <Flexbox
                    align="center"
                    className={`${styles.stepItem} ${
                      isCurrent ? styles.stepItemActive : isDone ? styles.stepItemDone : styles.stepItemWaiting
                    }`}
                    distribution="space-between"
                    horizontal
                    key={idx}
                  >
                    <Flexbox align="center" gap={8} horizontal style={{ minWidth: 0, flex: 1 }}>
                      {isDone ? (
                        <Check style={{ width: 13, height: 13, color: 'var(--primary-color, #FAFAFA)', flexShrink: 0 }} />
                      ) : isCurrent ? (
                        <Icon icon={Loader2} size={13} spin style={{ color: 'var(--primary-color, #FAFAFA)', flexShrink: 0 }} />
                      ) : (
                        <span style={{ width: 13, height: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, opacity: 0.6, flexShrink: 0 }}>
                          {idx + 1}
                        </span>
                      )}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {st.title}
                      </span>
                    </Flexbox>

                    <span style={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.7, marginLeft: 8, flexShrink: 0 }}>
                      {isDone ? 'Hoàn tất' : isCurrent ? 'Đang chạy' : 'Chờ'}
                    </span>
                  </Flexbox>
                );
              })}
            </Flexbox>
          </>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
};

export default AiProcessingModal;
