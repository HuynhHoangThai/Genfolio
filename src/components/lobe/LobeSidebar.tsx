import React, { memo, useState } from 'react';
import { ActionIcon, Avatar, SearchBar, Tag } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';
import { 
  Plus, 
  PanelLeftClose, 
  Trash2, 
  CheckCircle2,
  Cpu,
  Zap,
  Terminal,
  Palette,
  Layers,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { IndustryType, LayoutConcept, MockProfile } from '../../types/portfolio';
import { UploadedFilePayload } from '../loading/AiProcessingModal';
import { LobeBrandWatermark } from './LobeBrandWatermark';
import { LobeSidebarHeader } from './LobeSidebarHeader';
import { LobeModelTag } from './LobeModelTag';

interface LobeSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedIndustry: IndustryType;
  currentConcept: LayoutConcept;
  activeProfile: MockProfile;
  uploadedFile: UploadedFilePayload | null;
  onSelectPreset: (industry: IndustryType, concept: LayoutConcept) => void;
  onNewPortfolio: () => void;
  onClearUploadedFile: () => void;
  activeModelName?: string;
}

export const PRESET_ITEMS = [
  {
    id: 'tech-dev',
    name: 'Huỳnh Kỳ Sơn',
    role: 'Senior Full-Stack & Cloud Architect',
    industry: 'tech-dev' as IndustryType,
    concept: 'cyber-neon' as LayoutConcept,
    icon: Terminal,
    conceptName: 'Cyber Neon HUD',
    tag: 'Tech',
    accentColor: '#95f3d9',
    avatar: '⚡',
  },
  {
    id: 'tech-uiux',
    name: 'Alex Rivera',
    role: 'Lead UI/UX & Spatial Designer',
    industry: 'tech-uiux' as IndustryType,
    concept: 'glass-morph' as LayoutConcept,
    icon: Palette,
    conceptName: 'Glassmorphism Studio',
    tag: 'Creative',
    accentColor: '#bd54c6',
    avatar: '🎨',
  },
  {
    id: 'tech-devops',
    name: 'Marcus Vance',
    role: 'Principal Solution Architect & BA',
    industry: 'tech-devops' as IndustryType,
    concept: 'holographic-grid' as LayoutConcept,
    icon: Layers,
    conceptName: 'Holo-Tech Grid',
    tag: 'Business',
    accentColor: '#e34ba9',
    avatar: '☁️',
  },
  {
    id: 'tech-sec',
    name: 'Lê Quốc Bảo',
    role: 'Cloud Security & DevSecOps Lead',
    industry: 'tech-sec' as IndustryType,
    concept: 'terminal' as LayoutConcept,
    icon: ShieldCheck,
    conceptName: 'Classic Terminal',
    tag: 'Tech / Security',
    accentColor: '#62c473',
    avatar: '🛡️',
  },
];

export const LobeSidebar: React.FC<LobeSidebarProps> = memo(({
  isOpen,
  onToggle,
  selectedIndustry,
  currentConcept,
  activeProfile,
  uploadedFile,
  onSelectPreset,
  onNewPortfolio,
  onClearUploadedFile,
  activeModelName = 'nvidia/nemotron-3.5-lightning:free',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredPresets = PRESET_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.conceptName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Flexbox
      height="100%"
      style={{
        width: 280,
        flexShrink: 0,
        background: 'var(--lobe-bg-container, #0a0a0c)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 50,
      }}
    >
      {/* Top Header Bar */}
      <LobeSidebarHeader
        title={
          <Flexbox align="center" gap={8} horizontal>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px', color: '#fff' }}>
              Genfolio
            </span>
            <Tag color="cyan">Studio</Tag>
          </Flexbox>
        }
        actions={
          <>
            <ActionIcon
              icon={Plus}
              onClick={onNewPortfolio}
              size="small"
              title="Khởi tạo mới"
            />
            <ActionIcon
              icon={PanelLeftClose}
              onClick={onToggle}
              size="small"
              title="Đóng sidebar"
            />
          </>
        }
      />

      {/* Search Bar */}
      <Flexbox padding="10px 12px 6px">
        <SearchBar
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm hồ sơ & template..."
          shortKey="k"
          value={searchTerm}
        />
      </Flexbox>

      {/* Uploaded File Pill (if active) */}
      {uploadedFile && (
        <Flexbox padding="4px 12px 8px">
          <Flexbox
            align="center"
            distribution="space-between"
            horizontal
            padding="8px 10px"
            style={{
              background: 'rgba(var(--primary-rgb), 0.1)',
              border: '1px solid rgba(var(--primary-rgb), 0.3)',
              borderRadius: 10,
            }}
          >
            <Flexbox align="center" gap={8} horizontal style={{ overflow: 'hidden' }}>
              <Avatar avatar="📄" size={24} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {uploadedFile.fileName}
                </div>
                <div style={{ fontSize: 10, color: 'var(--primary-color)', fontFamily: 'monospace' }}>
                  {uploadedFile.fileSize || 'Đã tải lên'} · Sẵn sàng
                </div>
              </div>
            </Flexbox>
            <ActionIcon
              danger
              icon={Trash2}
              onClick={onClearUploadedFile}
              size="small"
              title="Gỡ bỏ CV"
            />
          </Flexbox>
        </Flexbox>
      )}

      {/* Presets & Sessions List */}
      <Flexbox
        flex={1}
        gap={4}
        padding="6px 10px"
        style={{ overflowY: 'auto' }}
      >
        <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#666', fontFamily: 'monospace', padding: '4px 6px' }}>
          Hồ sơ mẫu & Kiến trúc (Presets)
        </div>

        {filteredPresets.map((item) => {
          const isSelected =
            !uploadedFile &&
            selectedIndustry === item.industry &&
            currentConcept === item.concept;

          return (
            <Flexbox
              key={item.id}
              align="center"
              distribution="space-between"
              horizontal
              onClick={() => onSelectPreset(item.industry, item.concept)}
              padding="8px 10px"
              style={{
                borderRadius: 10,
                cursor: 'pointer',
                background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: isSelected ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <Flexbox align="center" gap={10} horizontal style={{ overflow: 'hidden' }}>
                <Avatar avatar={item.avatar} shape="circle" size={32} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#888', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {item.conceptName}
                  </div>
                </div>
              </Flexbox>

              <Tag color={isSelected ? 'cyan' : 'default'} style={{ fontSize: 9 }}>
                {item.tag}
              </Tag>
            </Flexbox>
          );
        })}
      </Flexbox>

      {/* Bottom Status Card */}
      <Flexbox
        padding="12px"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(0, 0, 0, 0.4)',
        }}
      >
        <Flexbox
          gap={6}
          padding="10px"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 10,
          }}
        >
          <Flexbox align="center" distribution="space-between" horizontal>
            <Flexbox align="center" gap={6} horizontal style={{ fontSize: 10, color: '#888' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              <span>Model Engine</span>
            </Flexbox>
            <Tag color="green" style={{ fontSize: 9 }}>FREE</Tag>
          </Flexbox>

          <div style={{ paddingTop: 2, paddingBottom: 2 }}>
            <LobeModelTag model={activeModelName} style={{ width: '100%', justifyContent: 'flex-start' }} />
          </div>

          <Flexbox align="center" distribution="space-between" horizontal style={{ fontSize: 10, color: '#777', paddingTop: 4, borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
            <span>MarkItDown Extractor</span>
            <span style={{ color: '#10b981', fontFamily: 'monospace' }}>Active</span>
          </Flexbox>
        </Flexbox>

        <LobeBrandWatermark style={{ marginTop: 6, justifyContent: 'center' }} />
      </Flexbox>
    </Flexbox>
  );
});

LobeSidebar.displayName = 'LobeSidebar';
export default LobeSidebar;
