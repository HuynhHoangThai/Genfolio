import React, { memo, useState } from 'react';
import { ActionIcon, Avatar, SideNav } from '@lobehub/ui';
import { 
  MessageSquare, 
  Compass, 
  FolderClosed, 
  Settings, 
  Github, 
  Palette,
  Sparkles
} from 'lucide-react';

export type LobeTabKey = 'chat' | 'market' | 'files';

interface LobeSideNavProps {
  activeTab: LobeTabKey;
  onTabChange: (tab: LobeTabKey) => void;
  onOpenSettings: () => void;
  primaryColor: string;
  onColorChange: (hex: string, rgb: string) => void;
  activeModelName?: string;
}

import { MINIMALIST_PALETTE } from '../../styles/minimalistColors';

const PRESET_COLORS = Object.values(MINIMALIST_PALETTE);

export const LobeSideNav: React.FC<LobeSideNavProps> = memo(({
  activeTab,
  onTabChange,
  onOpenSettings,
  primaryColor,
  onColorChange,
  activeModelName = 'nemotron-3.5-lightning:free'
}) => {
  const [showColorMenu, setShowColorMenu] = useState(false);

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <SideNav
        avatar={
          <div 
            onClick={() => onTabChange('chat')}
            style={{ cursor: 'pointer' }}
            title="Genfolio AI Studio"
          >
            <Avatar 
              avatar="✨" 
              background="rgba(255, 255, 255, 0.08)"
              bordered
              shape="circle" 
              size={40} 
            />
          </div>
        }
        style={{ height: '100%', zIndex: 100 }}
        topActions={
          <>
            <ActionIcon
              active={activeTab === 'chat'}
              icon={MessageSquare}
              onClick={() => onTabChange('chat')}
              size="large"
              title="Studio / Chat & Tạo Portfolio"
              tooltipProps={{ placement: 'right' }}
            />
            <ActionIcon
              active={activeTab === 'market'}
              icon={Compass}
              onClick={() => onTabChange('market')}
              size="large"
              title="Kho mẫu Templates Market"
              tooltipProps={{ placement: 'right' }}
            />
            <ActionIcon
              active={activeTab === 'files'}
              icon={FolderClosed}
              onClick={() => onTabChange('files')}
              size="large"
              title="Hồ sơ CV & MarkItDown"
              tooltipProps={{ placement: 'right' }}
            />
          </>
        }
        bottomActions={
          <>
            <div style={{ position: 'relative' }}>
              <ActionIcon
                icon={Palette}
                onClick={() => setShowColorMenu(!showColorMenu)}
                size="large"
                title="Đổi màu giao diện Theme"
                tooltipProps={{ placement: 'right' }}
              />
              {showColorMenu && (
                <div 
                  style={{
                    position: 'absolute',
                    left: 56,
                    bottom: 0,
                    zIndex: 200,
                    padding: 8,
                    borderRadius: 12,
                    background: 'rgba(20, 20, 24, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.6)',
                    width: 140,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  }}
                  onMouseLeave={() => setShowColorMenu(false)}
                >
                  <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#888', padding: '2px 6px' }}>
                    Màu Theme
                  </div>
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        onColorChange(c.hex, c.rgb);
                        setShowColorMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 8px',
                        borderRadius: 8,
                        background: 'transparent',
                        border: 'none',
                        color: '#eee',
                        fontSize: 11,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span 
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: c.hex,
                          flexShrink: 0
                        }} 
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <ActionIcon
              icon={Settings}
              onClick={onOpenSettings}
              size="large"
              title={`Cài đặt Model AI (${activeModelName})`}
              tooltipProps={{ placement: 'right' }}
            />

            <ActionIcon
              icon={Github}
              onClick={() => window.open('https://github.com', '_blank')}
              size="large"
              title="Genfolio GitHub"
              tooltipProps={{ placement: 'right' }}
            />
          </>
        }
      />
    </div>
  );
});

LobeSideNav.displayName = 'LobeSideNav';
export default LobeSideNav;
