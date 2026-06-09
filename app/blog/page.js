import AllBlogSection from "@/component/blog/AllBlogSection";
import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
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
      <BreadcrumbSection header="Blog" title="Blog" />
      <AllBlogSection posts={posts} />
    </Layout>
  );
}
