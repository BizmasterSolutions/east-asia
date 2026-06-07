import BlogDetailSection from "@/component/blog/BlogDetailSection";
import ErrorSection from "@/component/error/ErrorSection";
import Layout from "@/component/layout/Layout";
import prisma from "@/lib/prisma";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Blog Not Found" };
  return { title: post.title, description: post.description };
}

export default async function BlogDetails({ params }) {
  const { slug } = await params;

  const [post, recentPosts] = await Promise.all([
    prisma.blogPost.findUnique({ where: { slug } }),
    prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
  ]);

  return (
    <Layout>
      {post ? (
        <BlogDetailSection post={post} recentPosts={recentPosts} />
      ) : (
        <ErrorSection type="Blog" />
      )}
    </Layout>
  );
}
