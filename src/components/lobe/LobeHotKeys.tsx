import React, { memo, useState, useEffect } from 'react';
import { Icon } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Command, Delete, Option, CornerDownLeft, ChevronUp } from 'lucide-react';
import { rgba } from 'polished';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(
  ({ css, token }, inverseTheme: boolean) => css`
    font-size: 11px;

    kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 18px;
      height: 20px;
      padding-inline: 6px;

      font-family: inherit;
      line-height: 20px;
      color: ${inverseTheme ? token.colorTextTertiary : token.colorTextSecondary};
      text-align: center;

      background: ${inverseTheme ? rgba(token.colorTextTertiary, 0.15) : token.colorFillTertiary};
      border-radius: ${token.borderRadiusSM || 4}px;
      border: 1px solid ${token.colorBorderSecondary};
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }
  `,
);

export interface LobeHotKeysProps {
  desc?: string;
  inverseTheme?: boolean;
  keys: string;
}

/**
 * Cloned from lobe-chat-ref/src/components/HotKeys/index.tsx
 */
export const LobeHotKeys = memo<LobeHotKeysProps>(({ keys, desc, inverseTheme = false }) => {
  const { styles } = useStyles(inverseTheme);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform));
  }, []);

  const mapping: Record<string, React.ReactNode> = {
    alt: isMac ? <Icon icon={Option} size={11} /> : 'alt',
    backspace: isMac ? <Icon icon={Delete} size={11} /> : 'backspace',
    cmd: isMac ? <Icon icon={Command} size={11} /> : 'ctrl',
    ctrl: isMac ? <Icon icon={Command} size={11} /> : 'ctrl',
    enter: <Icon icon={CornerDownLeft} size={11} />,
    shift: <Icon icon={ChevronUp} size={11} />,
  };

  const keysGroup = keys
    .split('+')
    .filter(Boolean)
    .map((k) => {
      const lower = k.trim().toLowerCase();
      return mapping[lower] ?? k.trim();
    });

  const content = (
    <Flexbox align="center" className={styles} gap={3} horizontal>
      {keysGroup.map((key, index) => (
        <kbd key={index}>
          <span>{typeof key === 'string' ? key.toUpperCase() : key}</span>
        </kbd>
      ))}
    </Flexbox>
  );

  if (!desc) return content;

  return (
    <Flexbox align="center" gap={8} horizontal style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.45)' }}>
      {content}
      <span>{desc}</span>
    </Flexbox>
  );
});

LobeHotKeys.displayName = 'LobeHotKeys';
export default LobeHotKeys;
