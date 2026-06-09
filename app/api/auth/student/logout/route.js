import { NextResponse } from "next/server";

export async function POST(request) {
  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/student-portal/login`);

  response.cookies.set("student_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
