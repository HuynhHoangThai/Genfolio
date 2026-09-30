import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import LobeFileItem, { LobeFileItemProps } from './LobeFileItem';

export interface LobeFileListProps {
  files: Array<Omit<LobeFileItemProps, 'onRemove'> & { id: string }>;
  onRemove?: (id: string) => void;
  padding?: number | string;
}

/**
 * Cloned from lobe-chat-ref/src/components/FileList/EditableFileList.tsx
 */
export const LobeFileList = memo<LobeFileListProps>(({ files, onRemove, padding = '4px 0' }) => {
  if (!files || files.length === 0) return null;

  return (
    <Flexbox
      align="center"
      gap={8}
      horizontal
      padding={padding}
      style={{
        overflowX: 'auto',
        maxWidth: '100%',
        scrollbarWidth: 'thin',
      }}
    >
      {files.map((file) => (
        <LobeFileItem
          fileName={file.fileName}
          fileSize={file.fileSize}
          key={file.id}
          onRemove={onRemove ? () => onRemove(file.id) : undefined}
          status={file.status}
        />
      ))}
    </Flexbox>
  );
});

LobeFileList.displayName = 'LobeFileList';
export default LobeFileList;
