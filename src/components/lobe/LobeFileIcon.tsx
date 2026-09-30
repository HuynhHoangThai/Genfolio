import { FileTypeIcon, MaterialFileTypeIcon } from '@lobehub/ui';
import { memo } from 'react';

export const mimeTypeMap: Record<string, string> = {
  csv: '#43aa55',
  doc: '#2b56b1',
  docx: '#2b56b1',
  json: '#e5a824',
  pdf: '#de2429',
  ppt: '#c43e1b',
  pptx: '#c43e1b',
  text: '#607180',
  txt: '#607180',
  xls: '#2f6d3f',
  xlsx: '#2f6d3f',
};

export interface LobeFileIconProps {
  fileName: string;
  fileType?: string;
  size?: number;
  variant?: 'pure' | 'file' | 'folder' | 'raw';
}

/**
 * Cloned from lobe-chat-ref/src/components/FileIcon/index.tsx
 * Decoupled for Genfolio file presentation
 */
export const LobeFileIcon = memo<LobeFileIconProps>(({ fileName, size = 32, variant = 'file' }) => {
  if (Object.keys(mimeTypeMap).some((key) => fileName.toLowerCase().endsWith(`.${key}`))) {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    return (
      <FileTypeIcon
        color={mimeTypeMap[ext] || '#607180'}
        filetype={ext.toUpperCase()}
        size={size}
        type={'file'}
      />
    );
  }

  return (
    <MaterialFileTypeIcon 
      filename={fileName} 
      size={size} 
      type={'file'} 
      variant={variant === 'raw' ? 'raw' : 'raw'} 
    />
  );
});

LobeFileIcon.displayName = 'LobeFileIcon';
export default LobeFileIcon;
