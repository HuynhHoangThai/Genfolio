import React, { useState } from 'react';
import { 
  Settings2, 
  X, 
  Monitor, 
  Smartphone, 
  Download, 
  Home, 
  FileText, 
  Check, 
  Terminal, 
  Palette, 
  Briefcase,
  Share2,
  Sparkles,
  Layers,
  Flame,
  Radio,
  Building2,
  Wand2
} from 'lucide-react';
import { IndustryType, LayoutConcept, MockProfile } from '../../types/portfolio';
import { ShareModal } from './ShareModal';

interface FloatingWidgetProps {
  currentIndustry: IndustryType;
  currentConcept: LayoutConcept;
  currentColor: string;
  viewportMode: 'desktop' | 'mobile';
  profile: MockProfile;
  onColorChange: (hex: string, rgb: string) => void;
  onViewportToggle: (mode: 'desktop' | 'mobile') => void;
  onIndustryChange: (ind: IndustryType) => void;
  onConceptChange: (concept: LayoutConcept) => void;
  onOpenAiVisualModal: () => void;
  onResetToHome: () => void;
  onOpenResumeModal: () => void;
}

export const COLOR_PALETTES = [
  { name: 'Emerald', hex: '#10b981', rgb: '16, 185, 129' },
  { name: 'Cyber Cyan', hex: '#06b6d4', rgb: '6, 182, 212' },
  { name: 'Electric Indigo', hex: '#6366f1', rgb: '99, 102, 241' },
  { name: 'Solar Amber', hex: '#f59e0b', rgb: '245, 158, 11' },
  { name: 'Cinnabar Rose', hex: '#f43f5e', rgb: '244, 63, 94' },
  { name: 'Electric Lime', hex: '#84cc16', rgb: '132, 204, 22' },
  { name: 'Imperial Gold', hex: '#eab308', rgb: '234, 179, 8' },
];

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({
  currentIndustry,
  currentConcept,
  currentColor,
  viewportMode,
  profile,
  onColorChange,
  onViewportToggle,
  onIndustryChange,
  onConceptChange,
  onOpenAiVisualModal,
  onResetToHome,
  onOpenResumeModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gen-folio-${profile.industry}-${profile.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleWebShareTrigger = async () => {
    // If Web Share API is available, generate link and invoke navigator.share
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setIsSharing(true);
      try {
        const response = await fetch('/api/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile,
            concept: currentConcept,
            primaryColor: currentColor,
            expiresInHours: 48,
          }),
        });
        const data = await response.json();
        if (data.success && data.shareId) {
          const shareUrl = `${window.location.origin}/?share=${data.shareId}`;
          await navigator.share({
            title: `${profile.fullName} — ${profile.title} | Gen-Folio`,
            text: `Khám phá Portfolio tương tác của ${profile.fullName} (${profile.title}), phong cách ${currentConcept} (Liên kết có hiệu lực 48 giờ):`,
            url: shareUrl,
          });
          setCopiedNotification('Đã chia sẻ thành công!');
          setTimeout(() => setCopiedNotification(null), 3000);
        } else {
          // If server fails or returns error, open modal as fallback
          setIsShareModalOpen(true);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Web Share API error, opening Share Modal fallback:', err);
          setIsShareModalOpen(true);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Browser doesn't support Web Share API (e.g. desktop Chrome) -> open full Share Modal
      setIsShareModalOpen(true);
    }
  };

  const concepts: {
    id: LayoutConcept;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: 'cyber-neon', label: 'Cyber Neon', icon: Terminal },
    { id: 'glass-morph', label: 'Glass Morph', icon: Palette },
    { id: 'holographic-grid', label: 'Holo Grid', icon: Layers },
    { id: 'terminal', label: 'Classic Term', icon: Terminal },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Expanded Panel */}
      {isOpen && (
        <div className="mb-3 w-84 sm:w-92 rounded-2xl bg-neutral-900/95 border border-neutral-700/80 shadow-2xl backdrop-blur-xl p-5 text-neutral-200 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full theme-accent-bg animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Gen-Folio · Tinh chỉnh đa Concept
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Đóng widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Concept Wireframe Switcher (New feature!) */}
          <div className="mt-3.5">
            <span className="text-xs font-semibold text-neutral-300 block mb-2">
              Phong cách &amp; Bố cục Layout (5 Concepts)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {concepts.map((c) => {
                const Icon = c.icon;
                const isSelected = currentConcept === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onConceptChange(c.id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'theme-accent-border theme-accent-subtle-bg theme-accent-text font-bold'
                        : 'border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Color Palette Switcher */}
          <div className="mt-3.5 pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-300">Màu chủ đạo (&lt; 100ms)</span>
              <span className="text-[11px] font-mono theme-accent-text font-bold">
                {currentColor.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {COLOR_PALETTES.map((palette) => {
                const isSelected = currentColor.toLowerCase() === palette.hex.toLowerCase();
                return (
                  <button
                    key={palette.hex}
                    type="button"
                    onClick={() => onColorChange(palette.hex, palette.rgb)}
                    title={palette.name}
                    className="relative w-8 h-8 rounded-full transition-transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer shadow-md"
                    style={{ backgroundColor: palette.hex }}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 text-neutral-950 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: AI Visual Synthesizer Action */}
          <div className="mt-3.5 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onOpenAiVisualModal}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-neutral-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:opacity-95 shadow-md shadow-emerald-500/15 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Sinh / Đổi ảnh AI cho Landing Page</span>
            </button>
          </div>

          {/* Section 4: Viewport Mode Switcher */}
          <div className="mt-3.5 pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-neutral-300">Chế độ Viewport (Test)</span>
              <span className="text-[10px] text-neutral-400">
                {viewportMode === 'mobile' ? '375px Mobile' : '100% Tràn viền'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={() => onViewportToggle('desktop')}
                className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewportMode === 'desktop'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (Full)</span>
              </button>

              <button
                type="button"
                onClick={() => onViewportToggle('mobile')}
                className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewportMode === 'mobile'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (375px)</span>
              </button>
            </div>
          </div>

          {/* Section 5: Share & Publication Section */}
          <div className="mt-3.5 pt-3 border-t border-neutral-800">
            <span className="text-xs font-semibold text-neutral-300 block mb-2">
              Chia sẻ &amp; Xuất bản (Web Share API)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleWebShareTrigger}
                disabled={isSharing}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-300 transition-colors cursor-pointer disabled:opacity-50"
                title="Chia sẻ nhanh qua Web Share API hệ thống"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isSharing ? 'Đang tạo...' : 'Web Share'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/80 transition-colors cursor-pointer"
                title="Mở bảng điều khiển link tạm thời và mã QR"
              >
                <span>Link &amp; Mã QR</span>
              </button>
            </div>
          </div>

          {/* Section 6: Utility Actions */}
          <div className="mt-3.5 pt-3 border-t border-neutral-800 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
                title="Tải cấu hình JSON đã nạp"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất JSON</span>
              </button>

              <button
                type="button"
                onClick={onOpenResumeModal}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
                title="Xem hồ sơ định dạng CV gốc"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Xem CV Gốc</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onResetToHome}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/80 text-neutral-300 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-neutral-400" />
              <span>Tạo hồ sơ mới (Về Trang chủ)</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Trigger Buttons Dock */}
      <div className="flex items-center gap-2 justify-end">
        {copiedNotification && (
          <div className="bg-neutral-900 border border-emerald-500/50 text-xs px-3 py-1.5 rounded-full text-emerald-400 font-medium shadow-xl animate-in fade-in flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* Quick Web Share API Button */}
        <button
          type="button"
          onClick={handleWebShareTrigger}
          disabled={isSharing}
          className="group relative flex items-center gap-2 px-3.5 py-3 rounded-full bg-neutral-900/95 border border-emerald-500/40 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-xl cursor-pointer hover:border-emerald-400 hover:bg-neutral-800/95 disabled:opacity-50"
          title="Chia sẻ Portfolio bằng Web Share API"
        >
          <Share2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold tracking-wide text-emerald-300 hidden sm:inline">
            {isSharing ? 'Đang tạo...' : 'Chia sẻ'}
          </span>
          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden md:inline">
            Web Share
          </span>
        </button>

        {/* Customize Concept & Color Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-neutral-900/95 border border-neutral-700/90 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-xl cursor-pointer hover:border-neutral-500"
          title="Mở menu tùy biến nhanh"
        >
          <span 
            className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
            style={{ backgroundColor: currentColor }} 
          />
          <Settings2 className="w-4 h-4 text-neutral-300 group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-xs font-semibold tracking-wide hidden sm:inline">
            Bố cục &amp; Ảnh AI
          </span>
        </button>
      </div>

      {/* Temporary Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={profile}
        concept={currentConcept}
        primaryColor={currentColor}
      />
    </div>
  );
};

