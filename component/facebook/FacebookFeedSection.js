"use client";
import React, { useEffect, useState } from "react";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false);
  const text = post.message || "";
  const short = text.length > 180 ? text.slice(0, 180) + "…" : text;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {post.full_picture && (
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#f0f2f5" }}>
          <img
            src={post.full_picture}
            alt="post"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#1877f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.927-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "#1c1e21", lineHeight: 1.2 }}>
              East Asian International College
            </div>
            <div style={{ fontSize: "12px", color: "#65676b" }}>
              {post.created_time ? timeAgo(post.created_time) : ""}
            </div>
          </div>
        </div>

        {text && (
          <p style={{ fontSize: "14px", color: "#1c1e21", lineHeight: 1.6, margin: 0, flex: 1 }}>
            {expanded ? text : short}
            {text.length > 180 && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1877f2",
                  cursor: "pointer",
                  fontSize: "13px",
                  padding: 0,
                  marginLeft: 4,
                }}
              >
                {expanded ? "See less" : "See more"}
              </button>
            )}
          </p>
        )}

        {post.permalink_url && (
          <a
            href={post.permalink_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: "auto",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "#e7f3ff",
              color: "#1877f2",
              fontWeight: 600,
              fontSize: "13px",
              textDecoration: "none",
              alignSelf: "flex-start",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877f2">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.927-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
            View on Facebook
          </a>
        )}
      </div>
    </div>
  );
}

const FacebookFeedSection = () => {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetch("/api/facebook-posts")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .catch(() => setPosts([]));
  }, []);

  return (
    <section className="tf__facebook_feed mt_95">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-md-8 col-lg-6 m-auto wow fadeInUp">
            <div className="tf__heading_area mb_25">
              <h5>STAY CONNECTED</h5>
              <h2>Latest From Our Facebook Page</h2>
            </div>
          </div>
        </div>

        {posts === null && (
          <div className="row justify-content-center">
            <div className="col-12 text-center" style={{ padding: "40px 0", color: "#65676b" }}>
              Loading posts…
            </div>
          </div>
        )}

        {posts !== null && posts.length === 0 && (
          <div className="row justify-content-center">
            <div
              className="col-xl-6 col-lg-8 col-md-10 text-center wow fadeInUp"
              style={{
                padding: "40px 30px",
                background: "#f0f2f5",
                borderRadius: "14px",
                color: "#65676b",
                fontSize: "15px",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#1877f2" style={{ marginBottom: 12 }}>
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.927-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
              <p style={{ margin: 0 }}>
                Follow us on Facebook for the latest updates.
              </p>
              <a
                href="https://web.facebook.com/eastasianinternationalcollege"
                target="_blank"
                rel="noopener noreferrer"
                className="common_btn"
                style={{ display: "inline-block", marginTop: 16 }}
              >
                Visit Our Page
              </a>
            </div>
          </div>
        )}

        {posts !== null && posts.length > 0 && (
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post.id} className="col-xl-4 col-md-6 wow fadeInUp">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FacebookFeedSection;
