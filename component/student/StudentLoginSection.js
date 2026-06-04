"use client";
import React from "react";
import Link from "next/link";
import StudentLoginForm from "./StudentLoginForm";

const StudentLoginSection = () => {
  return (
    <section className="tf__login mt_195 xs_mt_95">
      <div className="container">
        <div className="row wow fadeInUp">
          <div className="col-xxl-5 col-xl-6 col-md-9 col-lg-7 m-auto">
            <div className="tf__login_area">
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <span style={{
                  display: "inline-block",
                  background: "#fff8e1",
                  color: "#c8a000",
                  padding: "4px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  border: "1px solid #c8a000",
                }}>
                  Student Portal
                </span>
              </div>
              <h2>Welcome Back!</h2>
              <p>Sign in with your student credentials to access your portal</p>
              <StudentLoginForm />
              <p className="create_account" style={{ textAlign: "center", marginTop: "16px" }}>
                Admin?{" "}
                <Link href="/sign-in">Go to Admin Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentLoginSection;
