import { Icon } from '@lobehub/ui';
import { css, cx } from 'antd-style';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { useTranslation } from '../../utils/i18n';

const container = css`
  padding: 8px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  font-family: monospace;
  font-size: 11px;
  color: #ff7875;
  overflow: auto;
  max-height: 120px;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
`;

export const Description = memo<{ message: string; status: number }>(({ message, status }) => {
  const { t } = useTranslation('error');
  const [show, setShow] = useState(false);

  return (
    <Flexbox gap={8}>
      <span>{`Mã lỗi: ${status}`}</span>
      <Flexbox
        gap={4}
        horizontal
        onClick={() => setShow(!show)}
        style={{ cursor: 'pointer', fontSize: 12, opacity: 0.8 }}
      >
        <span>{t('fetchErrorDetail')}</span>
        <Icon icon={show ? ChevronUp : ChevronDown} />
      </Flexbox>
      {show && <pre className={cx(container)}>{message}</pre>}
    </Flexbox>
  );
});

export default Description;
