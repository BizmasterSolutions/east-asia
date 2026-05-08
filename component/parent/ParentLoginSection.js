"use client";
import Link from "next/link";
import ParentLoginForm from "./ParentLoginForm";

export default function ParentLoginSection() {
  return (
    <section className="tf__login mt_195 xs_mt_95">
      <div className="container">
        <div className="row wow fadeInUp">
          <div className="col-xxl-5 col-xl-6 col-md-9 col-lg-7 m-auto">
            <div className="tf__login_area">
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <span style={{ display: "inline-block", background: "#e0f2fe", color: "#0891b2", padding: "4px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", border: "1px solid #0891b2" }}>
                  Parent Portal
                </span>
              </div>
              <h2>Welcome, Parent!</h2>
              <p>Sign in to monitor your child's academic progress</p>
              <ParentLoginForm />
              <p className="create_account" style={{ textAlign: "center", marginTop: "16px" }}>
                Student?{" "}
                <Link href="/student-portal/login">Go to Student Portal</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
