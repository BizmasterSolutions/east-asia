import { blogData } from "@/data/Data";
import Link from "next/link";
import React from "react";
import Slider from "react-slick";

const BlogSlider = ({ items }) => {
  const data = items && items.length > 0 ? items.slice(0, 4) : blogData.slice(0, 4);
  const count = data.length;
  const show = Math.min(3, count);
  const infinite = count > show;

  return (
    <Slider
      className="row blog_slider"
      slidesToShow={show}
      infinite={infinite}
      dots={true}
      arrows={false}
      autoplay={infinite}
      slidesToScroll={1}
      responsive={[
        { breakpoint: 1400, settings: { slidesToShow: Math.min(3, count), infinite } },
        { breakpoint: 1200, settings: { slidesToShow: Math.min(2, count), infinite } },
        { breakpoint: 992,  settings: { slidesToShow: Math.min(2, count), infinite } },
        { breakpoint: 768,  settings: { slidesToShow: 1, infinite } },
        { breakpoint: 576,  settings: { slidesToShow: 1, infinite } },
      ]}
    >
      {data.map((item) => (
        <div className="col-xl-4 wow fadeInUp" key={item.id}>
          <div className="tf__single_blog">
            <Link className="tf__single_blog_img" href={`/blog/${item.slug}`}>
              <img src={item.imagePath || item.imgSrc} alt="blog" className="img-fluid w-100" />
            </Link>
            <div className="tf__single_blog_text">
              <Link className={`category ${item.categoryColor || item.color}`} href="/blog">
                {item.category}
              </Link>
              <Link className="title" href={`/blog/${item.slug}`}>
                {item.title}
              </Link>
              <p>{item.description || item.desc}</p>
              <Link className="read_btn" href={`/blog/${item.slug}`}>
                Read More <i className="fas fa-chevron-circle-right"></i>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default BlogSlider;
