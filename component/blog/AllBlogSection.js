"use client";
import Link from "next/link";
import React, { useState } from "react";

const POSTS_PER_PAGE = 6;

const AllBlogSection = ({ posts = [] }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <section className="tf__blog_page mt_190 xs_mt_95">
      <div className="container">
        <div className="row wow fadeInUp">
          <div className="col-xl-6 col-md-8 col-lg-6 m-auto">
            <div className="tf__heading_area mb_15">
              <h5>LATEST NEWS & BLOG</h5>
              <h2>Our Latest Blog And News.</h2>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="row">
            <div className="col-12 text-center" style={{ padding: "60px 0", color: "#6b7280" }}>
              <p>No blog posts published yet.</p>
            </div>
          </div>
        ) : (
          <div className="row">
            {currentPosts.map((post) => (
              <div className="col-xl-4 col-md-6 wow fadeInUp" key={post.id}>
                <div className="tf__single_blog">
                  <Link className="tf__single_blog_img" href={`/blog/${post.slug}`}>
                    <img
                      src={post.imagePath || "/images/blog_placeholder.jpg"}
                      alt={post.title}
                      className="img-fluid w-100"
                    />
                  </Link>
                  <div className="tf__single_blog_text">
                    <Link className={`category ${post.categoryColor}`} href="#">
                      {post.category}
                    </Link>
                    <Link className="title" href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                    <p>{post.description}</p>
                    <Link className="read_btn" href={`/blog/${post.slug}`}>
                      Read More <i className="fas fa-chevron-circle-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="tf__pagination mt_50">
            <div className="row">
              <div className="col-12">
                <nav aria-label="Blog pagination">
                  <ul className="pagination">
                    <li className="page-item">
                      <a
                        className={`page-link ${page === 1 ? "disabled" : ""}`}
                        onClick={() => page > 1 && setPage(page - 1)}
                        style={{ cursor: page === 1 ? "default" : "pointer" }}
                      >
                        <i className="far fa-angle-left"></i>
                      </a>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li className="page-item" key={i}>
                        <a
                          className={`page-link ${page === i + 1 ? "active" : ""}`}
                          onClick={() => setPage(i + 1)}
                          style={{ cursor: "pointer" }}
                        >
                          {i + 1}
                        </a>
                      </li>
                    ))}
                    <li className="page-item">
                      <a
                        className={`page-link ${page === totalPages ? "disabled" : ""}`}
                        onClick={() => page < totalPages && setPage(page + 1)}
                        style={{ cursor: page === totalPages ? "default" : "pointer" }}
                      >
                        <i className="far fa-angle-right"></i>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllBlogSection;
