import { workData } from "@/data/Data";
import React from "react";
import Slider from "react-slick";

const FALLBACK_IMGS = [
  "images/courses_img_5.jpg",
  "images/courses_img_7.jpg",
  "images/courses_img_9.jpg",
  "images/courses_img_11.jpg",
];

const WorkSlider = ({ items }) => {
  const data = items && items.length > 0 ? items : workData;
  const count = data.length;
  const slidesToShow = Math.min(3, count);
  const infinite = count > slidesToShow;

  return (
    <Slider
      className="row work_slider"
      slidesToShow={slidesToShow}
      infinite={infinite}
      dots={true}
      autoplay={infinite}
      arrows={false}
      slidesToScroll={1}
      responsive={[
        { breakpoint: 1400, settings: { slidesToShow: Math.min(3, count) } },
        { breakpoint: 1200, settings: { slidesToShow: Math.min(3, count) } },
        { breakpoint: 992, settings: { slidesToShow: Math.min(2, count) } },
        { breakpoint: 768, settings: { slidesToShow: 1 } },
        { breakpoint: 576, settings: { slidesToShow: 1 } },
      ]}
    >
      {data.map((item, idx) => {
        const imgSrc = item.imagePath || item.imgSrc || FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
        return (
          <div className="col-xl-4 wow fadeInUp" key={item.id}>
            <div className={`tf__work_single ${item.color}`}>
              <div className="tf__work_single_img">
                <img src={imgSrc} alt={item.title || item.task || "course"} className="img-fluid w-100" />
              </div>
              <div className="tf__work_single_text">
                <h3>{item.title || item.task}</h3>
                <p>{item.desc}</p>
                <a href="#">
                  <i className="fas fa-long-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </Slider>
  );
};

export default WorkSlider;
