"use client";
import Link from "next/link";
import React from "react";

const COLOR_MAP = {
  blue:   { bg: "#003B69", text: "#fff" },
  orange: { bg: "#F0D264", text: "#003B69" },
  green:  { bg: "#1ab69d", text: "#fff" },
  red:    { bg: "#ff5b5c", text: "#fff" },
};
const FALLBACK = ["blue", "green", "orange", "red"];

const AllEventSection = ({ events = [] }) => {
  return (
    <section className="tf__event_page mt_190 xs_mt_95">
      <div className="container">

        <div className="row wow fadeInUp">
          <div className="col-xl-6 col-md-8 col-lg-6 m-auto">
            <div className="tf__heading_area mb_50">
              <h5>OUR UPCOMING EVENTS</h5>
              <h2>Explore Our School Events &amp; Activities.</h2>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="row">
            <div className="col-12 text-center" style={{ padding: "80px 0" }}>
              <i className="fas fa-calendar-alt" style={{ fontSize: 56, color: "#d1d5db", display: "block", marginBottom: 16 }}></i>
              <h4 style={{ color: "#9ca3af", fontWeight: 600, marginBottom: 8 }}>No Events Yet</h4>
              <p style={{ color: "#c0c8d2", fontSize: 15 }}>Check back soon — exciting events are coming!</p>
            </div>
          </div>
        ) : (
          <div className="row">
            {events.map((item, idx) => {
              const colorKey = item.color || FALLBACK[idx % FALLBACK.length];
              const badge    = COLOR_MAP[colorKey] || COLOR_MAP.blue;
              const day      = item.eventDate ? new Date(item.eventDate).toLocaleDateString("en-GB", { day: "numeric" }) : "";
              const month    = item.eventDate ? new Date(item.eventDate).toLocaleDateString("en-GB", { month: "short" }) : "";
              const year     = item.eventDate ? new Date(item.eventDate).toLocaleDateString("en-GB", { year: "numeric" }) : "";

              return (
                <div className="col-xl-4 col-md-6 wow fadeInUp" key={item.id} style={{ marginBottom: 30 }}>
                  <div style={{
                    background: "#fff",
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow: "0 2px 20px rgba(0,59,105,0.10)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    border: "1px solid #eef2f7",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,59,105,0.16)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 20px rgba(0,59,105,0.10)";
                    }}
                  >
                    {/* ── Image ── */}
                    <div style={{ position: "relative", height: 230, overflow: "hidden", flexShrink: 0 }}>
                      {item.imagePath ? (
                        <img
                          src={item.imagePath}
                          alt={item.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%",
                          background: "linear-gradient(135deg, #003B69 0%, #1ab69d 100%)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <i className="fas fa-calendar-alt" style={{ fontSize: 56, color: "rgba(255,255,255,0.3)" }}></i>
                        </div>
                      )}

                      {/* Category badge */}
                      <span style={{
                        position: "absolute", top: 16, right: 16,
                        background: badge.bg, color: badge.text,
                        fontSize: 11, fontWeight: 700, letterSpacing: "1px",
                        padding: "6px 16px", borderRadius: 30,
                        textTransform: "uppercase",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                      }}>
                        {item.category || "School"}
                      </span>

                      {/* Date chip */}
                      <div style={{
                        position: "absolute", bottom: 0, left: 0,
                        background: "#003B69",
                        padding: "10px 20px",
                        display: "flex", alignItems: "center", gap: 10,
                        borderTopRightRadius: 14,
                      }}>
                        <div style={{ textAlign: "center", lineHeight: 1.1 }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "#F0D264" }}>{day}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{month}</div>
                        </div>
                        <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.2)" }}></div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{year}</div>
                      </div>
                    </div>

                    {/* ── Body ── */}
                    <div style={{ padding: "22px 24px 20px", display: "flex", flexDirection: "column", flex: 1 }}>

                      {/* Meta pills */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                        {item.location && (
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            background: "#f0f7ff", color: "#003B69",
                            fontSize: 12, fontWeight: 500,
                            padding: "5px 12px", borderRadius: 20,
                          }}>
                            <i className="far fa-map-marker-alt" style={{ fontSize: 11 }}></i>
                            {item.location}
                          </span>
                        )}
                        {item.time && (
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            background: "#f0fdf8", color: "#1ab69d",
                            fontSize: 12, fontWeight: 500,
                            padding: "5px 12px", borderRadius: 20,
                          }}>
                            <i className="far fa-clock" style={{ fontSize: 11 }}></i>
                            {item.time}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 style={{
                        fontSize: 18, fontWeight: 700, color: "#0f172a",
                        margin: "0 0 10px", lineHeight: 1.4,
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {item.title}
                      </h4>

                      {/* Description */}
                      {item.description && (
                        <p style={{
                          fontSize: 13.5, color: "#64748b", lineHeight: 1.7,
                          margin: "0 0 18px",
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>
                          {item.description}
                        </p>
                      )}

                      {/* Organiser */}
                      {item.organizerName && (
                        <div style={{
                          display: "flex", alignItems: "center", gap: 10,
                          paddingTop: 14, borderTop: "1px solid #f1f5f9",
                          marginTop: "auto", marginBottom: 16,
                        }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%",
                            background: "linear-gradient(135deg, #003B69, #1ab69d)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            <i className="far fa-user" style={{ fontSize: 13, color: "#fff" }}></i>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Organiser</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{item.organizerName}</div>
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      {item.slug ? (
                        <Link href={`/events/${item.slug}`} style={{ textDecoration: "none", marginTop: item.organizerName ? 0 : "auto" }}>
                          <div style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            padding: "12px", background: "#003B69", color: "#F0D264",
                            borderRadius: 10, fontSize: 13.5, fontWeight: 700,
                            letterSpacing: "0.3px",
                          }}>
                            View Details
                            <i className="far fa-arrow-right" style={{ fontSize: 12 }}></i>
                          </div>
                        </Link>
                      ) : (
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          padding: "12px", background: "#f8fafc", color: "#94a3b8",
                          borderRadius: 10, fontSize: 13, fontWeight: 600,
                          border: "1px dashed #e2e8f0", marginTop: item.organizerName ? 0 : "auto",
                        }}>
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllEventSection;
