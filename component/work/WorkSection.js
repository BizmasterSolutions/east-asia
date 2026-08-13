"use client";
import React from "react";
import WorkSlider from "../slider/WorkSlider";

const WorkSection = ({ heading = {}, items = [] }) => {
  const subtitle = heading.courses_subtitle    || "OUR ADVANCE PROGRAMS";
  const title    = heading.courses_heading     || "Upcoming Events";
  const desc     = heading.courses_description ||
    "Our advance courses are built to take students beyond the basics — combining expert instruction, culturally rich content, and practical skills that prepare learners for academic excellence and global opportunities.";

  return (
    <section className="tf__work pt_95">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-md-10 col-lg-8 m-auto wow fadeInUp">
            <div className="tf__heading_area mb_25 md_margin">
              <h5>{subtitle}</h5>
              <h2>{title}</h2>
            </div>
            <p className="text-center mb_35" style={{ color: "#666", fontSize: "15px", lineHeight: "1.8" }}>
              {desc}
            </p>
          </div>
        </div>
        <WorkSlider items={items} />
      </div>
    </section>
  );
};

export default WorkSection;
