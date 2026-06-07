import Link from "next/link";
import React from "react";

const COLOR_MAP = {
  blue:   { bg: "#003B69", text: "#fff" },
  orange: { bg: "#F0D264", text: "#003B69" },
  green:  { bg: "#1ab69d", text: "#fff" },
  red:    { bg: "#ff5b5c", text: "#fff" },
};

const EventDetailSection = ({ event }) => {
  const dateStr = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "";

  const badge = COLOR_MAP[event.color] || COLOR_MAP.blue;

  const infoCards = [
    { icon: "far fa-calendar-alt", label: "Date",      value: dateStr || "TBA" },
    { icon: "far fa-clock",        label: "Time",      value: event.time || "TBA" },
    { icon: "far fa-map-marker-alt", label: "Location", value: event.location || "TBA" },
    { icon: "far fa-user",         label: "Organiser", value: event.organizerName || "East Asian School" },
  ];

  return (
    <section className="tf__event_details mt_195 xs_mt_100">
      <div className="container">

        {/* ── Hero image — uses .tf__event_details_img so global img CSS works correctly ── */}
        <div className="tf__event_details_img wow fadeInUp" style={{ position: "relative" }}>
          {event.imagePath ? (
            <img src={event.imagePath} alt={event.title} />
          ) : (
            <div style={{
              height: "100%", minHeight: 400,
              background: "linear-gradient(135deg, #003B69 0%, #1ab69d 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className="fas fa-calendar-alt" style={{ fontSize: 80, color: "rgba(255,255,255,0.25)" }}></i>
            </div>
          )}

          {/* Category badge */}
          <span style={{
            position: "absolute", top: 24, left: 24, zIndex: 2,
            background: badge.bg, color: badge.text,
            fontSize: 12, fontWeight: 700, letterSpacing: "1px",
            padding: "7px 20px", borderRadius: 30, textTransform: "uppercase",
            boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
          }}>
            {event.category || "School"}
          </span>

          {/* Gradient overlay + title */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
            padding: "48px 32px 28px", zIndex: 1,
          }}>
            <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: 0, lineHeight: 1.3, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
              {event.title}
            </h1>
          </div>
        </div>

        <div className="row mt_50">
          {/* ── Main content ── */}
          <div className="col-xl-8 col-lg-8 wow fadeInUp">

            {/* Info cards */}
            <div className="row" style={{ marginBottom: 32 }}>
              {infoCards.map((card, i) => (
                <div className="col-md-6" key={i} style={{ marginBottom: 16 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "#fff", borderRadius: 12,
                    padding: "16px 20px",
                    border: "1px solid #eef2f7",
                    boxShadow: "0 2px 12px rgba(0,59,105,0.06)",
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: "linear-gradient(135deg, #003B69, #1ab69d)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <i className={card.icon} style={{ color: "#F0D264", fontSize: 16 }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 3 }}>
                        {card.label}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
                        {card.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {event.description && (
              <div style={{
                background: "#fff", borderRadius: 16, padding: "28px 30px",
                border: "1px solid #eef2f7",
                boxShadow: "0 2px 12px rgba(0,59,105,0.06)",
                marginBottom: 32,
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 14, paddingBottom: 12, borderBottom: "2px solid #F0D264", display: "inline-block" }}>
                  About This Event
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: "#475569", margin: 0 }}>
                  {event.description}
                </p>
              </div>
            )}

            <Link href="/events" style={{ textDecoration: "none" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", background: "#003B69", color: "#F0D264",
                borderRadius: 10, fontWeight: 700, fontSize: 14,
              }}>
                <i className="far fa-arrow-left"></i> Back to Events
              </span>
            </Link>
          </div>

          {/* ── Sidebar ── */}
          <div className="col-xl-4 col-lg-4 wow fadeInUp">
            <div style={{
              background: "#003B69", borderRadius: 18, overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,59,105,0.22)",
              position: "sticky", top: 100,
            }}>
              <div style={{ background: "#F0D264", padding: "20px 24px" }}>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#003B69" }}>
                  Event Details
                </h4>
              </div>
              <div style={{ padding: "8px 0" }}>
                {[...infoCards, { icon: "far fa-tag", label: "Category", value: event.category || "School" }]
                  .map((row, i, arr) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "14px 24px",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                        background: "rgba(240,210,100,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <i className={row.icon} style={{ color: "#F0D264", fontSize: 14 }}></i>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 3 }}>
                          {row.label}
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: "#fff", lineHeight: 1.4 }}>
                          {row.value}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div style={{ padding: "16px 24px 24px" }}>
                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <span style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "13px", background: "#F0D264", color: "#003B69",
                    borderRadius: 10, fontWeight: 800, fontSize: 14,
                  }}>
                    <i className="far fa-envelope"></i> Contact Us
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

export default EventDetailSection;
