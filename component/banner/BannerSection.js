"use client";
import { useEduorContext } from "@/context/EduorContext";
import Link from "next/link";
import React from "react";

const DEFAULTS = {
  hero_subtitle: "Welcome to East Asian!",
  hero_heading: "Students for a Brighter Future.",
  hero_heading_highlight: "Brighter",
  hero_description:
    "East Asian International School provides a nurturing environment where students grow academically and personally.",
  hero_cta_text: "Read More",
  hero_cta_link: "/about",
};

const BannerSection = ({ hero = {} }) => {
  const { handleVideoShow } = useEduorContext();

  const subtitle = hero.hero_subtitle || DEFAULTS.hero_subtitle;
  const subtitleColor = hero.hero_subtitle_color || "#ffffff";
  const heading = hero.hero_heading || DEFAULTS.hero_heading;
  const headingColor = hero.hero_heading_color || "#ffffff";
  const highlight = hero.hero_heading_highlight || DEFAULTS.hero_heading_highlight;
  const highlightColor = hero.hero_highlight_color || "#f59e0b";
  const description = hero.hero_description || DEFAULTS.hero_description;
  const descriptionColor = hero.hero_description_color || "#ffffff";
  const ctaText = hero.hero_cta_text || DEFAULTS.hero_cta_text;
  const ctaLink = hero.hero_cta_link || DEFAULTS.hero_cta_link;

  const headingParts = heading.includes(highlight)
    ? heading.split(highlight)
    : [heading, ""];

  const bgStyle = hero.hero_bg_image
    ? { backgroundImage: `url(${hero.hero_bg_image})` }
    : {};

  return (
    <section className="tf__banner" style={bgStyle}>
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-lg-8">
            <div className="tf__banner_text wow fadeInUp">
              <h5 style={{ color: subtitleColor }}>{subtitle}</h5>
              <h1 style={{ color: headingColor }}>
                {headingParts[0]}
                {heading.includes(highlight) && (
                  <span style={{ color: highlightColor }}>{highlight}</span>
                )}
                {headingParts[1]}
              </h1>
              <p style={{ color: descriptionColor }}>{description}</p>
              <ul className="d-flex flex-wrap align-items-center">
                <li>
                  <Link className="common_btn" href={ctaLink}>
                    {ctaText}
                  </Link>
                </li>
                <li>
                  <a
                    className="venobox play_btn"
                    role="button"
                    onClick={handleVideoShow}
                  >
                    <i className="fas fa-play"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
