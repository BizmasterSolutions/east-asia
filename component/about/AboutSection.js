import Link from "next/link";
import React from "react";

const AboutSection = () => {
  const bullets = [
    "International curriculum aligned with global standards.",
    "Experienced and dedicated teaching professionals.",
    "State-of-the-art classrooms and learning facilities.",
    "Strong emphasis on character, values, and leadership.",
    "Vibrant extracurricular and cultural programmes.",
  ];

  return (
    <section className="tf__about mt_250 xs_mt_195">
      <div className="container">
        <div className="tf__about_top wow fadeInUp">
          <div className="row">
            <div className="col-xl-5 col-lg-5">
              <div className="tf__about_top_img" style={{ marginLeft: "90px" }}>
                <img src="/4.png" alt="about" className="img-fluid w-100" style={{ transform: "scale(1.15)", transformOrigin: "center center" }} />
              </div>
            </div>
            <div className="col-xl-7 col-lg-7">
              <div className="tf__about_top_text">
                <div className="tf__about_top_text_center">
                  <h4>A Culture of Learning</h4>
                  <p>Our experienced educators create a supportive environment where every student is empowered to reach their full potential and become a confident global citizen.</p>
                </div>
                <a href="/about" className="common_btn">read more</a>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-6 col-md-9 col-lg-6 wow fadeInLeft">
            <div className="tf__about_text">
              <div className="tf__heading_area tf__heading_area_left mb_25">
                <h5>ABOUT OUR SCHOOL</h5>
                <h2>Nurturing Excellence at East Asian International School</h2>
              </div>
              <p>East Asian International School is dedicated to providing a world-class education that nurtures academic excellence, character development, and cultural awareness in every student.</p>
              <ul>
                {bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              <Link href="/about" className="common_btn">about more</Link>
            </div>
          </div>
          <div className="col-xl-6 col-sm-9 col-md-8 col-lg-6 wow fadeInRight">
            <div className="tf__about_img">
              <img src="images/about_img.png" alt="about" className="img-fluid w-100" />
              <div className="text">
                <i className="far fa-check-circle"></i>
                <h3>1,200+</h3>
                <p>Enrolled Students</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
