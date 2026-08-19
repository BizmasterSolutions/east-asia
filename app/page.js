import AboutSection from "@/component/about/AboutSection";
import ActivitySection from "@/component/activity/ActivitySection";
import BannerSection from "@/component/banner/BannerSection";
import BlogSection from "@/component/blog/BlogSection";
import FacebookFeedSection from "@/component/facebook/FacebookFeedSection";
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

export const dynamic = "force-dynamic";

export const metadata = {
  title: "East Asian",
  description: "Developed by ",
};

const SETTING_KEYS = [
  "hero_subtitle", "hero_subtitle_color", "hero_heading", "hero_heading_color",
  "hero_heading_highlight", "hero_highlight_color",
  "hero_description", "hero_description_color", "hero_cta_text", "hero_cta_link", "hero_bg_image",
  "about_subtitle", "about_heading", "about_description", "about_bullets",
  "about_cta_link", "about_main_img", "about_top_img", "about_top_heading",
  "about_top_description", "about_stat_number", "about_stat_label",
  "courses_subtitle", "courses_heading", "courses_description",
  "testimonial_subtitle", "testimonial_heading",
  "activity_subtitle", "activity_heading", "activity_description", "activity_img", "activity_items",
  "blog_subtitle", "blog_heading",
  "navbar_bg_color", "navbar_text_color", "navbar_link_color",
];

const ABOUT_DEFAULTS = {
  about_subtitle: "OUR About Us",
  about_heading: "East Asia International School, Nugegoda",
  about_description:
    "East Asia International School is a combined primary and secondary school in Nugegoda, Sri Lanka. We support students with structured learning, caring guidance, and a strong school community.",
  about_bullets:
    '["Located at 25 Sunethradevi Rd, Nugegoda.","Combined primary and secondary education.","Student-focused teaching with balanced academic and personal growth.","Easy parent communication through direct school contact.","Official school website: www.eastasian.lk"]',
  about_cta_link: "/about",
  about_main_img: "/question-mark-icon-thinking-solution.avif",
  about_top_img: "images/about_top_img.jpg",
  about_top_heading: "Learning with Purpose",
  about_top_description:
    "At East Asia International School, we help children build knowledge, character, and confidence in a safe and supportive environment.",
  about_stat_number: "Nugegoda",
  about_stat_label: "Sri Lanka Campus",
};

function normalizeAboutSettings(settings) {
  const data = Object.fromEntries(
    [
      "about_subtitle",
      "about_heading",
      "about_description",
      "about_bullets",
      "about_cta_link",
      "about_main_img",
      "about_top_img",
      "about_top_heading",
      "about_top_description",
      "about_stat_number",
      "about_stat_label",
    ].map((k) => [k, settings[k]])
  );

  const oldHeading = "District is Made of about Students Childhood.";
  const oldDescription =
    "Business tailored it design, management & support services business agency elit, sed do eiusmod tempor.";
  const oldBulletHint = "Business school's Institut constructivism.";

  const hasLegacyTemplate =
    data.about_heading === oldHeading ||
    data.about_description === oldDescription ||
    (typeof data.about_bullets === "string" && data.about_bullets.includes(oldBulletHint));

  if (!hasLegacyTemplate) {
    return data;
  }

  return {
    ...ABOUT_DEFAULTS,
    ...data,
    about_subtitle: ABOUT_DEFAULTS.about_subtitle,
    about_heading: ABOUT_DEFAULTS.about_heading,
    about_description: ABOUT_DEFAULTS.about_description,
    about_bullets: ABOUT_DEFAULTS.about_bullets,
    about_top_heading: ABOUT_DEFAULTS.about_top_heading,
    about_top_description: ABOUT_DEFAULTS.about_top_description,
    about_stat_number: ABOUT_DEFAULTS.about_stat_number,
    about_stat_label: ABOUT_DEFAULTS.about_stat_label,
  };
}

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

  const aboutData = normalizeAboutSettings(settings);

  const coursesHeading = { courses_subtitle: settings.courses_subtitle, courses_heading: settings.courses_heading, courses_description: settings.courses_description };
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
      <FacebookFeedSection />
      <AboutSection data={aboutData} />
      <EventSection section="tf__event mt_95" startIndex={0} endIndex={4} />
      <FaqSection img="/question-mark-icon-thinking-solution.avif" />
      <WorkSection heading={coursesHeading} items={courseItems} />
<ActivitySection data={activityData} />
      <VideoSection />
      <BlogSection heading={blogHeading} items={blogItems} />
      <FooterSection />
      <VideoModal />
      <ScrollToTopButton style="" />
    </>
  );
}
