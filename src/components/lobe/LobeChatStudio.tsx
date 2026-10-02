import React, { memo, useState, useRef } from 'react';
import { ActionIcon, Avatar, Tag, Grid, FluentEmoji } from '@lobehub/ui';
import { Button, Space, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { Flexbox, Center } from 'react-layout-kit';
import { 
  Paperclip, 
  Trash2, 
  ArrowRight, 
  Palette, 
  Briefcase, 
  Code2, 
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { IndustryType, LayoutConcept, MockProfile } from '../../types/portfolio';
import { UploadedFilePayload } from '../loading/AiProcessingModal';
import { SAMPLE_CVS, createTextPdfDataUri } from '../../data/samplePdfs';
import { LOBE_PRIMARY_COLORS } from '../../styles/lobeColors';
import LobeFileItem from './LobeFileItem';
import LobeModelTag from './LobeModelTag';
import LobeHotKeys from './LobeHotKeys';

const useStyles = createStyles(({ css, token, responsive }) => ({
  inboxContainer: css`
    align-items: center;
    ${responsive.mobile} {
      align-items: flex-start;
    }
  `,
  heroTitle: css`
    margin-block: 0.2em 0;
    font-size: 32px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: ${token.colorText};
    ${responsive.mobile} {
      font-size: 24px;
    }
  `,
  heroDesc: css`
    font-size: 13px;
    line-height: 1.6;
    color: ${token.colorTextDescription};
    max-width: 680px;
    text-align: center;
    ${responsive.mobile} {
      text-align: left;
    }
  `,
  sectionTitle: css`
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${token.colorTextDescription};
    font-family: ${token.fontFamilyCode || 'monospace'};
    margin-bottom: 8px;
  `,
  conceptCard: css`
    position: relative;
    overflow: hidden;
    height: 100%;
    min-height: 96px;
    padding: 14px 16px;
    cursor: pointer;
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadius}px;
    border: 1px solid ${token.colorBorderSecondary};
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: ${token.colorBgElevated};
      border-color: ${token.colorBorder};
      transform: translateY(-1px);
    }
  `,
  samplePill: css`
    cursor: pointer;
    padding: 8px 16px;
    color: ${token.colorText};
    background: ${token.colorBgContainer};
    border-radius: 48px;
    border: 1px solid ${token.colorBorderSecondary};
    font-size: 12px;
    transition: all 0.2s ease;
    user-select: none;

    &:hover {
      background: ${token.colorBgElevated};
      border-color: ${token.colorBorder};
      transform: translateY(-1px);
    }
  `,
  dockedPanel: css`
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: 860px;
    z-index: 60;
    background: rgba(18, 18, 22, 0.94);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 18px;
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.8);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  `,
  dockedPanelDrag: css`
    background: rgba(24, 24, 32, 0.98);
    border-color: var(--primary-color, #FAFAFA) !important;
    box-shadow: 0 0 32px rgba(250, 250, 250, 0.15) !important;
  `,
  textArea: css`
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: ${token.colorText};
    font-size: 13px;
    font-family: inherit;
    resize: none;
    line-height: 1.5;
    padding: 4px 0;

    &::placeholder {
      color: ${token.colorTextPlaceholder};
    }
  `,
}));

interface LobeChatStudioProps {
  onGenerate: (
    industry: IndustryType,
    customProfile?: MockProfile,
    uploadedFile?: UploadedFilePayload,
    concept?: LayoutConcept
  ) => void;
  selectedIndustry: IndustryType;
  selectedConcept: LayoutConcept;
  onSelectConcept: (concept: LayoutConcept, industry: IndustryType) => void;
  activeModelName?: string;
}

export const PRD_INDUSTRIES = [
  {
    id: 'tech-dev' as IndustryType,
    label: 'Kỹ thuật (Tech)',
    desc: 'Developer, DevOps, Cloud, AI, Security',
    icon: Code2,
    defaultConcept: 'cyber-neon' as LayoutConcept,
    accentColor: LOBE_PRIMARY_COLORS.cyan.hex,
  },
  {
    id: 'tech-uiux' as IndustryType,
    label: 'Sáng tạo (Creative)',
    desc: 'UI/UX, Product Designer, Creative Lead',
    icon: Palette,
    defaultConcept: 'glass-morph' as LayoutConcept,
    accentColor: LOBE_PRIMARY_COLORS.purple.hex,
  },
  {
    id: 'tech-devops' as IndustryType,
    label: 'Kinh doanh (Business)',
    desc: 'Solution Architect, PM, Executive',
    icon: Briefcase,
    defaultConcept: 'holographic-grid' as LayoutConcept,
    accentColor: LOBE_PRIMARY_COLORS.magenta.hex,
  },
];

const TEMPLATE_CARDS = [
  {
    id: 'cyber-neon' as LayoutConcept,
    industry: 'tech-dev' as IndustryType,
    title: 'Cyber Neon HUD',
    badge: 'Kỹ thuật · Cyberpunk',
    desc: 'Lưới neon động, viền glowing rực rỡ, phông chữ monospace, tương tác quét laser.',
    avatar: '⚡',
    color: LOBE_PRIMARY_COLORS.cyan.hex,
    industryLabel: 'Tech',
  },
  {
    id: 'glass-morph' as LayoutConcept,
    industry: 'tech-uiux' as IndustryType,
    title: 'Glassmorphism Studio',
    badge: 'Sáng tạo · Frosted Glass',
    desc: 'Thiết kế kính mờ đa sắc, mesh gradients, thẻ nổi 3D, animation mượt mà.',
    avatar: '🎨',
    color: LOBE_PRIMARY_COLORS.purple.hex,
    industryLabel: 'Creative',
  },
  {
    id: 'holographic-grid' as LayoutConcept,
    industry: 'tech-devops' as IndustryType,
    title: 'Holo-Tech Grid',
    badge: 'Hiện đại · Isometric',
    desc: 'Mặt phẳng lưới isometric, hiệu ứng nhám holographic, màu sắc tươi sáng.',
    avatar: '☁️',
    color: LOBE_PRIMARY_COLORS.magenta.hex,
    industryLabel: 'Business',
  },
  {
    id: 'terminal' as LayoutConcept,
    industry: 'tech-sec' as IndustryType,
    title: 'Classic Terminal',
    badge: 'Bảo mật · CLI Hacker',
    desc: 'Giao diện CLI cổ điển nâng cấp với các chi tiết gradient accent tinh tế.',
    avatar: '🛡️',
    color: LOBE_PRIMARY_COLORS.green.hex,
    industryLabel: 'Tech / Security',
  },
];

export const LobeChatStudio: React.FC<LobeChatStudioProps> = memo(({
  onGenerate,
  selectedIndustry,
  selectedConcept,
  onSelectConcept,
  activeModelName = 'nvidia/nemotron-3.5-lightning:free',
}) => {
  const { styles, cx } = useStyles();
  const [inputText, setInputText] = useState('');
  const [uploadedFilePayload, setUploadedFilePayload] = useState<UploadedFilePayload | null>(null);
  const [customProfileData, setCustomProfileData] = useState<MockProfile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleProcessFile = (file: File) => {
    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setCustomProfileData(parsed);
          setUploadedFilePayload(null);
        } catch {
          alert('File JSON không hợp lệ');
        }
      };
      reader.readAsText(file);
    } else {
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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectIndustryTab = (ind: typeof PRD_INDUSTRIES[0]) => {
    onSelectConcept(ind.defaultConcept, ind.id);
  };

  const handleSelectSample = (sample: typeof SAMPLE_CVS[0]) => {
    let concept: LayoutConcept = 'cyber-neon';
    if (sample.industry === 'tech-uiux') concept = 'glass-morph';
    else if (sample.industry === 'tech-devops') concept = 'holographic-grid';
    else if (sample.industry === 'tech-sec') concept = 'terminal';

    onSelectConcept(concept, sample.industry);

    const pdfDataUri = createTextPdfDataUri(sample.name, sample.textSnippet);
    setUploadedFilePayload({
      base64Data: pdfDataUri,
      mimeType: 'application/pdf',
      fileName: sample.filename,
      fileSize: '45 KB (Mẫu CV chuẩn PRD)',
    });
    setCustomProfileData(null);
  };

  const handleClearFile = () => {
    setUploadedFilePayload(null);
    setCustomProfileData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTriggerGenerate = () => {
    onGenerate(
      selectedIndustry,
      customProfileData || undefined,
      uploadedFilePayload || undefined,
      selectedConcept
    );
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to generate
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleTriggerGenerate();
    }
  };

  const activeCard = TEMPLATE_CARDS.find((c) => c.id === selectedConcept) || TEMPLATE_CARDS[0];

  return (
    <Flexbox
      flex={1}
      height="100%"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--lobe-bg-layout, #000000)',
      }}
    >
      {/* Scrollable Main Area (LobeChat Welcome + PRD Flow) */}
      <Flexbox
        align="center"
        flex={1}
        padding="32px 24px 190px"
        style={{ overflowY: 'auto' }}
      >
        <Center style={{ maxWidth: 860, width: '100%' }}>
          {/* LobeChat InboxWelcome Header */}
          <Flexbox className={styles.inboxContainer} gap={14} style={{ textAlign: 'center', marginBottom: 28 }}>
            <Flexbox align="center" gap={10} horizontal>
              <FluentEmoji emoji={'👋'} size={40} type={'anim'} />
              <h1 className={styles.heroTitle}>
                Gen-Folio — Hệ thống tạo Portfolio 1 chạm
              </h1>
            </Flexbox>

            <div className={styles.heroDesc}>
              Chuẩn thể lệ Vibe Code Challenge — Bóc tách CV thật qua <strong>Microsoft MarkItDown</strong> và <strong>Hermes Nemotron 3.5</strong>. Tạo website Landing Page tràn viền (Full-screen) tức thì trong &le; 3 giây.
            </div>

            <Flexbox align="center" gap={8} horizontal style={{ marginTop: 2 }}>
              <LobeModelTag model={activeModelName} />
              <Tag color="green">MarkItDown v0.0.1a4</Tag>
              <Tag color="purple">PRD v3.0 Approved</Tag>
            </Flexbox>
          </Flexbox>

          {/* PRD Step 1: Chọn Nhóm Ngành Nghề (Section 6.1) */}
          <Flexbox gap={8} style={{ width: '100%', marginBottom: 20 }}>
            <div className={styles.sectionTitle}>
              Bước 1: Chọn Ngành Nghề Mục Tiêu (PRD Section 6.1)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
              {PRD_INDUSTRIES.map((ind) => {
                const isSelected = selectedIndustry === ind.id;
                const Icon = ind.icon;
                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => handleSelectIndustryTab(ind)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: isSelected ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid var(--primary-color, #FAFAFA)' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? '0 0 16px rgba(var(--primary-rgb), 0.2)' : 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: isSelected ? 'var(--primary-color, #FAFAFA)' : 'rgba(255, 255, 255, 0.06)',
                        color: isSelected ? '#000' : '#888',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon style={{ width: 18, height: 18 }} />
                    </div>

                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                        {ind.label}
                      </div>
                      <div style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ind.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Flexbox>

          {/* LobeChat Agents / Template Cards Grid (4 Concepts) */}
          <Flexbox gap={8} style={{ width: '100%', marginBottom: 20 }}>
            <Flexbox align="center" distribution="space-between" horizontal style={{ padding: '0 4px' }}>
              <span className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                Phong cách Kiến trúc Wireframe (4 Layout Concepts)
              </span>
              <span style={{ fontSize: 11, color: '#888' }}>
                Đang kích hoạt: <strong style={{ color: 'var(--primary-color, #FAFAFA)' }}>{activeCard.title}</strong>
              </span>
            </Flexbox>

            <Grid gap={10} rows={2}>
              {TEMPLATE_CARDS.map((card) => {
                const isSelected = selectedConcept === card.id;
                return (
                  <div
                    className={styles.conceptCard}
                    key={card.id}
                    onClick={() => onSelectConcept(card.id, card.industry)}
                    style={{
                      borderColor: isSelected ? 'var(--primary-color, #FAFAFA)' : undefined,
                      boxShadow: isSelected ? '0 0 20px rgba(var(--primary-rgb), 0.2)' : undefined,
                    }}
                  >
                    <Flexbox align="flex-start" gap={12} horizontal>
                      <Avatar avatar={card.avatar} shape="circle" size={38} />
                      <Flexbox gap={3} style={{ overflow: 'hidden', flex: 1 }}>
                        <Flexbox align="center" gap={6} horizontal>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                            {card.title}
                          </span>
                          <Tag style={{ fontSize: 9 }}>{card.badge}</Tag>
                        </Flexbox>
                        <Typography.Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{ fontSize: 11, color: '#888', lineHeight: 1.4, margin: 0 }}
                        >
                          {card.desc}
                        </Typography.Paragraph>
                      </Flexbox>
                    </Flexbox>
                  </div>
                );
              })}
            </Grid>
          </Flexbox>

          {/* Quick 1-Click Sample CVs according to PRD */}
          <Flexbox gap={8} style={{ width: '100%', marginBottom: 16 }}>
            <span className={styles.sectionTitle} style={{ marginBottom: 2 }}>
              Hoặc thử nhanh 1 chạm với dữ liệu CV mẫu chuẩn ngành (PRD Section 12.3):
            </span>
            <Flexbox gap={8} horizontal wrap="wrap">
              {SAMPLE_CVS.map((sample) => (
                <div
                  className={styles.samplePill}
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                >
                  <Flexbox align="center" gap={6} horizontal>
                    <FolderOpen style={{ width: 13, height: 13, color: 'var(--primary-color, #FAFAFA)' }} />
                    <span style={{ fontWeight: 600 }}>{sample.name}</span>
                    <span style={{ fontSize: 11, color: '#888' }}>({sample.role})</span>
                  </Flexbox>
                </div>
              ))}
            </Flexbox>
          </Flexbox>
        </Center>
      </Flexbox>

      {/* LobeChat Signature Docked Input Bar (Floating at Bottom) */}
      <Flexbox
        className={cx(styles.dockedPanel, isDragOver && styles.dockedPanelDrag)}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <Flexbox gap={8} padding="10px 16px 14px">
          {/* Top Actions Row */}
          <Flexbox align="center" distribution="space-between" horizontal style={{ padding: '2px 0' }}>
            <Flexbox align="center" gap={6} horizontal>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.json,.txt"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />

              <ActionIcon
                icon={Paperclip}
                onClick={() => fileInputRef.current?.click()}
                size="middle"
                title="Tải lên CV của bạn (PDF / DOCX / JSON)"
              />

              <LobeModelTag model={activeModelName} />

              <Tag>{activeCard.title}</Tag>
            </Flexbox>

            {uploadedFilePayload && (
              <ActionIcon
                danger
                icon={Trash2}
                onClick={handleClearFile}
                size="small"
                title="Gỡ bỏ tệp CV"
              />
            )}
          </Flexbox>

          {/* Uploaded File Chip (if any) */}
          {uploadedFilePayload && (
            <div style={{ paddingBlock: 2 }}>
              <LobeFileItem
                fileName={uploadedFilePayload.fileName}
                fileSize={uploadedFilePayload.fileSize}
                onRemove={handleClearFile}
                status="ready"
              />
            </div>
          )}

          {/* Text Area */}
          <textarea
            className={styles.textArea}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              uploadedFilePayload
                ? `Đã nhận tệp ${uploadedFilePayload.fileName}. Nhấn Ctrl+Enter hoặc nút Gửi để bóc tách & tạo trang!`
                : 'Kéo thả file CV (PDF/DOCX) vào đây, nhập mô tả kỹ năng hoặc dùng CV mẫu để khởi tạo 1 chạm...'
            }
            rows={uploadedFilePayload ? 1 : 2}
          />

          {/* Bottom Send / Generate Row */}
          <Flexbox align="center" distribution="space-between" horizontal style={{ paddingTop: 4 }}>
            <LobeHotKeys 
              desc="để khởi tạo nhanh" 
              keys="ctrl+enter" 
            />

            <Space.Compact>
              <Button
                type="primary"
                onClick={handleTriggerGenerate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 36,
                  paddingInline: 18,
                  borderRadius: 10,
                  background: 'var(--primary-color, #FAFAFA)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: 12,
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(250, 250, 250, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>Khởi tạo Portfolio 1 chạm (≤ 3s)</span>
                <ArrowRight style={{ width: 14, height: 14 }} />
              </Button>
            </Space.Compact>
          </Flexbox>
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
});

LobeChatStudio.displayName = 'LobeChatStudio';
export default LobeChatStudio;
