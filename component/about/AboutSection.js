import Link from "next/link";
import React from "react";

const AboutSection = ({ data = {} }) => {
  const {
    about_subtitle = "OUR About Us",
    about_heading = "District is Made of about Students Childhood.",
    about_description = "Business tailored it design, management & support services business agency elit, sed do eiusmod tempor.",
    about_bullets = '["Business school\'s Institut constructivism.","We give management school best.","Media in this school solution.","Business school\'s Institut constructivism.","We give management school best."]',
    about_cta_link = "/about",
    about_main_img = "images/about_img.png",
    about_top_img = "images/about_top_img.jpg",
    about_top_heading = "Study Off Flexibly",
    about_top_description = "We can provide you with a reliable handyan in Please input an email address down below school.",
    about_stat_number = "183k+",
    about_stat_label = "Complete Projects",
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
                <a href="#" className="common_btn">read more</a>
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
