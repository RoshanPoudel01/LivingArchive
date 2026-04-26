import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth/signin", "/"];

const AUTH_COOKIES =
  process.env.NODE_ENV === "production"
    ? ["__Secure-next-auth.session-token", "__Secure-authjs.session-token"]
    : ["next-auth.session-token", "authjs.session-token"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = AUTH_COOKIES.map(
    (name) => request.cookies.get(name)?.value,
  ).find(Boolean);
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
