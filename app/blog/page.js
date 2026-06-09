import AllBlogSection from "@/component/blog/AllBlogSection";
import Layout from "@/component/layout/Layout";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'East Asian Blog Page',
  description: 'Developed by Bizmaster Solutions',
}

export default async function Blog() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <Layout>
      <AllBlogSection posts={posts} />
    </Layout>
  );
}
