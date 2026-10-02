import { FC, PropsWithChildren } from 'react';

const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

interface ServerLayoutProps<T> {
  Desktop: FC<T>;
  Mobile: FC<T>;
}

export const ServerLayout =
  <T extends PropsWithChildren>({ Desktop, Mobile }: ServerLayoutProps<T>): FC<T> =>
  (props: T) => {
    const mobile = isMobileDevice();
    return mobile ? <Mobile {...props} /> : <Desktop {...props} />;
  };

ServerLayout.displayName = 'ServerLayout';

export default ServerLayout;
