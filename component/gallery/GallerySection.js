"use client";
import { useState } from "react";

const CATEGORIES = ["all", "events", "sports", "academic", "arts", "competitions", "classroom"];

export default function GallerySection({ photos = [], videos = [] }) {
  const [activeTab, setActiveTab] = useState("photos");
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeCategory === "all"
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  return (
    <section style={{ padding: "140px 0 80px", minHeight: "60vh" }}>
      <div className="container">
        {/* Heading */}
        <div className="row">
          <div className="col-xl-6 col-lg-6 m-auto text-center wow fadeInUp" style={{ marginBottom: 40 }}>
            <div className="tf__heading_area">
              <h5>OUR GALLERY</h5>
              <h2>Moments &amp; Memories</h2>
            </div>
          </div>
        </div>

        {/* Photos / Videos tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, justifyContent: "center" }}>
          {["photos", "videos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 24px",
                borderRadius: 24,
                border: "2px solid #4f46e5",
                background: activeTab === tab ? "#4f46e5" : "transparent",
                color: activeTab === tab ? "#fff" : "#4f46e5",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category filter (photos only) */}
        {activeTab === "photos" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32, justifyContent: "center" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "5px 16px",
                  borderRadius: 20,
                  border: "1px solid #d1d5db",
                  background: activeCategory === cat ? "#111827" : "#f9fafb",
                  color: activeCategory === cat ? "#fff" : "#374151",
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Photos grid */}
        {activeTab === "photos" && (
          filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>No photos in this category yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {filtered.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setLightbox(photo.imagePath)}
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    cursor: "pointer",
                    aspectRatio: "4/3",
                    background: "#f3f4f6",
                    position: "relative",
                  }}
                >
                  <img
                    src={photo.imagePath}
                    alt={photo.category}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s" }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <span style={{
                    position: "absolute", bottom: 8, left: 8,
                    background: "rgba(0,0,0,0.55)", color: "#fff",
                    fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 12, textTransform: "capitalize",
                  }}>
                    {photo.category}
                  </span>
                </div>
              ))}
            </div>
          )
        )}

        {/* Videos grid */}
        {activeTab === "videos" && (
          videos.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>No videos added yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
              {videos.map((video) => {
                const id = video.youtubeUrl.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
                return (
                  <div key={video.id} style={{ borderRadius: 10, overflow: "hidden", background: "#000" }}>
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${id}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <p style={{ padding: "10px 14px", margin: 0, fontWeight: 600, fontSize: 14, color: "#111827", background: "#fff" }}>
                      {video.title}
                    </p>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox}
            alt="gallery"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8, objectFit: "contain" }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute", top: 20, right: 28,
              background: "none", border: "none", color: "#fff", fontSize: 32, cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
      )}
    </section>
  );
}
