import React from "react";

const AboutSection3 = ({ style }) => {
  return (
    <div className={`${style} tf__about_2_area`}>
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 wow fadeInLeft">
            <div className="tf__about_2_img">
              <div className="tf__about_small">
                <img
                  src="images/about_2_img_2.jpg"
                  alt="about us"
                  className="img-fluid w-100"
                />
              </div>
              <div className="tf__about_large">
                <img
                  src="images/about_2_img_1.jpg"
                  alt="about us"
                  className="img-fluid w-100"
                />
              </div>
              <p>
                <span>Nugegoda</span> Sri Lanka Campus
              </p>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 wow fadeInRight">
            <div className="tf__about_2_text">
              <div className="tf__heading_area tf__heading_area_left mb_25">
                <h5>OUR About Us</h5>
                <h2>East Asia International School</h2>
              </div>
              <p>
                East Asia International School is a combined primary and
                secondary school in Nugegoda, Sri Lanka, committed to helping
                students grow academically and personally.
              </p>
              <ul>
                <li>
                  <div className="icon">
                    <img
                      src="images/about_2_icon_1.jpg"
                      alt="about"
                      className="img-fluid w-100"
                    />
                  </div>
                  <div className="text">
                    <h4>Primary to Secondary Pathway</h4>
                    <p>
                      Structured learning from early years through upper grades
                      in one school community.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <img
                      src="images/about_2_icon_2.jpg"
                      alt="about"
                      className="img-fluid w-100"
                    />
                  </div>
                  <div className="text">
                    <h4>Academic Development</h4>
                    <p>
                      Lessons and activities that build subject mastery,
                      confidence, and discipline.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <img
                      src="images/about_2_icon_3.jpg"
                      alt="about"
                      className="img-fluid w-100"
                    />
                  </div>
                  <div className="text">
                    <h4>Supportive School Culture</h4>
                    <p>
                      A caring environment where students are guided to do their
                      best every day.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <img
                      src="images/about_2_icon_4.jpg"
                      alt="about"
                      className="img-fluid w-100"
                    />
                  </div>
                  <div className="text">
                    <h4>Easy Parent Access</h4>
                    <p>
                      Families can reach the school at 25 Sunethradevi Rd,
                      Nugegoda, or via www.eastasian.lk.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 mt_110 xs_mt_100 wow fadeInUp">
            <div className="tf__about_us_counter d-flex flex-wrap align-items-center">
              <p>
                <span>Contact:</span> +94 77 898 2620 | eastasian.lk
              </p>
              <a href="http://www.eastasian.lk/" target="_blank" rel="noreferrer">Visit Website</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection3;
