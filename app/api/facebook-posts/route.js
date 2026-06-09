import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID || "eastasianinternationalcollege";

  if (!token) {
    return NextResponse.json({ posts: [] });
  }

  try {
    const fields = "message,full_picture,created_time,permalink_url";
    const url = `https://graph.facebook.com/v19.0/${pageId}/posts?fields=${fields}&limit=6&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.error) {
      console.error("Facebook API error:", data.error.message);
      return NextResponse.json({ posts: [] });
    }

    return NextResponse.json({ posts: data.data || [] });
  } catch (err) {
    console.error("Failed to fetch Facebook posts:", err);
    return NextResponse.json({ posts: [] });
  }
}
