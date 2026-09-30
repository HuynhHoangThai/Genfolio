import React, { memo, type ReactNode } from 'react';
import { Flexbox } from 'react-layout-kit';

interface LobeSidebarHeaderProps {
  title: ReactNode;
  actions?: ReactNode;
  style?: React.CSSProperties;
}

/**
 * Cloned from lobe-chat-ref/src/components/SidebarHeader/index.tsx
 */
export const LobeSidebarHeader = memo<LobeSidebarHeaderProps>(({
  title,
  actions,
  style,
}) => {
  return (
    <Flexbox
      align="center"
      distribution="space-between"
      horizontal
      padding={14}
      paddingInline={16}
      style={{
        zIndex: 10,
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'transparent',
        ...style,
      }}
    >
      <Flexbox align="center" gap={6} horizontal>
        {title}
      </Flexbox>
      <Flexbox align="center" gap={4} horizontal>
        {actions}
      </Flexbox>
    </Flexbox>
  );
});

LobeSidebarHeader.displayName = 'LobeSidebarHeader';
export default LobeSidebarHeader;
