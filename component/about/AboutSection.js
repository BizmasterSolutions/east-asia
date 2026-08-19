import Link from "next/link";
import React from "react";

const AboutSection = ({ data = {} }) => {
  const {
    about_subtitle = "OUR About Us",
    about_heading = "East Asia International School, Nugegoda",
    about_description = "East Asia International School is a combined primary and secondary school in Nugegoda, Sri Lanka. We support students with structured learning, caring guidance, and a strong school community.",
    about_bullets = '["Located at 25 Sunethradevi Rd, Nugegoda.","Combined primary and secondary education.","Student-focused teaching with balanced academic and personal growth.","Easy parent communication through direct school contact.","Official school website: www.eastasian.lk"]',
    about_cta_link = "/about",
    about_main_img = "/question-mark-icon-thinking-solution.avif",
    about_top_img = "images/about_top_img.jpg",
    about_top_heading = "Learning with Purpose",
    about_top_description = "At East Asia International School, we help children build knowledge, character, and confidence in a safe and supportive environment.",
    about_stat_number = "Nugegoda",
    about_stat_label = "Sri Lanka Campus",
  } = data;

  let bullets = [];
  try { bullets = JSON.parse(about_bullets); } catch { bullets = []; }

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
                  <h4>{about_top_heading}</h4>
                  <p>{about_top_description}</p>
                </div>
                <a href={about_cta_link} className="common_btn">read more</a>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-6 col-md-9 col-lg-6 wow fadeInLeft">
            <div className="tf__about_text">
              <div className="tf__heading_area tf__heading_area_left mb_25">
                <h5>{about_subtitle}</h5>
                <h2>{about_heading}</h2>
              </div>
              <p>{about_description}</p>
              {bullets.length > 0 && (
                <ul>
                  {bullets.map((b, i) => b && <li key={i}>{b}</li>)}
                </ul>
              )}
              <Link href={about_cta_link} className="common_btn">about more</Link>
            </div>
          </div>
          <div className="col-xl-6 col-sm-9 col-md-8 col-lg-6 wow fadeInRight">
            <div className="tf__about_img">
              <img src={about_main_img} alt="about" className="img-fluid w-100" />
              <div className="text">
                <i className="far fa-check-circle"></i>
                <h3>{about_stat_number}</h3>
                <p>{about_stat_label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
