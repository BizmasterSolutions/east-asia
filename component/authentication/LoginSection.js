"use client";
import React from "react";
import LoginForm from "../form/LoginForm";
import Link from "next/link";

const LoginSection = () => {
  return (
    <section className="tf__login mt_195 xs_mt_95">
      <div className="container">
        <div className="row wow fadeInUp">
          <div className="col-xxl-5 col-xl-6 col-md-9 col-lg-7 m-auto">
            <div className="tf__login_area">
              <h2>Welcome to East Asian!</h2>
              <p>sign in to continue</p>
              <LoginForm />
              <p className="or">
                <span>or</span>
              </p>
              <ul className="d-flex">
                <li>
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fab fa-google-plus-g"></i>
                  </a>
                </li>
              </ul>
              <p className="create_account">
                Dont’t have an aceount ?{" "}
                <Link href="/sign-up">Create Account</Link>
              </p>
              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
                <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px", textAlign: "center" }}>Other portals</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Link href="/student-portal/login" style={{ flex: 1, display: "block", padding: "10px", background: "#c8a000", color: "#fff", borderRadius: "6px", textDecoration: "none", fontWeight: 600, fontSize: "13px", textAlign: "center" }}>
                    🎓 Student Portal
                  </Link>
                  <Link href="/parent-portal/login" style={{ flex: 1, display: "block", padding: "10px", background: "#0891b2", color: "#fff", borderRadius: "6px", textDecoration: "none", fontWeight: 600, fontSize: "13px", textAlign: "center" }}>
                    👨‍👧 Parent Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
