import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  RefreshCw, 
  Palette, 
  Check, 
  Image as ImageIcon, 
  Wand2, 
  Layers, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';
import { MockProfile, ProjectItem } from '../../types/portfolio';
import { generateProceduralVisual, generateProceduralAvatar } from '../../utils/aiVisuals';

interface AiVisualModalProps {
  isOpen: boolean;
  profile: MockProfile;
  onClose: () => void;
  onUpdateProfileVisuals: (updatedProfile: MockProfile) => void;
}

export const AiVisualModal: React.FC<AiVisualModalProps> = ({
  isOpen,
  profile,
  onClose,
  onUpdateProfileVisuals,
}) => {
  if (!isOpen) return null;

  const [selectedStyle, setSelectedStyle] = useState<string>('tech');
  const [accentColor, setAccentColor] = useState<string>('#10b981');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const stylePresets: {
    id: string;
    name: string;
    desc: string;
    defaultColor: string;
  }[] = [
    {
      id: 'tech',
      name: 'Cybernetic Systems',
      desc: 'Sơ đồ mạng phân tán, node microservices và dòng mã phát sáng.',
      defaultColor: '#10b981',
    },
    {
      id: 'cyberpunk',
      name: 'Holo-Deck HUD',
      desc: 'Mặt lưới neon, thước ngắm điện tử và giao diện tương lai.',
      defaultColor: '#06b6d4',
    },
    {
      id: 'creative',
      name: '3D Spatial Glass',
      desc: 'Khối kính mờ chuyển sắc, quả cầu ánh sáng iridescent và chiều sâu 3D.',
      defaultColor: '#f43f5e',
    },
    {
      id: 'brutalist',
      name: 'Neo-Brutalist Raw',
      desc: 'Viền đen đậm, sọc vàng cảnh báo và typography bản in kiến trúc.',
      defaultColor: '#facc15',
    },
    {
      id: 'business',
      name: 'Executive Analytics',
      desc: 'Biểu đồ tăng trưởng tài chính, đường cong doanh số và báo cáo chiến lược.',
      defaultColor: '#f59e0b',
    },
  ];

  const handleApplyPreset = (styleId: typeof selectedStyle) => {
    setSelectedStyle(styleId);
    const found = stylePresets.find((p) => p.id === styleId);
    if (found) setAccentColor(found.defaultColor);
  };

  const handleGenerateAllVisuals = () => {
    setIsGenerating(true);
    setSuccessMessage(null);

    setTimeout(() => {
      // Generate new artworks for all projects
      const updatedProjects: ProjectItem[] = profile.projects.map((proj) => ({
        ...proj,
        imageUrl: generateProceduralVisual({
          theme: selectedStyle,
          title: customPrompt ? `${proj.title} (${customPrompt})` : proj.title,
          category: proj.category,
          primaryColor: accentColor,
          aspectRatio: '16:9',
        }),
      }));

      // Generate new avatar
      const updatedAvatar = generateProceduralAvatar(
        profile.fullName,
        'tech-dev',
        accentColor
      );

      const updatedProfile: MockProfile = {
        ...profile,
        avatarImage: updatedAvatar,
        projects: updatedProjects,
      };

      onUpdateProfileVisuals(updatedProfile);
      setIsGenerating(false);
      setSuccessMessage('Đã sinh mới toàn bộ hình ảnh AI cho hồ sơ!');

      setTimeout(() => setSuccessMessage(null), 3000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Visual &amp; Artwork Synthesizer</h2>
              <p className="text-xs text-neutral-400">Tự động sinh ảnh minh họa cho các dự án &amp; chân dung đại diện</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success message banner */}
        {successMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Section 1: Choose Artwork Theme Concept */}
        <div className="mt-6">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block mb-3">
            1. Chọn phong cách nghệ thuật thị giác
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {stylePresets.map((preset) => {
              const isSelected = selectedStyle === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-950/30 ring-1 ring-emerald-400 text-white'
                      : 'border-neutral-800 bg-neutral-950/50 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{preset.name}</span>
                    <span 
                      className="w-3 h-3 rounded-full border border-black"
                      style={{ backgroundColor: preset.defaultColor }}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">{preset.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Custom Text Prompt (Optional) */}
        <div className="mt-6">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block mb-2">
            2. Tùy chỉnh Prompt bổ trợ (Tùy chọn)
          </label>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ví dụ: dark moody studio rim lighting, neon circuits, clean vectors..."
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        {/* Live Artwork Preview */}
        <div className="mt-6 pt-5 border-t border-neutral-800">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-3">
            Bản xem trước minh họa:
          </span>

          <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-950 aspect-[16/9] max-h-56 relative">
            <img
              src={generateProceduralVisual({
                theme: selectedStyle,
                title: profile.projects[0]?.title || 'System Architecture',
                category: profile.projects[0]?.category || 'Flagship Initiative',
                primaryColor: accentColor,
                aspectRatio: '16:9',
              })}
              alt="Artwork preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 text-[10px] font-mono bg-black/80 text-emerald-400 rounded">
              STYLE: {selectedStyle.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleGenerateAllVisuals}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang tổng hợp hình ảnh...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Áp dụng hình ảnh AI vào toàn bộ trang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
