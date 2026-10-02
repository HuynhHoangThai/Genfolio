import React, { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Sparkles } from 'lucide-react';

interface LobeBrandWatermarkProps {
  style?: React.CSSProperties;
}

export const LobeBrandWatermark = memo<LobeBrandWatermarkProps>(({ style }) => {
  return (
    <Flexbox
      align="center"
      flex="none"
      gap={6}
      horizontal
      style={{
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 11,
        padding: '8px 12px',
        userSelect: 'none',
        ...style,
      }}
    >
      <Sparkles size={12} style={{ color: 'var(--primary-color, #FAFAFA)' }} />
      <span>Powered by</span>
      <span style={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.8)', letterSpacing: '0.3px' }}>
        Genfolio
      </span>
      <span style={{ opacity: 0.4 }}>·</span>
      <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Portfolio Engine</span>
    </Flexbox>
  );
});

LobeBrandWatermark.displayName = 'LobeBrandWatermark';
export default LobeBrandWatermark;
