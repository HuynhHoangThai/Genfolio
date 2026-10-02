'use client';

import { FluentEmoji } from '@lobehub/ui';
import { Button } from 'antd';
// Vite-compatible link
const Link = ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>;
import { memo } from 'react';
import { useTranslation } from '../../utils/i18n';
import { Flexbox } from 'react-layout-kit';

import { MAX_WIDTH } from '../../const/layoutTokens';

const NotFound = memo(() => {
  const { t } = useTranslation('error');
  return (
    <Flexbox align={'center'} justify={'center'} style={{ minHeight: '100%', width: '100%' }}>
      <h1
        style={{
          filter: 'blur(8px)',
          fontSize: `min(${MAX_WIDTH / 3}px, 50vw)`,
          fontWeight: 'bolder',
          margin: 0,
          opacity: 0.12,
          position: 'absolute',
          zIndex: 0,
        }}
      >
        404
      </h1>
      <FluentEmoji emoji={'👀'} size={64} />
      <h2 style={{ fontWeight: 'bold', marginTop: '1em', textAlign: 'center' }}>
        {t('notFound.title')}
      </h2>
      <p style={{ marginBottom: '2em' }}>{t('notFound.desc')}</p>
      <Link href="/">
        <Button type={'primary'}>{t('notFound.backHome')}</Button>
      </Link>
    </Flexbox>
  );
});

NotFound.displayName = 'NotFound';

export default NotFound;
