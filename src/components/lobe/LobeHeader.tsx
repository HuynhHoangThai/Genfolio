import React, { memo } from 'react';
import { ActionIcon, Tag } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';
import { 
  PanelLeftOpen, 
  Monitor, 
  Smartphone, 
  Share2, 
  FileText, 
  RotateCcw,
} from 'lucide-react';
import { LayoutConcept, MockProfile } from '../../types/portfolio';
import { LobeModelTag } from './LobeModelTag';

interface LobeHeaderProps {
  appStage: 'home' | 'processing' | 'result';
  activeProfile: MockProfile;
  currentConcept: LayoutConcept;
  viewportMode: 'desktop' | 'mobile';
  onViewportToggle: (mode: 'desktop' | 'mobile') => void;
  onOpenSettings: () => void;
  onOpenShareModal: () => void;
  onOpenResumeModal: () => void;
  onResetToHome: () => void;
  activeModelName?: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const CONCEPT_NAMES: Record<LayoutConcept, string> = {
  'cyber-neon': 'Cyber Neon HUD',
  'glass-morph': 'Glassmorphism Studio',
  'holographic-grid': 'Holo-Tech Grid',
  'terminal': 'Classic Terminal',
};

/**
 * LobeChat Workspace Header
 * Decoupled and refined:
 * - Removed squished vertical subtitle completely
 * - Uses clean flexible container with border-bottom and dark glassmorphic styling
 * - Features official LobeModelTag (clickable for AI settings)
 * - Result stage controls (desktop/mobile switch, resume, share, return to studio)
 */
export const LobeHeader: React.FC<LobeHeaderProps> = memo(({
  appStage,
  activeProfile,
  currentConcept,
  viewportMode,
  onViewportToggle,
  onOpenSettings,
  onOpenShareModal,
  onOpenResumeModal,
  onResetToHome,
  activeModelName = 'nvidia/nemotron-3.5-lightning:free',
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <Flexbox
      align="center"
      distribution="space-between"
      horizontal
      style={{
        height: 48,
        minHeight: 48,
        maxHeight: 48,
        paddingInline: 16,
        background: 'var(--lobe-bg-layout, #050505)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 40,
        userSelect: 'none',
      }}
    >
      {/* Left side actions and model indicator */}
      <Flexbox align="center" gap={10} horizontal style={{ minWidth: 0 }}>
        {!isSidebarOpen && (
          <ActionIcon
            icon={PanelLeftOpen}
            onClick={onToggleSidebar}
            size="middle"
            title="Mở sidebar"
          />
        )}

        <LobeModelTag model={activeModelName} onClick={onOpenSettings} />

        {appStage === 'result' && (
          <Flexbox align="center" gap={8} horizontal style={{ minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
              {activeProfile.fullName}
            </span>
            <Tag color="cyan" style={{ fontSize: 10 }}>
              {CONCEPT_NAMES[currentConcept]}
            </Tag>
          </Flexbox>
        )}
      </Flexbox>

      {/* Right side actions */}
      <Flexbox align="center" gap={6} horizontal>
        {appStage === 'result' && (
          <>
            <ActionIcon
              active={viewportMode === 'desktop'}
              icon={Monitor}
              onClick={() => onViewportToggle('desktop')}
              size="middle"
              title="Desktop tràn viền"
            />
            <ActionIcon
              active={viewportMode === 'mobile'}
              icon={Smartphone}
              onClick={() => onViewportToggle('mobile')}
              size="middle"
              title="Mobile 375px"
            />
            <ActionIcon
              icon={FileText}
              onClick={onOpenResumeModal}
              size="middle"
              title="Xem hồ sơ CV đầy đủ"
            />
            <ActionIcon
              icon={Share2}
              onClick={onOpenShareModal}
              size="middle"
              title="Tạo liên kết chia sẻ trực tuyến (24h)"
            />
            <ActionIcon
              icon={RotateCcw}
              onClick={onResetToHome}
              size="middle"
              title="Trở về Studio khởi tạo"
            />
          </>
        )}
      </Flexbox>
    </Flexbox>
  );
});

LobeHeader.displayName = 'LobeHeader';
export default LobeHeader;
