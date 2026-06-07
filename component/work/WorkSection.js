"use client";
import React from "react";
import WorkSlider from "../slider/WorkSlider";

const WorkSection = ({ heading = {}, items = [] }) => {
  const subtitle = heading.courses_subtitle || "OUR Working now";
  const title = heading.courses_heading || "Complete About Students Advance Course.";

  return (
    <section className="tf__work pt_95">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-md-8 col-lg-6 m-auto wow fadeInUp">
            <div className="tf__heading_area mb_35 md_margin">
              <h5>{subtitle}</h5>
              <h2>{title}</h2>
            </div>
          </div>
        </div>
        <WorkSlider items={items} />
      </div>
    </section>
  );
};

export default WorkSection;
