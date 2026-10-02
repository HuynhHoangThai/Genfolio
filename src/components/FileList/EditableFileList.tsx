import { Image } from 'antd';
import { useResponsive } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ImageItem from '../ImageItem';
import { ImageFileItem } from './type';

interface EditableFileListProps {
  alwaysShowClose?: boolean;
  editable?: boolean;
  items: ImageFileItem[];
  onRemove?: (id: string) => void;
  padding?: number | string;
}

export const EditableFileList = memo<EditableFileListProps>(
  ({ items, editable = true, alwaysShowClose, onRemove, padding = 12 }) => {
    const { mobile } = useResponsive();

    return (
      <Flexbox
        gap={mobile ? 4 : 6}
        horizontal
        padding={padding}
        style={{ overflow: 'scroll', width: '100%' }}
      >
        <Image.PreviewGroup>
          {items.map((i) => (
            <ImageItem
              alt={i.alt}
              alwaysShowClose={alwaysShowClose}
              editable={editable}
              key={i.id}
              loading={i.loading}
              onRemove={() => onRemove?.(i.id)}
              url={i.url}
            />
          ))}
        </Image.PreviewGroup>
      </Flexbox>
    );
  },
);

export default EditableFileList;
