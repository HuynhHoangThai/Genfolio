import { memo, useEffect } from 'react';

interface PlausibleAnalyticsProps {
  domain?: string;
  scriptBaseUrl: string;
}

export const PlausibleAnalytics = memo<PlausibleAnalyticsProps>(
  ({ domain, scriptBaseUrl }) => {
    useEffect(() => {
      if (!domain || typeof document === 'undefined') return;
      const script = document.createElement('script');
      script.defer = true;
      script.setAttribute('data-domain', domain);
      script.src = `${scriptBaseUrl}/js/script.js`;
      document.head.appendChild(script);
    }, [domain, scriptBaseUrl]);

    return null;
  }
);

export default PlausibleAnalytics;
