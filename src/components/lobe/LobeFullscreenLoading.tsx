import React, { memo } from 'react';
import { Icon } from '@lobehub/ui';
import { LobeChat } from '@lobehub/ui/brand';
import { Loader2 } from 'lucide-react';
import { Center, Flexbox } from 'react-layout-kit';

export interface LobeFullscreenLoadingProps {
  title?: string;
  subTitle?: string;
}

/**
 * Cloned from lobe-chat-ref/src/components/FullscreenLoading/index.tsx
 */
export const LobeFullscreenLoading = memo<LobeFullscreenLoadingProps>(({ 
  title = 'Đang khởi tạo Portfolio 1 chạm...', 
  subTitle = 'Bóc tách CV qua MarkItDown & LLM Engine'
}) => {
  return (
    <Flexbox
      height={'100%'}
      style={{
        userSelect: 'none',
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 9999,
      }}
      width={'100%'}
    >
      <Center flex={1} gap={16} width={'100%'}>
        <LobeChat size={56} type={'combine'} />
        <Center gap={10} horizontal style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>
          <Icon icon={Loader2} size={18} spin />
          <span>{title}</span>
        </Center>
        {subTitle && (
          <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.45)' }}>
            {subTitle}
          </span>
        )}
      </Center>
    </Flexbox>
  );
});

LobeFullscreenLoading.displayName = 'LobeFullscreenLoading';
export default LobeFullscreenLoading;
