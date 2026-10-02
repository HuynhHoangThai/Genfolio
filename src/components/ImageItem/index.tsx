import { ActionIcon, Image } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Trash } from 'lucide-react';
import { CSSProperties, memo } from 'react';

import { usePlatform } from '../../hooks/usePlatform';
import { MIN_IMAGE_SIZE } from './style';

const useStyles = createStyles(({ css, token }) => ({
  deleteButton: css`
    color: #fff;
    background: ${token.colorBgMask};

    &:hover {
      background: ${token.colorError};
    }
  `,
  editableImage: css`
    background: ${token.colorBgContainer};
    box-shadow: 0 0 0 1px ${token.colorFill} inset;
    border-radius: ${token.borderRadius}px;
    overflow: hidden;
  `,
  wrapper: css`
    position: relative;
    display: inline-block;
  `,
}));

interface FileItemProps {
  alt?: string;
  alwaysShowClose?: boolean;
  className?: string;
  editable?: boolean;
  loading?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  style?: CSSProperties;
  url?: string;
}

export const ImageItem = memo<FileItemProps>(
  ({ editable, alt, onRemove, url, loading, alwaysShowClose, className, style }) => {
    const IMAGE_SIZE = editable ? MIN_IMAGE_SIZE : '100%';
    const { styles, cx } = useStyles();
    const { isSafari } = usePlatform();

    return (
      <div className={cx(styles.wrapper, editable && styles.editableImage, className)} style={style}>
        <Image
          actions={
            editable && (
              <ActionIcon
                className={styles.deleteButton}
                glass
                icon={Trash}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.();
                }}
                size={'small'}
              />
            )
          }
          alt={alt || ''}
          alwaysShowActions={alwaysShowClose}
          height={isSafari ? 'auto' : '100%'}
          isLoading={loading}
          size={IMAGE_SIZE as any}
          src={url}
          style={{ height: isSafari ? 'auto' : '100%' }}
        />
      </div>
    );
  },
);

export default ImageItem;
