import React, { memo } from 'react';
import { Icon, Tooltip } from '@lobehub/ui';
import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { Infinity as InfinityIcon, LucideEye, LucidePaperclip, ToyBrick } from 'lucide-react';
import { rgba } from 'polished';
import { Center, Flexbox } from 'react-layout-kit';
import { LobeModelIcon } from './LobeModelIcon';

const useStyles = createStyles(({ css, token }) => ({
  tag: css`
    cursor: default;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    font-size: 12px;
  `,
  tagBlue: css`
    color: ${token.geekblue || '#2f54eb'};
    background: ${rgba(token.geekblue || '#2f54eb', 0.15)};
  `,
  tagGreen: css`
    color: ${token.green || '#52c41a'};
    background: ${rgba(token.green || '#52c41a', 0.15)};
  `,
  token: css`
    min-width: 36px;
    height: 20px;
    padding: 0 4px;
    font-family: ${token.fontFamilyCode || 'monospace'};
    font-size: 11px;
    color: ${token.colorTextSecondary};
    background: ${token.colorFillTertiary};
    border-radius: 4px;
  `,
}));

const formatTokenNumber = (num: number): string => {
  if (num > 0 && num < 1024) return '1K';
  const kiloToken = Math.floor(num / 1024);
  return kiloToken < 1000 ? `${kiloToken}K` : `${Math.floor(kiloToken / 1000)}M`;
};

export interface ChatModelCard {
  id: string;
  displayName?: string;
  tokens?: number;
  files?: boolean;
  vision?: boolean;
  functionCall?: boolean;
  description?: string;
}

interface ModelInfoTagsProps extends ChatModelCard {
  directionReverse?: boolean;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Cloned from lobe-chat-ref/src/components/ModelSelect/index.tsx -> ModelInfoTags
 */
export const LobeModelInfoTags = memo<ModelInfoTagsProps>(
  ({ directionReverse, files, vision, functionCall, tokens }) => {
    const { styles, cx } = useStyles();

    return (
      <Flexbox direction={directionReverse ? 'horizontal-reverse' : 'horizontal'} gap={4} horizontal>
        {files && (
          <Tooltip title="Hỗ trợ tệp đính kèm (CV, PDF, Docs)">
            <div className={cx(styles.tag, styles.tagGreen)}>
              <Icon icon={LucidePaperclip} size={12} />
            </div>
          </Tooltip>
        )}
        {vision && (
          <Tooltip title="Hỗ trợ thị giác hình ảnh">
            <div className={cx(styles.tag, styles.tagGreen)}>
              <Icon icon={LucideEye} size={12} />
            </div>
          </Tooltip>
        )}
        {functionCall && (
          <Tooltip title="Hỗ trợ gọi hàm (Function Calling)">
            <div className={cx(styles.tag, styles.tagBlue)}>
              <Icon icon={ToyBrick} size={12} />
            </div>
          </Tooltip>
        )}
        {tokens !== undefined && (
          <Tooltip title={`Ngữ cảnh tối đa: ${tokens === 0 ? 'Không giới hạn' : `${tokens.toLocaleString()} tokens`}`}>
            <Center className={styles.token}>
              {tokens === 0 ? (
                <InfinityIcon size={14} strokeWidth={1.8} />
              ) : (
                formatTokenNumber(tokens)
              )}
            </Center>
          </Tooltip>
        )}
      </Flexbox>
    );
  },
);

interface LobeModelItemRenderProps extends ChatModelCard {
  showInfoTag?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

/**
 * Cloned from lobe-chat-ref/src/components/ModelSelect/index.tsx -> ModelItemRender
 */
export const LobeModelItemRender = memo<LobeModelItemRenderProps>(
  ({ showInfoTag = true, selected, onClick, ...model }) => {
    return (
      <Flexbox
        align={'center'}
        distribution={'space-between'}
        gap={16}
        horizontal
        onClick={onClick}
        padding={'8px 12px'}
        style={{
          borderRadius: 8,
          cursor: onClick ? 'pointer' : 'default',
          background: selected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
          border: selected ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
          transition: 'all 0.15s ease',
        }}
      >
        <Flexbox align={'center'} gap={10} horizontal style={{ minWidth: 0 }}>
          <LobeModelIcon model={model.id} size={22} />
          <Flexbox gap={1} style={{ minWidth: 0 }}>
            <Typography.Text
              ellipsis
              style={{
                fontSize: 13,
                fontWeight: selected ? 600 : 500,
                color: '#fff',
                marginBottom: 0,
              }}
            >
              {model.displayName || model.id}
            </Typography.Text>
            {model.description && (
              <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.45)' }}>
                {model.description}
              </span>
            )}
          </Flexbox>
        </Flexbox>

        {showInfoTag && <LobeModelInfoTags {...model} />}
      </Flexbox>
    );
  },
);

LobeModelInfoTags.displayName = 'LobeModelInfoTags';
LobeModelItemRender.displayName = 'LobeModelItemRender';

export default LobeModelItemRender;
