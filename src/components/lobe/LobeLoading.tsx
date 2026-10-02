import React, { memo } from 'react';
import { Center } from 'react-layout-kit';

interface BubblesLoadingProps {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * Pixel-perfect clone of LobeChat's BubblesLoading component
 * Reference: lobe-chat-ref/src/components/BubblesLoading/index.tsx
 */
export const BubblesLoading = memo<BubblesLoadingProps>(({
  color = 'var(--primary-color, #FAFAFA)',
  size = 24,
  style,
}) => {
  return (
    <Center style={{ height: size, width: (size * 60) / 32, ...style }}>
      <svg
        viewBox="0 0 60 32"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', fill: color }}
      >
        <circle cx="7" cy="16" r="6">
          <animate
            attributeName="opacity"
            values="1;0.4;0.2;1"
            dur="1.4s"
            repeatCount="indefinite"
            begin="0s"
          />
          <animate
            attributeName="cy"
            values="16;12;20;16"
            dur="1.4s"
            repeatCount="indefinite"
            begin="0s"
          />
        </circle>
        <circle cx="30" cy="16" r="6">
          <animate
            attributeName="opacity"
            values="1;0.4;0.2;1"
            dur="1.4s"
            repeatCount="indefinite"
            begin="0.25s"
          />
          <animate
            attributeName="cy"
            values="16;12;20;16"
            dur="1.4s"
            repeatCount="indefinite"
            begin="0.25s"
          />
        </circle>
        <circle cx="53" cy="16" r="6">
          <animate
            attributeName="opacity"
            values="1;0.4;0.2;1"
            dur="1.4s"
            repeatCount="indefinite"
            begin="0.5s"
          />
          <animate
            attributeName="cy"
            values="16;12;20;16"
            dur="1.4s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </circle>
      </svg>
    </Center>
  );
});

BubblesLoading.displayName = 'BubblesLoading';

/**
 * Pixel-perfect clone of LobeChat's CircleLoading spinner
 */
export const CircleLoading = memo<{ size?: number; color?: string }>(({
  size = 20,
  color = 'var(--primary-color, #FAFAFA)',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
});

CircleLoading.displayName = 'CircleLoading';
