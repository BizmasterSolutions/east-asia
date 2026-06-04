import AboutSection from "@/component/about/AboutSection";
import ActivitySection from "@/component/activity/ActivitySection";
import BannerSection from "@/component/banner/BannerSection";
import BlogSection from "@/component/blog/BlogSection";
import CategorySection from "@/component/category/CategorySection";
import EventSection from "@/component/event/EventSection";
import FaqSection from "@/component/faq/FaqSection";
import FooterSection from "@/component/footer/FooterSection";
import VideoModal from "@/component/modal/VideoModal";
import NavbarSection from "@/component/navbar/NavbarSection";
import TestimonialSection from "@/component/testimonial/TestimonialSection";
import ScrollToTopButton from "@/component/utils/ScrollToTopButton";
import VideoSection from "@/component/video/VideoSection";
import WorkSection from "@/component/work/WorkSection";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "East Asian Home Page 1",
  description: "Developed by Azizur Rahman",
};

const HERO_KEYS = [
  "hero_subtitle",
  "hero_heading",
  "hero_heading_highlight",
  "hero_description",
  "hero_cta_text",
  "hero_cta_link",
  "hero_bg_image",
];

export default async function Home() {
  const heroRows = await prisma.schoolSetting.findMany({
    where: { key: { in: HERO_KEYS } },
  });
  const hero = {};
  for (const row of heroRows) hero[row.key] = row.value;

  return (
    <>
      <NavbarSection style="" logo="/Logo mod.png" />
      <BannerSection hero={hero} />
      <CategorySection />
      <AboutSection />
      <EventSection section="tf__event mt_95" startIndex={0} endIndex={4} />
      <FaqSection img="images/faq_img.jpg" />
      <WorkSection />
      <TestimonialSection />
      <ActivitySection />
      <VideoSection />
      <BlogSection />
      <FooterSection />
      <VideoModal />
      <ScrollToTopButton style="" />
    </>
  );
}
