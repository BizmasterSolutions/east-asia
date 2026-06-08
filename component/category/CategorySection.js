import React from "react";

const CategorySection = () => {
  return (
    <section className="tf__categories mt_95">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-md-8 col-lg-6 m-auto wow fadeInUp">
            <div className="tf__heading_area mb_15">
              <h5>OUR COURSE CATEGORIES</h5>
              <h2>Empowering Sri Lankan Students Through Creative Education.</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-4 col-md-6 wow fadeInUp">
            <div className="tf__single_category light_blue">
              <div className="tf__single_category_icon">
                <i className="fa fa-language"></i>
              </div>
              <div className="tf__single_category_text">
                <h3>Sinhala Language</h3>
                <p>Master Sinhala reading, writing and literature from foundational to advanced levels.</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 wow fadeInUp">
            <div className="tf__single_category blue">
              <div className="tf__single_category_icon">
                <i className="fa fa-landmark"></i>
              </div>
              <div className="tf__single_category_text">
                <h3>Sri Lankan Heritage</h3>
                <p>Explore the rich history, culture and ancient civilisation of Sri Lanka.</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 wow fadeInUp">
            <div className="tf__single_category green">
              <div className="tf__single_category_icon">
                <i className="fa fa-flask"></i>
              </div>
              <div className="tf__single_category_text">
                <h3>Science & Technology</h3>
                <p>Hands-on science programs aligned with the Sri Lankan national curriculum.</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 wow fadeInUp">
            <div className="tf__single_category gray">
              <div className="tf__single_category_icon">
                <i className="fa fa-om"></i>
              </div>
              <div className="tf__single_category_text">
                <h3>Buddhist Studies</h3>
                <p>Deepen understanding of Buddhist philosophy, ethics and Sri Lankan traditions.</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 wow fadeInUp">
            <div className="tf__single_category orange">
              <div className="tf__single_category_icon">
                <i className="fa fa-palette"></i>
              </div>
              <div className="tf__single_category_text">
                <h3>Arts & Crafts</h3>
                <p>Traditional Sri Lankan art forms, drumming, dancing and creative expression.</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 wow fadeInUp">
            <div className="tf__single_category red">
              <div className="tf__single_category_icon">
                <i className="fa fa-leaf"></i>
              </div>
              <div className="tf__single_category_text">
                <h3>Environment & Agriculture</h3>
                <p>Learn sustainable farming, ecology and environmental conservation rooted in Sri Lanka.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
