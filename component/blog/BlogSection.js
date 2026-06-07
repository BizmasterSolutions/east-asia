"use client";
import React from "react";
import BlogSlider from "../slider/BlogSlider";

const BlogSection = ({ heading = {}, items = [] }) => {
  const subtitle = heading.blog_subtitle || "LATEST NEWS & BLOG";
  const title = heading.blog_heading || "Our latest Blog And News.";

  return (
    <div className="tf__blog mt_95">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 m-auto wow fadeInUp">
            <div className="tf__heading_area mb_15">
              <h5>{subtitle}</h5>
              <h2>{title}</h2>
            </div>
          </div>
        </div>
        <BlogSlider items={items} />
      </div>
    </div>
  );
};

export default BlogSection;
