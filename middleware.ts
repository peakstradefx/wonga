import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import * as jose from "jose";

export default withAuth(
  async function middleware(req) {
    const session = (await getToken({ req })) as {
      accessToken: any;
      token: string;
    } | null;

    const isAuth = !!session?.accessToken;

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Decode the token coming from backend, not NextAuth session
    const backendToken = session?.accessToken;
    if (!backendToken) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    const decoded = jose.decodeJwt(backendToken);

    // If the token is expired
    const exp = (decoded as { exp?: number })?.exp;
    if (!exp || exp * 1000 < Date.now()) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        // Always return true to ensure the middleware function runs
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication routes)
     * - assets (static assets)
     * - "/" (home page)
     * - public pages (e.g., /about, /contact)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth|assets|about|contact|trade|education|$).*)",
  ],
};
