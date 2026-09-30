import React, { memo } from 'react';
import { FluentEmoji } from '@lobehub/ui';
import { Button } from 'antd';
import { Flexbox } from 'react-layout-kit';

export interface LobeNotFoundProps {
  onBackHome?: () => void;
  title?: string;
  desc?: string;
  backText?: string;
}

/**
 * Cloned from lobe-chat-ref/src/components/404/index.tsx
 */
export const LobeNotFound = memo<LobeNotFoundProps>(({
  onBackHome,
  title = 'Không tìm thấy trang hoặc hồ sơ',
  desc = 'Hồ sơ hoặc trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
  backText = 'Trở về trang chủ',
}) => {
  return (
    <Flexbox
      align={'center'}
      justify={'center'}
      style={{
        minHeight: '100%',
        width: '100%',
        position: 'relative',
        padding: 32,
        userSelect: 'none',
      }}
    >
      <h1
        style={{
          filter: 'blur(10px)',
          fontSize: 'min(180px, 35vw)',
          fontWeight: 900,
          margin: 0,
          opacity: 0.08,
          position: 'absolute',
          zIndex: 0,
          color: '#fff',
          letterSpacing: '-0.05em',
        }}
      >
        404
      </h1>
      <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FluentEmoji emoji={'👀'} size={64} />
        <h2
          style={{
            fontWeight: 700,
            fontSize: 20,
            marginTop: '1.2em',
            marginBottom: '0.4em',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            marginBottom: '2em',
            color: 'rgba(255, 255, 255, 0.55)',
            fontSize: 13,
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          {desc}
        </p>
        {onBackHome && (
          <Button onClick={onBackHome} type={'primary'}>
            {backText}
          </Button>
        )}
      </div>
    </Flexbox>
  );
});

LobeNotFound.displayName = 'LobeNotFound';
export default LobeNotFound;
