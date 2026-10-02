import { memo, useEffect } from 'react';

interface PostHogProps {
  debug: boolean;
  host: string;
  token?: string;
}

export const PostHog = memo<PostHogProps>(({ token, host }) => {
  useEffect(() => {
    if (!token || typeof document === 'undefined') return;
    const script = document.createElement('script');
    script.src = `${host}/static/array.js`;
    script.async = true;
    document.head.appendChild(script);
  }, [token, host]);

  return null;
});

export default PostHog;
