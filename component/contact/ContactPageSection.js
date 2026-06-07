import React from "react";
import ContactForm from "../form/ContactForm";

const contactInfo = [
  {
    icon: "fal fa-phone-alt",
    color: "#003B69",
    bg: "#e8f0f7",
    label: "Call Us",
    lines: ["+94 77 88 81 558", "+94 11 28 54 838"],
    href: ["tel:+94778881558", "tel:+94112854838"],
  },
  {
    icon: "fal fa-envelope",
    color: "#F0D264",
    bg: "#fdf9e3",
    label: "Email Us",
    lines: ["east.asian@ymail.com", "www.eastasian.lk"],
    href: ["mailto:east.asian@ymail.com", "https://www.eastasian.lk"],
  },
  {
    icon: "fal fa-map-marker-alt",
    color: "#1ab69d",
    bg: "#e6f8f5",
    label: "Our Address",
    lines: ["No 25 Sunethradevi Rd,", "Kohuwela, Nugegoda, Sri Lanka"],
  },
  {
    icon: "fal fa-clock",
    color: "#ff5b5c",
    bg: "#fff0f0",
    label: "Office Hours",
    lines: ["Mon – Fri: 7:30 am – 4:30 pm", "Sat: 8:00 am – 12:00 pm"],
  },
];

const ContactPageSection = () => {
  return (
    <section className="tf__contact_page mt_190 xs_mt_95">
      <div className="container">

        {/* ── Top row: form + contact cards ── */}
        <div className="row g-5 align-items-start">

          {/* Form column */}
          <div className="col-xl-7 col-lg-6 wow fadeInLeft">
            <div style={{
              background: "#003B69",
              borderRadius: "16px",
              padding: "48px 44px",
              boxShadow: "0 12px 40px rgba(0,59,105,0.18)",
            }}>
              <div style={{ marginBottom: "32px" }}>
                <span style={{
                  display: "inline-block",
                  background: "#F0D264",
                  color: "#003B69",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "1.5px",
                  padding: "5px 14px",
                  borderRadius: "20px",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                }}>
                  EAST ASIAN INTERNATIONAL SCHOOL
                </span>
                <h2 style={{ color: "#fff", fontSize: "32px", fontWeight: "700", marginBottom: "12px", lineHeight: "1.3" }}>
                  Get In Touch With Us.
                </h2>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: "1.75", margin: 0 }}>
                  We would love to hear from you. Whether you have a question about
                  admissions, programmes, fees, or anything else — our team is ready
                  to answer all your questions.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>

          {/* Contact info cards column */}
          <div className="col-xl-5 col-lg-6 wow fadeInRight">
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {contactInfo.map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "24px 26px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                  borderLeft: `4px solid ${item.color}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}>
                  <div style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "12px",
                    background: item.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <i className={item.icon} style={{ color: item.color, fontSize: "20px" }}></i>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {item.label}
                    </p>
                    {item.lines.map((line, j) => (
                      item.href ? (
                        <a key={j} href={item.href[j]} style={{ display: "block", color: "#222", fontWeight: "600", fontSize: "15px", lineHeight: "1.8", textDecoration: "none" }}>
                          {line}
                        </a>
                      ) : (
                        <p key={j} style={{ margin: 0, color: "#222", fontWeight: "600", fontSize: "15px", lineHeight: "1.8" }}>
                          {line}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Map ── */}
        <div className="row wow fadeInUp">
          <div className="col-12">
            <div style={{
              marginTop: "80px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            }}>
              <iframe
                src="https://www.google.com/maps?q=No+25+Sunethradevi+Road,+Kohuwela,+Nugegoda,+Sri+Lanka&output=embed"
                width="100%"
                height="420"
                style={{ display: "block", border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactPageSection;
