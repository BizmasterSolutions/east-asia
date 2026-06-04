import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(
    new URL("/student-portal/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
  );

  response.cookies.set("student_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
