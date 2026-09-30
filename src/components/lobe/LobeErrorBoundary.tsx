import React, { memo } from 'react';
import { FluentEmoji } from '@lobehub/ui';
import { Flexbox, Center } from 'react-layout-kit';
import { RotateCcw, Home } from 'lucide-react';

interface LobeErrorProps {
  error?: Error | { message?: string } | null;
  reset?: () => void;
  onBackHome?: () => void;
  title?: string;
  desc?: string;
}

/**
 * Pixel-perfect clone of LobeChat's Error component
 * Reference: lobe-chat-ref/src/components/Error/index.tsx
 */
export const LobeError = memo<LobeErrorProps>(({
  error,
  reset,
  onBackHome,
  title = 'Đã xảy ra sự cố không mong muốn',
  desc = 'Hệ thống đã ghi nhận lỗi. Bạn có thể bấm Thử lại hoặc quay về Trang chủ để tiếp tục trải nghiệm.',
}) => {
  return (
    <Center
      style={{
        minHeight: '100%',
        width: '100%',
        padding: 32,
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--lobe-bg-layout, #000000)',
      }}
    >
      {/* LobeChat Giant Blurred Watermark Background */}
      <h1
        style={{
          filter: 'blur(8px)',
          fontSize: 'min(200px, 25vw)',
          fontWeight: 900,
          margin: 0,
          opacity: 0.08,
          position: 'absolute',
          zIndex: 0,
          color: '#ffffff',
          userSelect: 'none',
        }}
      >
        ERROR
      </h1>

      <Flexbox
        align="center"
        gap={12}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 480,
          textAlign: 'center',
        }}
      >
        <FluentEmoji emoji={'🤧'} size={64} />

        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '12px 0 4px', color: '#fff' }}>
          {title}
        </h2>

        <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6, marginBottom: 16 }}>
          {error?.message || desc}
        </p>

        <Flexbox gap={10} horizontal>
          {reset && (
            <button
              type="button"
              onClick={reset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <RotateCcw size={14} />
              <span>Thử lại</span>
            </button>
          )}

          {onBackHome && (
            <button
              type="button"
              onClick={onBackHome}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 20px',
                borderRadius: 10,
                background: 'var(--primary-color, #95f3d9)',
                color: '#000',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px var(--primary-glow)',
                transition: 'all 0.15s ease',
              }}
            >
              <Home size={14} />
              <span>Về Trang chủ</span>
            </button>
          )}
        </Flexbox>
      </Flexbox>
    </Center>
  );
});

LobeError.displayName = 'LobeError';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class LobeErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LobeErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <LobeError
          error={this.state.error}
          reset={this.handleReset}
          onBackHome={() => {
            this.handleReset();
            window.location.href = '/';
          }}
        />
      );
    }
    return this.props.children;
  }
}
