import { Image } from 'antd';
import { memo } from 'react';

import GalleyGrid from '../GalleyGrid';
import ImageItem from '../ImageItem';
import { ImageFileItem } from './type';

interface FileListProps {
  items: ImageFileItem[];
}

export const ImageFileListViewer = memo<FileListProps>(({ items }) => {
  return (
    <Image.PreviewGroup>
      <GalleyGrid items={items} renderItem={ImageItem} />
    </Image.PreviewGroup>
  );
});

export default ImageFileListViewer;
