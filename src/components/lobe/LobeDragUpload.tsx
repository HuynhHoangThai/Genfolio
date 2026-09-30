import React, { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Center, Flexbox } from 'react-layout-kit';
import { FileText, FileUp, Sparkles } from 'lucide-react';

const DRAGGING_ROOT_ID = 'lobe-dragging-root';
const BLOCK_SIZE = 64;
const ICON_SIZE = 32;

interface LobeDragUploadProps {
  onUploadFile: (file: File) => void;
  title?: string;
  desc?: string;
}

export const LobeDragUpload = memo<LobeDragUploadProps>(({
  onUploadFile,
  title = 'Thả tệp CV để khởi tạo 1 chạm',
  desc = 'Hỗ trợ PDF, DOCX, TXT hoặc JSON cấu hình — Xử lý qua Microsoft MarkItDown',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: DragEvent) => {
    if (!e.dataTransfer?.items || e.dataTransfer.items.length === 0) return;
    const isFile = e.dataTransfer.types.includes('Files');
    if (isFile) {
      dragCounter.current += 1;
      e.preventDefault();
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    if (!e.dataTransfer?.items || e.dataTransfer.items.length === 0) return;
    const isFile = e.dataTransfer.types.includes('Files');
    if (isFile) {
      e.preventDefault();
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    if (!e.dataTransfer?.items || e.dataTransfer.items.length === 0) return;
    const isFile = e.dataTransfer.types.includes('Files');
    if (isFile) {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDragging(false);
      }
    }
  };

  const handleDrop = (e: DragEvent) => {
    if (!e.dataTransfer?.items || e.dataTransfer.items.length === 0) return;
    const isFile = e.dataTransfer.types.includes('Files');
    if (isFile) {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files[0]) {
        onUploadFile(files[0]);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  if (!isDragging) return null;

  return createPortal(
    <Center
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'all 0.25s ease-in-out',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 360,
          padding: 16,
          background: 'rgba(15, 18, 26, 0.95)',
          border: '1px solid var(--primary-border, rgba(149, 243, 217, 0.4))',
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 32px var(--primary-glow, rgba(149, 243, 217, 0.2))',
        }}
      >
        <Center
          gap={14}
          style={{
            width: '100%',
            height: '100%',
            padding: '24px 16px',
            border: '2px dashed var(--primary-color, #95f3d9)',
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          {/* LobeChat 3 Tilted Floating Document Cards */}
          <Flexbox horizontal style={{ marginTop: -36, marginBottom: 8 }}>
            {/* Card Left: PDF Document (-20deg) */}
            <Center
              height={BLOCK_SIZE * 1.2}
              width={BLOCK_SIZE}
              style={{
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ef4444',
                borderRadius: 12,
                transform: 'rotateZ(-20deg) translateX(12px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
              }}
            >
              <FileText size={ICON_SIZE} />
            </Center>

            {/* Card Center: Upload Action (Elevated, 0deg) */}
            <Center
              height={BLOCK_SIZE * 1.25}
              width={BLOCK_SIZE}
              style={{
                background: 'var(--primary-color, #95f3d9)',
                color: '#000',
                borderRadius: 14,
                transform: 'translateY(-14px)',
                zIndex: 2,
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.6), 0 0 24px var(--primary-glow)',
              }}
            >
              <FileUp size={ICON_SIZE + 4} strokeWidth={2.5} />
            </Center>

            {/* Card Right: AI Structured Data (+20deg) */}
            <Center
              height={BLOCK_SIZE * 1.2}
              width={BLOCK_SIZE}
              style={{
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#38bdf8',
                borderRadius: 12,
                transform: 'rotateZ(20deg) translateX(-12px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Sparkles size={ICON_SIZE} />
            </Center>
          </Flexbox>

          <Flexbox align="center" gap={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5, maxWidth: 280 }}>
              {desc}
            </div>
          </Flexbox>
        </Center>
      </div>
    </Center>,
    document.body,
  );
});

LobeDragUpload.displayName = 'LobeDragUpload';
export default LobeDragUpload;
