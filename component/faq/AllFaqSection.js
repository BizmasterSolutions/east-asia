"use client";
import { allFaqData } from "@/data/Data";
import Link from "next/link";
import React, { useState } from "react";

const contactRows = [
  {
    icon: "fal fa-map-marker-alt",
    label: "Address",
    value: "No 25 Sunethradevi Rd, Kohuwela,\nNugegoda, Sri Lanka",
  },
  {
    icon: "fal fa-phone",
    label: "Phone",
    value: "+94 77 88 81 558\n+94 11 28 54 838",
  },
  {
    icon: "fal fa-envelope",
    label: "Email",
    value: "east.asian@ymail.com",
  },
  {
    icon: "fal fa-globe",
    label: "Website",
    value: "www.eastasian.lk",
  },
];

const AllFaqSection = () => {
  const [openAccordion, setOpenAccordion] = useState(0);

  const handleAccordionBtn = (itemId) => {
    setOpenAccordion((prevState) => (prevState === itemId ? null : itemId));
  };

  return (
    <section className="tf__faq tf__faq_page pt_190 xs_pt_95">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-md-8 col-lg-6 m-auto wow fadeInUp">
            <div className="tf__heading_area mb_10">
              <h5>EAST ASIAN INTERNATIONAL SCHOOL</h5>
              <h2>District is Made of about Students Childhood.</h2>
            </div>
          </div>
        </div>

        <div className="row">
          {/* FAQ Accordion */}
          <div className="col-xl-8 col-lg-7 wow fadeInUp">
            <div className="tf__faq_text">
              <div className="tf__faq_accordion">
                <div className="accordion" id="accordionExample">
                  {allFaqData.map((item) => (
                    <div className={`accordion-item ${item.color}`} key={item.id}>
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${openAccordion === item.id ? "" : "collapsed"}`}
                          onClick={() => handleAccordionBtn(item.id)}
                        >
                          {item.title}
                        </button>
                      </h2>
                      <div className={`accordion-collapse collapse ${openAccordion === item.id ? "show" : ""}`}>
                        <div className="accordion-body">
                          <p>{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Still Have Questions? — single card */}
          <div className="col-xl-4 col-lg-5 wow fadeInUp">
            <div style={{
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              position: "sticky",
              top: "100px",
            }}>
              {/* Card header — navy blue matches site theme */}
              <div style={{
                background: "#003B69",
                padding: "30px 28px 26px",
              }}>
                <h3 style={{ color: "#F0D264", fontSize: "22px", fontWeight: "700", marginBottom: "10px" }}>
                  Still Have Questions?
                </h3>
                <p style={{ color: "rgba(255,255,255,0.82)", margin: 0, fontSize: "14px", lineHeight: "1.75" }}>
                  Our admissions team is happy to help — we respond within one working day.
                </p>
              </div>

              {/* Contact rows */}
              <div style={{ background: "#fff", padding: "8px 0" }}>
                {contactRows.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "16px",
                      padding: "18px 26px",
                      borderBottom: i < contactRows.length - 1 ? "1px solid #f2f2f2" : "none",
                    }}
                  >
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "#F0D264",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <i className={row.icon} style={{ color: "#003B69", fontSize: "16px" }}></i>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                        {row.label}
                      </p>
                      {row.value.split("\n").map((line, j) => (
                        <p key={j} style={{ margin: 0, color: "#333", fontWeight: "500", fontSize: "14px", lineHeight: "1.7" }}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <div style={{ background: "#fff", padding: "16px 26px 26px" }}>
                <Link href="/contact">
                  <span style={{
                    display: "block",
                    textAlign: "center",
                    padding: "14px",
                    background: "#003B69",
                    color: "#F0D264",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "15px",
                    cursor: "pointer",
                    letterSpacing: "0.4px",
                  }}>
                    Contact Us
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllFaqSection;
