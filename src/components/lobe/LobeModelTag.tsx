import React, { memo } from 'react';
import { Tag } from '@lobehub/ui';
import { LobeModelIcon } from './LobeModelIcon';

interface LobeModelTagProps {
  model: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Cloned from lobe-chat-ref/src/components/ModelTag/index.tsx
 */
export const LobeModelTag = memo<LobeModelTagProps>(({ model, onClick, style }) => {
  // Format model name for clean display (e.g. 'nvidia/nemotron-3.5-lightning:free' -> 'nemotron-3.5-lightning')
  const displayName = model.split('/')[1] || model;
  const cleanName = displayName.replace(':free', '');

  return (
    <Tag
      icon={<LobeModelIcon model={model} size={13} />}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'monospace',
        fontSize: 11,
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
        ...style,
      }}
    >
      {cleanName}
    </Tag>
  );
});

LobeModelTag.displayName = 'LobeModelTag';
export default LobeModelTag;
