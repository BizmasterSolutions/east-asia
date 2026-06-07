import React from "react";

const DEFAULT_ITEMS = [
  { icon: "fa fa-book", title: "Parenting Bill", color: "light_blue" },
  { icon: "fa fa-graduation-cap", title: "Engineering", color: "green" },
  { icon: "fa fa-university", title: "Sports Training", color: "orange" },
  { icon: "fa fa-book-medical", title: "School Directly", color: "blue" },
];

const ActivitySection = ({ data = {} }) => {
  const subtitle = data.activity_subtitle || "OUR Best ACTIVITIES";
  const heading = data.activity_heading || "We School Be Happy With Our Activities.";
  const description = data.activity_description || "Business tailored it design, management & support services business agency elit, sed do eiusmod tempor.";
  const img = data.activity_img || "/Untitled design.png";

  let items = DEFAULT_ITEMS;
  try {
    const parsed = JSON.parse(data.activity_items || "[]");
    if (parsed.length > 0) items = parsed;
  } catch { }

  const left = items.slice(0, Math.ceil(items.length / 2));
  const right = items.slice(Math.ceil(items.length / 2));

  return (
    <section className="tf__activities mt_100 xs_mt_95">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 wow fadeInLeft">
            <div className="tf__heading_area tf__heading_area_left mb_20">
              <h5>{subtitle}</h5>
              <h2>{heading}</h2>
            </div>
            <div className="tf__activities_text">
              <p>{description}</p>
              <div className="row">
                <div className="col-xl-6 col-sm-6">
                  {left.map((item, i) => (
                    <div key={i} className={`tf__activities_item ${item.color}`}>
                      <span><i className={item.icon}></i></span>
                      <h3>{item.title}</h3>
                    </div>
                  ))}
                </div>
                <div className="col-xl-6 col-sm-6 xs_mt_0 mt_30 md_margin">
                  {right.map((item, i) => (
                    <div key={i} className={`tf__activities_item ${item.color}`}>
                      <span><i className={item.icon}></i></span>
                      <h3>{item.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-md-9 col-lg-6 wow fadeInRight">
            <div className="tf__activities_img">
              <img src={img} alt="activities" className="img-fluid w-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitySection;
