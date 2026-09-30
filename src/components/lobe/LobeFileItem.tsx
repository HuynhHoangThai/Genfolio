import React, { memo } from 'react';
import { ActionIcon } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';
import LobeFileIcon from './LobeFileIcon';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    border-radius: 10px;
    background: ${token.colorFillQuaternary};
    border: 1px solid ${token.colorBorderSecondary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 320px;
    user-select: none;

    &:hover {
      background: ${token.colorFillTertiary};
      border-color: ${token.colorBorder};
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
    }
  `,
  fileName: css`
    font-size: 13px;
    font-weight: 500;
    color: ${token.colorText};
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  fileMeta: css`
    font-size: 11px;
    color: ${token.colorTextDescription};
  `,
  deleteBtn: css`
    color: ${token.colorTextSecondary};
    &:hover {
      color: ${token.colorError} !important;
      background: rgba(255, 77, 79, 0.15) !important;
    }
  `,
}));

export interface LobeFileItemProps {
  fileName: string;
  fileSize?: string | number;
  onRemove?: () => void;
  status?: 'ready' | 'processing' | 'done';
}

/**
 * Cloned from lobe-chat-ref/src/components/FileList and adapted for document upload
 */
export const LobeFileItem = memo<LobeFileItemProps>(({ fileName, fileSize, onRemove, status = 'ready' }) => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <LobeFileIcon fileName={fileName} size={28} />

      <Flexbox gap={1} style={{ minWidth: 0, flex: 1 }}>
        <div className={styles.fileName} title={fileName}>
          {fileName}
        </div>
        <Flexbox align="center" gap={6} horizontal>
          {fileSize && <span className={styles.fileMeta}>{fileSize}</span>}
          {status === 'ready' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#10b981' }}>
              <CheckCircle2 style={{ width: 10, height: 10 }} />
              MarkItDown
            </span>
          )}
        </Flexbox>
      </Flexbox>

      {onRemove && (
        <ActionIcon
          className={styles.deleteBtn}
          icon={Trash2}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          size="small"
          title="Xóa tệp này"
        />
      )}
    </div>
  );
});

LobeFileItem.displayName = 'LobeFileItem';
export default LobeFileItem;
