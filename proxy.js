import { NextResponse } from 'next/server';

/**
 * Next.js 16 Proxy (formerly Middleware)
 * Enforces authentication on template creation and protected application routes.
 */
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const authCookie = request.cookies.get('genfolio_auth');
  const isAuthenticated = !!authCookie?.value;

  // Protected APIs
  const isProtectedApi =
    pathname.startsWith('/api/parse-resume') ||
    (pathname.startsWith('/api/portfolios') && !(pathname === '/api/portfolios/share' && request.method === 'GET')) ||
    pathname.startsWith('/api/github');

  // Protected user-facing pages (creating / editing template, deploying)
  const isProtectedPage =
    pathname.startsWith('/editor') ||
    pathname.startsWith('/deployed');

  if (!isAuthenticated) {
    if (isProtectedApi) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Yêu cầu đăng nhập. Vui lòng đăng nhập bằng Google để tiếp tục.',
        },
        { status: 401 }
      );
    }

    if (isProtectedPage) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('auth', 'required');
      loginUrl.searchParams.set('next', `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/editor/:path*',
    '/deployed/:path*',
    '/api/parse-resume',
    '/api/portfolios/:path*',
    '/api/github/:path*',
  ],
};
