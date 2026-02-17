import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/kiosk",
  "/queue/display",
  "/landing",
  "/logo-preview",
];

// Routes that require specific roles
const roleRoutes: Record<string, string[]> = {
  "/users": ["super_admin", "admin_klinik"],
  "/master": ["super_admin", "admin_klinik"],
  "/reports": ["super_admin", "admin_klinik"],
  "/pharmacy/stock": ["super_admin", "admin_klinik"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth cookie/token (in real app, validate JWT here)
  // For now, we'll let client-side handle auth since we're using localStorage
  // In production with Laravel, you'd validate the session/token here

  // Allow static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Redirect root to dashboard or login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
