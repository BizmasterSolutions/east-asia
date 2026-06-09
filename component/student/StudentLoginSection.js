"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

const StudentLoginSection = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill out all fields.", { position: "top-right" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid credentials.", { position: "top-right" });
        return;
      }
      toast.success("Welcome to your portal!", { position: "top-right" });
      window.location.href = "/student-portal/dashboard";
    } catch {
      toast.error("Something went wrong. Please try again.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style suppressHydrationWarning>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .spl-page {
          min-height: 100vh;
          display: flex;
        }

        /* ── LEFT PANEL ── */
        .spl-left {
          width: 44%;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 44px 48px;
        }
        .spl-left-top {
          position: relative; z-index: 2;
          margin-bottom: auto;
          padding-top: 32px;
        }
        .spl-logo {
          width: 80px; height: 80px;
          position: relative;
        }
        .spl-left-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 75% at 50% 55%, transparent 30%, rgba(0,0,0,0.92) 100%),
            linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%);
          z-index: 1;
        }
        .spl-left-bottom {
          position: relative; z-index: 2;
        }
        .spl-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(240,210,100,0.14);
          border: 1px solid rgba(240,210,100,0.38);
          border-radius: 30px;
          padding: 5px 13px;
          font-size: 11px; font-weight: 700; letter-spacing: .7px;
          color: #F0D264;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .spl-left-title {
          font-size: 38px; font-weight: 900;
          color: #fff; line-height: 1.12;
          margin-bottom: 16px;
          letter-spacing: -.5px;
        }
        .spl-left-title span { color: #F0D264; display: block; }
        .spl-accent-line {
          width: 44px; height: 3px;
          background: linear-gradient(90deg, #F0D264, transparent);
          border-radius: 2px;
          margin-bottom: 22px;
        }
        .spl-stats {
          display: flex; gap: 32px;
        }
        .spl-stat-num {
          font-size: 24px; font-weight: 900;
          color: #F0D264; line-height: 1;
          margin-bottom: 3px;
        }
        .spl-stat-lbl {
          font-size: 11px; color: rgba(255,255,255,0.55);
          font-weight: 500; letter-spacing: .4px;
        }

        /* ── RIGHT PANEL ── */
        .spl-right {
          flex: 1;
          background: #f7f8fa;
          display: flex;
          flex-direction: column;
        }

        .spl-topbar {
          padding: 18px 44px;
          display: flex;
          align-items: center;
        }
        .spl-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 700; color: #374151;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          transition: border-color .18s, color .18s, box-shadow .18s;
        }
        .spl-back-btn:hover {
          border-color: #CCAA00;
          color: #92700a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        }
        .spl-back-btn i { font-size: 11px; }

        .spl-form-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 44px 48px;
        }
        .spl-form-wrap { width: 100%; max-width: 400px; }

        .spl-card {
          background: #fff;
          border-radius: 20px;
          padding: 40px 38px 36px;
          box-shadow: 0 2px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04);
        }

        .spl-portal-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fffbeb;
          border: 1.5px solid #d4a800;
          color: #7a6100;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .6px; text-transform: uppercase;
          margin-bottom: 14px;
        }
        .spl-portal-tag i { font-size: 10px; }

        .spl-card-title {
          font-size: 24px; font-weight: 900;
          color: #0d0d0d; margin-bottom: 4px;
        }
        .spl-card-sub {
          font-size: 13px; color: #6b7280;
          margin-bottom: 28px;
        }

        /* form fields */
        .spl-field { margin-bottom: 16px; }
        .spl-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 800;
          color: #6b7280; text-transform: uppercase;
          letter-spacing: .8px; margin-bottom: 7px;
        }
        .spl-label i { font-size: 10px; color: #CCAA00; }
        .spl-input-box { position: relative; }
        .spl-input {
          width: 100%;
          padding: 12px 42px 12px 14px;
          border: 1.5px solid #e9eaec;
          border-radius: 9px;
          font-size: 14px; color: #111;
          background: #f9fafb;
          outline: none;
          transition: border-color .18s, background .18s, box-shadow .18s;
          -webkit-appearance: none;
        }
        .spl-input:focus {
          border-color: #CCAA00;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(204,170,0,0.10);
        }
        .spl-input::placeholder { color: #c5c9d3; font-size: 13px; }
        .spl-eye-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; padding: 0;
          color: #c5c9d3; font-size: 14px;
          transition: color .15s;
          display: flex; align-items: center;
        }
        .spl-eye-btn:hover { color: #6b7280; }

        .spl-row {
          display: flex; align-items: center;
          justify-content: space-between;
          margin: 14px 0 22px;
        }
        .spl-remember {
          display: flex; align-items: center; gap: 7px;
          font-size: 13px; color: #6b7280;
          cursor: pointer; user-select: none;
        }
        .spl-remember input[type="checkbox"] {
          width: 15px; height: 15px;
          accent-color: #CCAA00; cursor: pointer;
        }
        .spl-forgot {
          font-size: 12px; font-weight: 700;
          color: #CCAA00; text-decoration: none;
          letter-spacing: .2px;
        }
        .spl-forgot:hover { color: #92700a; text-decoration: underline; }

        .spl-submit {
          width: 100%;
          padding: 13px 20px;
          background: #001D3D;
          color: #F0D264;
          font-size: 14px; font-weight: 800;
          letter-spacing: .5px;
          border: none; border-radius: 9px;
          cursor: pointer;
          display: flex; align-items: center;
          justify-content: center; gap: 9px;
          transition: background .2s, transform .12s, box-shadow .2s;
          box-shadow: 0 4px 14px rgba(0,29,61,0.18);
        }
        .spl-submit:hover:not(:disabled) {
          background: #003B69;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,29,61,0.22);
        }
        .spl-submit:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 3px 10px rgba(0,29,61,0.18);
        }
        .spl-submit:disabled { opacity: .65; cursor: not-allowed; }

        .spl-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(240,210,100,0.3);
          border-top-color: #F0D264;
          border-radius: 50%;
          animation: spl-spin .7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spl-spin { to { transform: rotate(360deg); } }

        /* divider */
        .spl-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 22px 0 20px;
        }
        .spl-div-line { flex: 1; height: 1px; background: #f0f0f0; }
        .spl-divider span {
          font-size: 10px; font-weight: 800; color: #c9cdd4;
          letter-spacing: 1.2px; white-space: nowrap;
        }

        /* other portals */
        .spl-portal-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .spl-chip {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 12px; font-weight: 700;
          text-decoration: none;
          transition: transform .15s, box-shadow .15s;
        }
        .spl-chip:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .spl-chip.admin {
          background: #f0f4ff;
          border: 1.5px solid #1d4ed8;
          color: #1d4ed8;
        }
        .spl-chip.parent {
          background: #f0fdf4;
          border: 1.5px solid #16a34a;
          color: #15803d;
        }

        .spl-footer-row {
          text-align: center;
          font-size: 13px; color: #6b7280;
          margin-top: 18px;
        }
        .spl-footer-row a {
          color: #CCAA00; font-weight: 700; text-decoration: none;
        }
        .spl-footer-row a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .spl-left { display: none; }
          .spl-form-area { padding: 0 20px 40px; }
          .spl-topbar { padding: 16px 20px; }
          .spl-card { padding: 28px 22px 24px; }
        }
      `}</style>

      <div className="spl-page">

        {/* ── LEFT PANEL ── */}
        <div className="spl-left" style={{ backgroundImage: "url('/young-schoolgirl-eyeglasses-holding-her-books-looks-tired-bored.avif')", backgroundSize: "cover", backgroundPosition: "center top" }}>
          <div className="spl-left-overlay" />

          <div className="spl-left-top">
            <div className="spl-logo">
              <Image src="/Logo.png" alt="East Asian Logo" fill style={{ objectFit: "contain" }} />
            </div>
          </div>

          <div className="spl-left-bottom">
            <div className="spl-badge">
              <i className="fas fa-award" style={{ fontSize: 10 }} />
              Est. 2005 &nbsp;·&nbsp; Accredited
            </div>
            <h2 className="spl-left-title">
              East Asian
              <span>International</span>
              School
            </h2>
            <div className="spl-accent-line" />
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="spl-right">

          <div className="spl-topbar">
            <Link href="/" className="spl-back-btn">
              <i className="fas fa-arrow-left" />
              Back to Home
            </Link>
          </div>

          <div className="spl-form-area">
            <div className="spl-form-wrap">
              <div className="spl-card">

                <div className="spl-portal-tag">
                  <i className="fas fa-graduation-cap" />
                  Student Portal
                </div>
                <h2 className="spl-card-title">Welcome Back!</h2>
                <p className="spl-card-sub">Sign in with your student credentials to continue</p>

                <form onSubmit={handleFormSubmit} autoComplete="off">

                  <div className="spl-field">
                    <label className="spl-label">
                      <i className="fas fa-user" />
                      Username
                    </label>
                    <div className="spl-input-box">
                      <input
                        className="spl-input"
                        type="text"
                        placeholder="Enter your student username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="spl-field">
                    <label className="spl-label">
                      <i className="fas fa-lock" />
                      Password
                    </label>
                    <div className="spl-input-box">
                      <input
                        className="spl-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="spl-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"} />
                      </button>
                    </div>
                  </div>

                  <div className="spl-row">
                    <label className="spl-remember">
                      <input type="checkbox" />
                      Remember Me
                    </label>
                    <a href="#" className="spl-forgot">Forgot Password?</a>
                  </div>

                  <button type="submit" className="spl-submit" disabled={loading}>
                    {loading ? (
                      <><span className="spl-spinner" /> Signing in...</>
                    ) : (
                      <>Sign In <i className="fas fa-arrow-right" style={{ fontSize: 11 }} /></>
                    )}
                  </button>

                </form>

                <div className="spl-divider">
                  <div className="spl-div-line" />
                  <span>OTHER PORTALS</span>
                  <div className="spl-div-line" />
                </div>

                <div className="spl-portal-row" style={{ gridTemplateColumns: "1fr" }}>
                  <Link href="/parent-portal/login" className="spl-chip parent">
                    <i className="fas fa-users" />
                    Parent Portal
                  </Link>
                </div>

              </div>

              <p className="spl-footer-row">
                Need help?{" "}
                <Link href="/contact">Contact Support</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default StudentLoginSection;
