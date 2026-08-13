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
    <div className="tf__fb_card">
      {post.full_picture && (
        <div className="tf__fb_card_img_wrap">
          <img src={post.full_picture} alt="post" className="tf__fb_card_img" />
        </div>
      )}

      <div className="tf__fb_card_body">
        <div className="tf__fb_card_header">
          <div className="tf__fb_card_avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.927-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </div>
          <div>
            <div className="tf__fb_card_name">East Asian International College</div>
            <div className="tf__fb_card_time">
              {post.created_time ? timeAgo(post.created_time) : ""}
            </div>
          </div>
        </div>

        {text && (
          <p className="tf__fb_card_text">
            {expanded ? text : short}
            {text.length > 180 && (
              <button className="tf__fb_card_seemore" onClick={() => setExpanded(!expanded)}>
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
            className="tf__fb_card_link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
            <div className="col-xl-6 col-lg-8 col-md-10 text-center wow fadeInUp">
              <div className="tf__fb_empty">
                <svg
                  className="tf__fb_empty_icon"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="#1877f2"
                >
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
