import { FC, PropsWithChildren, memo } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface ClientResponsiveLayoutProps {
  Desktop: FC<PropsWithChildren>;
  Mobile: FC<PropsWithChildren>;
}

export const ClientResponsiveLayout = ({ Desktop, Mobile }: ClientResponsiveLayoutProps) => {
  const Layout = memo<PropsWithChildren>(({ children }) => {
    const mobile = useIsMobile();
    return mobile ? <Mobile>{children}</Mobile> : <Desktop>{children}</Desktop>;
  });

  Layout.displayName = 'ClientLayout';
  return Layout;
};

export default ClientResponsiveLayout;
