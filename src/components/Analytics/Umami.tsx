import { memo, useEffect } from 'react';

interface UmamiAnalyticsProps {
  scriptUrl: string;
  websiteId?: string;
}

export const UmamiAnalytics = memo<UmamiAnalyticsProps>(
  ({ scriptUrl, websiteId }) => {
    useEffect(() => {
      if (!websiteId || typeof document === 'undefined') return;
      const script = document.createElement('script');
      script.defer = true;
      script.setAttribute('data-website-id', websiteId);
      script.src = scriptUrl;
      document.head.appendChild(script);
    }, [scriptUrl, websiteId]);

    return null;
  }
);

export default UmamiAnalytics;
