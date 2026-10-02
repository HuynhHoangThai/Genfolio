import React, { useEffect } from 'react';

export const GoogleAnalytics: React.FC = () => {
  useEffect(() => {
    const gaId = (import.meta as any).env?.VITE_GA_ID;
    if (!gaId) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(inlineScript);
  }, []);

  return null;
};

export default GoogleAnalytics;
