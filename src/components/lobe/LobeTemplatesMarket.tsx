import React, { memo } from 'react';
import { Avatar, Grid, Tag, ActionIcon } from '@lobehub/ui';
import { Flexbox, Center } from 'react-layout-kit';
import { Terminal, Palette, Layers, ShieldCheck, Check, ArrowRight, Sparkles } from 'lucide-react';
import { IndustryType, LayoutConcept } from '../../types/portfolio';

interface LobeTemplatesMarketProps {
  currentConcept: LayoutConcept;
  onSelectConceptAndLaunch: (concept: LayoutConcept, industry: IndustryType) => void;
}

import { LOBE_PRIMARY_COLORS } from '../../styles/lobeColors';

const TEMPLATES = [
  {
    id: 'cyber-neon' as LayoutConcept,
    industry: 'tech-dev' as IndustryType,
    title: 'Cyber Neon HUD',
    category: 'Kỹ thuật · Cyberpunk HUD',
    avatar: '⚡',
    color: LOBE_PRIMARY_COLORS.cyan.hex,
    badge: 'Phổ biến nhất',
    description:
      'Giao diện viễn tưởng tối thượng với lưới laser quét scanline, đèn neon rực rỡ, typography monospace và tương tác HUD tương tự giao diện buồng lái không gian.',
    features: ['Laser Scanline Overlay', 'Matrix Glitch Title Effect', 'Interactive Terminal Console', 'HUD Status Metrics'],
    targetAudience: 'Software Engineers, Full-Stack, AI & Blockchain Developers',
  },
  {
    id: 'glass-morph' as LayoutConcept,
    industry: 'tech-uiux' as IndustryType,
    title: 'Glassmorphism Studio',
    category: 'Sáng tạo · Frosted Glass & Mesh',
    avatar: '🎨',
    color: LOBE_PRIMARY_COLORS.purple.hex,
    badge: 'Apple Style',
    description:
      'Thiết kế kính mờ đa tầng hiện đại lấy cảm hứng từ Apple VisionOS & macOS Sonoma. Nền liquid mesh gradient động, các thẻ nổi 3D đa chiều với độ sâu trường ảnh tuyệt mỹ.',
    features: ['Dynamic Mesh Gradients', 'Multi-Layer Glass Depth', 'Curated Project Showcase Carousel', 'Interactive Design Tokens'],
    targetAudience: 'UI/UX Designers, Product Designers, Creative Directors',
  },
  {
    id: 'holographic-grid' as LayoutConcept,
    industry: 'tech-devops' as IndustryType,
    title: 'Holo-Tech Grid',
    category: 'Hiện đại · Isometric Cloud Grid',
    avatar: '☁️',
    color: LOBE_PRIMARY_COLORS.magenta.hex,
    badge: 'Trending 2026',
    description:
      'Mặt phẳng isometric 3D kết hợp với hiệu ứng tráng nhám holographic và phối màu tươi sáng. Trực quan hóa hạ tầng đám mây, cụm microservices và chỉ số SLO/SLA sống động.',
    features: ['Isometric Plane Grid', 'Holographic Iridescent Foil', 'Cloud Topology Cards', 'Uptime & Reliability Matrix'],
    targetAudience: 'DevOps, SRE, Cloud Architects, Platform Engineers',
  },
  {
    id: 'terminal' as LayoutConcept,
    industry: 'tech-sec' as IndustryType,
    title: 'Classic Terminal',
    category: 'Bảo mật · Hacker CLI Shell',
    avatar: '🛡️',
    color: LOBE_PRIMARY_COLORS.green.hex,
    badge: 'Retro Geek',
    description:
      'Bản nâng cấp tối thượng cho phong cách Command-Line Interface. Tái hiện môi trường zsh/fish terminal hiện đại với phông chữ JetBrains Mono, cú pháp màu cú pháp đẹp mắt và tương tác phím tắt.',
    features: ['Interactive CLI Command Runner', 'ASCII Art & Hex Dumps', 'Vulnerability & CVE Timeline', 'Zero-Latency Keyboard Navigation'],
    targetAudience: 'Cybersecurity, Pentesting, Kernel Developers, Linux SysAdmins',
  },
];

export const LobeTemplatesMarket: React.FC<LobeTemplatesMarketProps> = memo(({
  currentConcept,
  onSelectConceptAndLaunch,
}) => {
  return (
    <Flexbox
      flex={1}
      height="100%"
      padding="32px 24px"
      style={{
        overflowY: 'auto',
        background: 'var(--lobe-bg-layout, #050505)',
      }}
    >
      <Center style={{ maxWidth: 960, width: '100%', margin: '0 auto' }}>
        {/* Header */}
        <Flexbox align="center" gap={8} style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#fff' }}>
            Kho Kiến Trúc Templates (Templates Market)
          </h1>
          <div style={{ fontSize: 13, color: '#888', maxWidth: 640 }}>
            Khám phá 4 phong cách kiến trúc giao diện độc bản cho Portfolio của bạn. Mỗi phong cách sở hữu wireframe, typography và tương tác hiệu ứng riêng biệt.
          </div>
        </Flexbox>

        {/* Grid of Templates */}
        <Grid gap={16} rows={2} style={{ width: '100%' }}>
          {TEMPLATES.map((tmpl) => {
            const isSelected = currentConcept === tmpl.id;
            return (
              <Flexbox
                key={tmpl.id}
                padding="20px"
                style={{
                  borderRadius: 16,
                  background: isSelected ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? `2px solid ${tmpl.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? `0 0 30px ${tmpl.color}33` : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Flexbox align="flex-start" distribution="space-between" horizontal style={{ marginBottom: 12 }}>
                  <Flexbox align="center" gap={12} horizontal>
                    <Avatar avatar={tmpl.avatar} shape="circle" size={44} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                        {tmpl.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                        {tmpl.category}
                      </div>
                    </div>
                  </Flexbox>

                  <Tag color="cyan">{tmpl.badge}</Tag>
                </Flexbox>

                <div style={{ fontSize: 12, color: '#aaa', lineHeight: 1.5, marginBottom: 16 }}>
                  {tmpl.description}
                </div>

                {/* Features Pill */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#666', fontFamily: 'monospace', marginBottom: 6 }}>
                    Đặc trưng nổi bật:
                  </div>
                  <Flexbox gap={6} horizontal wrap="wrap">
                    {tmpl.features.map((feat, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: 10,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#ccc',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        {feat}
                      </span>
                    ))}
                  </Flexbox>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => onSelectConceptAndLaunch(tmpl.id, tmpl.industry)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: 10,
                    background: isSelected ? tmpl.color : 'rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#000' : '#fff',
                    fontWeight: 700,
                    fontSize: 12,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{isSelected ? 'Đang kích hoạt · Mở Portfolio' : 'Chọn Template này & Dựng Portfolio'}</span>
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              </Flexbox>
            );
          })}
        </Grid>
      </Center>
    </Flexbox>
  );
});

LobeTemplatesMarket.displayName = 'LobeTemplatesMarket';
export default LobeTemplatesMarket;
