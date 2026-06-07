import Layout from "@/component/layout/Layout";
import GallerySection from "@/component/gallery/GallerySection";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Gallery – East Asian International School",
  description: "Photos and videos from East Asian International School events and activities.",
};

export default async function GalleryPage() {
  const [photos, videos] = await Promise.all([
    prisma.galleryPhoto.findMany({ orderBy: { uploadedAt: "desc" } }),
    prisma.galleryVideo.findMany({ orderBy: { id: "desc" } }),
  ]);

  return (
    <Layout>
      <GallerySection photos={photos} videos={videos} />
    </Layout>
  );
}
