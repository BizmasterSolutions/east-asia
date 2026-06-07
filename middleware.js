import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("admin_token")?.value;
    if (token && (await verifyToken(token))) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  } else if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_token")?.value;

    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
