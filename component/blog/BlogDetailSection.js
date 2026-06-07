"use client";
import Link from "next/link";
import React from "react";

const BlogDetailSection = ({ post, recentPosts = [] }) => {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <section className="tf__blog_details_page mt_195 xs_mt_100">
      <div className="container">
        <div className="row">
          {/* Main content */}
          <div className="col-xl-8 col-lg-8">
            <div className="tf__blog_details_area">
              {post.imagePath && (
                <div className="tf__blog_details_img wow fadeInUp">
                  <img
                    src={post.imagePath}
                    alt="blog details"
                    className="img-fluid w-100"
                  />
                </div>
              )}
              <div className="tf__blog_details_text wow fadeInUp">
                <ul className="date d-flex flex-wrap">
                  {post.author && (
                    <li>
                      <i className="far fa-user-edit"></i> {post.author}
                    </li>
                  )}
                  {publishedDate && (
                    <li>
                      <i className="fal fa-calendar-alt"></i> {publishedDate}
                    </li>
                  )}
                </ul>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>

              <div className="tf__comment_reply mt_65 wow fadeInUp">
                <h3>Leave a Comment</h3>
                <form>
                  <div className="row">
                    <div className="col-xl-6">
                      <input type="text" placeholder="Name" />
                    </div>
                    <div className="col-xl-6">
                      <input type="email" placeholder="Email" />
                    </div>
                    <div className="col-xl-12">
                      <textarea rows="5" placeholder="Comment..."></textarea>
                      <button type="submit">Submit</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-xl-4 col-lg-4">
            <div className="tf__sidebar" id="sticky_sidebar">
              <div className="tf__sidebar_search">
                <form>
                  <input type="text" placeholder="Search..." />
                  <button type="submit">
                    <i className="far fa-search"></i>
                  </button>
                </form>
              </div>

              {recentPosts.length > 0 && (
                <div className="tf__sidebar_blog sidebar_item">
                  <h3>Recent Posts</h3>
                  <ul>
                    {recentPosts.map((item) => (
                      <li key={item.id}>
                        {item.imagePath && (
                          <div className="img">
                            <img
                              src={item.imagePath}
                              alt="blog"
                              className="img-fluid w-100"
                            />
                          </div>
                        )}
                        <div className="text">
                          <p>
                            <i className="far fa-calendar-alt"></i>{" "}
                            {new Date(item.publishedAt).toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="tf__sidebar_tags sidebar_item pr_10">
                <h3>Categories</h3>
                <ul className="d-flex flex-wrap">
                  {[...new Set(recentPosts.map((p) => p.category).filter(Boolean))].map((cat) => (
                    <li key={cat}>
                      <Link href="/blog">{cat}</Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailSection;
