import { memo } from 'react';
import { HEADER_HEIGHT, MOBILE_NABBAR_HEIGHT, MOBILE_TABBAR_HEIGHT } from '../../const/layoutTokens';

interface SafeSpacingProps {
  height?: number;
  mobile?: boolean;
  position?: 'top' | 'bottom';
}

export const SafeSpacing = memo<SafeSpacingProps>(({ height, position = 'top', mobile }) => {
  let h: number;
  if (mobile) {
    h = position === 'top' ? MOBILE_NABBAR_HEIGHT : MOBILE_TABBAR_HEIGHT;
  } else {
    h = HEADER_HEIGHT;
  }
  return <div style={{ flex: 'none', height: height || h }} />;
});

export default SafeSpacing;
