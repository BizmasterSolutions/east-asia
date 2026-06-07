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

const SETTING_KEYS = [
  "hero_subtitle", "hero_subtitle_color", "hero_heading", "hero_heading_color",
  "hero_heading_highlight", "hero_highlight_color",
  "hero_description", "hero_description_color", "hero_cta_text", "hero_cta_link", "hero_bg_image",
  "about_subtitle", "about_heading", "about_description", "about_bullets",
  "about_cta_link", "about_main_img", "about_top_img", "about_top_heading",
  "about_top_description", "about_stat_number", "about_stat_label",
  "courses_subtitle", "courses_heading",
  "testimonial_subtitle", "testimonial_heading",
  "activity_subtitle", "activity_heading", "activity_description", "activity_img", "activity_items",
  "blog_subtitle", "blog_heading",
  "navbar_bg_color", "navbar_text_color", "navbar_link_color",
];

export default async function Home() {
  const [settingRows, courseItems, testimonialItems, blogItems] = await Promise.all([
    prisma.schoolSetting.findMany({ where: { key: { in: SETTING_KEYS } } }),
    prisma.courseWork.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { id: "desc" } }),
    prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" }, take: 4 }),
  ]);

  const settings = {};
  for (const row of settingRows) settings[row.key] = row.value;

  const hero = Object.fromEntries(
    ["hero_subtitle", "hero_subtitle_color", "hero_heading", "hero_heading_color",
      "hero_heading_highlight", "hero_highlight_color",
      "hero_description", "hero_description_color", "hero_cta_text", "hero_cta_link", "hero_bg_image"]
      .map((k) => [k, settings[k]])
  );

  const aboutData = Object.fromEntries(
    ["about_subtitle", "about_heading", "about_description", "about_bullets", "about_cta_link",
      "about_main_img", "about_top_img", "about_top_heading", "about_top_description",
      "about_stat_number", "about_stat_label"]
      .map((k) => [k, settings[k]])
  );

  const coursesHeading = { courses_subtitle: settings.courses_subtitle, courses_heading: settings.courses_heading };
  const testimonialsHeading = { testimonial_subtitle: settings.testimonial_subtitle, testimonial_heading: settings.testimonial_heading };
  const blogHeading = { blog_subtitle: settings.blog_subtitle, blog_heading: settings.blog_heading };

  const activityData = Object.fromEntries(
    ["activity_subtitle", "activity_heading", "activity_description", "activity_img", "activity_items"]
      .map((k) => [k, settings[k]])
  );

  const navbarColors = {
    bgColor: settings.navbar_bg_color || "#ffffff",
    textColor: settings.navbar_text_color || "#222222",
    linkColor: settings.navbar_link_color || "#222222",
  };

  return (
    <>
      <NavbarSection style="" logo="/Logo mod.png" colors={navbarColors} />
      <BannerSection hero={hero} />
      <CategorySection />
      <AboutSection data={aboutData} />
      <EventSection section="tf__event mt_95" startIndex={0} endIndex={4} />
      <FaqSection img="images/faq_img.jpg" />
      <WorkSection heading={coursesHeading} items={courseItems} />
      <TestimonialSection heading={testimonialsHeading} items={testimonialItems} />
      <ActivitySection data={activityData} />
      <VideoSection />
      <BlogSection heading={blogHeading} items={blogItems} />
      <FooterSection />
      <VideoModal />
      <ScrollToTopButton style="" />
    </>
  );
}
