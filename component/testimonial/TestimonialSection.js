"use client";
import React from "react";
import TestimonialSlider from "../slider/TestimonialSlider";

const TestimonialSection = ({ heading = {}, items = [] }) => {
  const subtitle = heading.testimonial_subtitle || "OUR Testimonials";
  const title = heading.testimonial_heading || "We have helped create clients say me.";

  return (
    <section className="tf___testimonial mt_100 pt_95 pb_100">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-xxl-5 col-md-8 col-lg-6 m-auto">
            <div className="tf__heading_area mb_50">
              <h5>{subtitle}</h5>
              <h2>{title}</h2>
            </div>
          </div>
        </div>
        <TestimonialSlider items={items} />
      </div>
    </section>
  );
};

export default TestimonialSection;
