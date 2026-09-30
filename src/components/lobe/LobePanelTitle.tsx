import React, { CSSProperties, memo } from 'react';
import { createStyles } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ token, css }) => ({
  desc: css`
    line-height: 1.4;
    color: ${token.colorTextDescription};
    font-size: 13px;
    margin: 0;
  `,
  header: css`
    padding-block: 16px 8px;
    padding-inline: 0.5rem;
  `,
  title: css`
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.25;
    color: ${token.colorText};
    letter-spacing: -0.02em;
  `,
}));

export interface LobePanelTitleProps {
  desc?: string;
  style?: CSSProperties;
  title?: string;
}

/**
 * Cloned from lobe-chat-ref/src/components/PanelTitle/index.tsx
 */
export const LobePanelTitle = memo<LobePanelTitleProps>(({ title, desc, style }) => {
  const { styles } = useStyles();

  return (
    <Flexbox className={styles.header} gap={4} style={style}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {desc && <p className={styles.desc}>{desc}</p>}
    </Flexbox>
  );
});

LobePanelTitle.displayName = 'LobePanelTitle';
export default LobePanelTitle;
