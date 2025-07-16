import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function logDev(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log("[Middleware]", ...args);
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API, _next and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.[^\/]+$/)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return intlMiddleware(new NextRequest(new URL("/", request.url)));
  }

  logDev("Path:", pathname);

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
