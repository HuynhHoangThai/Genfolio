import { Sparkles } from 'lucide-react';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

const useStyles = createStyles(({ token, css }) => ({
  logoLink: css`
    display: inline-flex;
    align-items: center;
    color: inherit;
    text-decoration: none;
    transition: color 0.15s ease;

    &:hover {
      color: ${token.colorLink};
    }
  `,
}));

export const BrandWatermark = memo<Omit<FlexboxProps, 'children'>>(({ style, ...rest }) => {
  const { styles, theme } = useStyles();
  return (
    <Flexbox
      align={'center'}
      flex={'none'}
      gap={6}
      horizontal
      style={{ color: theme.colorTextDescription, fontSize: 12, ...style }}
      {...rest}
    >
      <span>Powered by</span>
      <span className={styles.logoLink}>
        <span style={{ fontWeight: 700, fontSize: 12, color: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sparkles size={12} style={{ color: 'var(--primary-color, #FAFAFA)' }} /> Genfolio
        </span>
      </span>
    </Flexbox>
  );
});

export default BrandWatermark;
