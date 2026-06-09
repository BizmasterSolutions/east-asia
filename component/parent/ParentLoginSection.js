"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

export default function ParentLoginSection() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill out all fields.", { position: "top-right" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/parent/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid credentials.", { position: "top-right" });
        return;
      }
      toast.success("Welcome to the Parent Portal!", { position: "top-right" });
      window.location.href = "/parent-portal/dashboard";
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

        .ppl-page {
          min-height: 100vh;
          display: flex;
        }

        /* ── LEFT PANEL ── */
        .ppl-left {
          width: 44%;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 32px 44px 48px;
        }
        .ppl-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.78) 0%,
            rgba(0,0,0,0.35) 45%,
            rgba(0,0,0,0.08) 75%,
            transparent 100%
          );
          z-index: 1;
        }
        .ppl-left-top {
          position: relative; z-index: 2;
        }
        .ppl-logo {
          width: 80px; height: 80px;
          position: relative;
        }
        .ppl-left-bottom { position: relative; z-index: 2; }
        .ppl-badge {
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
        .ppl-left-title {
          font-size: 38px; font-weight: 900;
          color: #fff; line-height: 1.12;
          margin-bottom: 16px;
          letter-spacing: -.5px;
        }
        .ppl-left-title span { color: #F0D264; display: block; }
        .ppl-accent-line {
          width: 44px; height: 3px;
          background: linear-gradient(90deg, #F0D264, transparent);
          border-radius: 2px;
          margin-bottom: 22px;
        }
        .ppl-stats { display: flex; gap: 32px; }
        .ppl-stat-num {
          font-size: 24px; font-weight: 900;
          color: #F0D264; line-height: 1;
          margin-bottom: 3px;
        }
        .ppl-stat-lbl {
          font-size: 11px; color: rgba(255,255,255,0.55);
          font-weight: 500; letter-spacing: .4px;
        }

        /* ── RIGHT PANEL ── */
        .ppl-right {
          flex: 1;
          background: #f7f8fa;
          display: flex;
          flex-direction: column;
        }

        .ppl-topbar {
          padding: 18px 44px;
          display: flex;
          align-items: center;
        }
        .ppl-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 700; color: #374151;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          transition: border-color .18s, color .18s, box-shadow .18s;
        }
        .ppl-back-btn:hover {
          border-color: #1d4ed8;
          color: #1e40af;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        }
        .ppl-back-btn i { font-size: 11px; }

        .ppl-form-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 44px 48px;
        }
        .ppl-form-wrap { width: 100%; max-width: 400px; }

        .ppl-card {
          background: #fff;
          border-radius: 20px;
          padding: 40px 38px 36px;
          box-shadow: 0 2px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04);
        }

        .ppl-portal-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eff6ff;
          border: 1.5px solid #1d4ed8;
          color: #1d4ed8;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .6px; text-transform: uppercase;
          margin-bottom: 14px;
        }
        .ppl-portal-tag i { font-size: 10px; }

        .ppl-card-title {
          font-size: 24px; font-weight: 900;
          color: #0d0d0d; margin-bottom: 4px;
        }
        .ppl-card-sub {
          font-size: 13px; color: #6b7280;
          margin-bottom: 28px;
        }

        /* form fields */
        .ppl-field { margin-bottom: 16px; }
        .ppl-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 800;
          color: #6b7280; text-transform: uppercase;
          letter-spacing: .8px; margin-bottom: 7px;
        }
        .ppl-label i { font-size: 10px; color: #1d4ed8; }
        .ppl-input-box { position: relative; }
        .ppl-input {
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
        .ppl-input:focus {
          border-color: #1d4ed8;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(29,78,216,0.10);
        }
        .ppl-input::placeholder { color: #c5c9d3; font-size: 13px; }
        .ppl-eye-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; padding: 0;
          color: #c5c9d3; font-size: 14px;
          transition: color .15s;
          display: flex; align-items: center;
        }
        .ppl-eye-btn:hover { color: #6b7280; }

        .ppl-row {
          display: flex; align-items: center;
          justify-content: space-between;
          margin: 14px 0 22px;
        }
        .ppl-remember {
          display: flex; align-items: center; gap: 7px;
          font-size: 13px; color: #6b7280;
          cursor: pointer; user-select: none;
        }
        .ppl-remember input[type="checkbox"] {
          width: 15px; height: 15px;
          accent-color: #1d4ed8; cursor: pointer;
        }
        .ppl-forgot {
          font-size: 12px; font-weight: 700;
          color: #1d4ed8; text-decoration: none;
          letter-spacing: .2px;
        }
        .ppl-forgot:hover { color: #1e40af; text-decoration: underline; }

        .ppl-submit {
          width: 100%;
          padding: 13px 20px;
          background: #001D3D;
          color: #fff;
          font-size: 14px; font-weight: 800;
          letter-spacing: .5px;
          border: none; border-radius: 9px;
          cursor: pointer;
          display: flex; align-items: center;
          justify-content: center; gap: 9px;
          transition: background .2s, transform .12s, box-shadow .2s;
          box-shadow: 0 4px 14px rgba(0,29,61,0.18);
        }
        .ppl-submit:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(29,78,216,0.28);
        }
        .ppl-submit:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 3px 10px rgba(0,29,61,0.18);
        }
        .ppl-submit:disabled { opacity: .65; cursor: not-allowed; }

        .ppl-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: ppl-spin .7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes ppl-spin { to { transform: rotate(360deg); } }

        /* divider */
        .ppl-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 22px 0 20px;
        }
        .ppl-div-line { flex: 1; height: 1px; background: #f0f0f0; }
        .ppl-divider span {
          font-size: 10px; font-weight: 800; color: #c9cdd4;
          letter-spacing: 1.2px; white-space: nowrap;
        }

        /* other portals */
        .ppl-portal-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .ppl-chip {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 12px; font-weight: 700;
          text-decoration: none;
          transition: transform .15s, box-shadow .15s;
        }
        .ppl-chip:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .ppl-chip.student {
          background: #fffbeb;
          border: 1.5px solid #d4a800;
          color: #7a6100;
        }
        .ppl-chip.admin {
          background: #f0f4ff;
          border: 1.5px solid #4f46e5;
          color: #4338ca;
        }

        .ppl-footer-row {
          text-align: center;
          font-size: 13px; color: #6b7280;
          margin-top: 18px;
        }
        .ppl-footer-row a {
          color: #1d4ed8; font-weight: 700; text-decoration: none;
        }
        .ppl-footer-row a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .ppl-left { display: none; }
          .ppl-form-area { padding: 0 20px 40px; }
          .ppl-topbar { padding: 16px 20px; }
          .ppl-card { padding: 28px 22px 24px; }
        }
      `}</style>

      <div className="ppl-page">

        {/* ── LEFT PANEL ── */}
        <div className="ppl-left" style={{ backgroundImage: "url('/cute-black-hair-child-female-daughter-homework-laugh-together-with-parent-living-room-house-concept.avif')", backgroundSize: "cover", backgroundPosition: "center top", position: "relative", overflow: "hidden" }}>
          <div className="ppl-left-overlay" />

          <div className="ppl-left-top">
            <div className="ppl-logo" style={{ width: 80, height: 80, position: "relative" }}>
              <Image src="/Logo.png" alt="East Asian Logo" fill style={{ objectFit: "contain" }} />
            </div>
          </div>

          <div className="ppl-left-bottom">
            <div className="ppl-badge">
              <i className="fas fa-award" style={{ fontSize: 10 }} />
              Est. 2005 &nbsp;·&nbsp; Accredited
            </div>
            <h2 className="ppl-left-title">
              East Asian
              <span>International</span>
              School
            </h2>
            <div className="ppl-accent-line" />
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="ppl-right">

          <div className="ppl-topbar">
            <Link href="/" className="ppl-back-btn">
              <i className="fas fa-arrow-left" />
              Back to Home
            </Link>
          </div>

          <div className="ppl-form-area">
            <div className="ppl-form-wrap">
              <div className="ppl-card">

                <div className="ppl-portal-tag">
                  <i className="fas fa-users" />
                  Parent Portal
                </div>
                <h2 className="ppl-card-title">Welcome, Parent!</h2>
                <p className="ppl-card-sub">Sign in to monitor your child&apos;s progress</p>

                <form onSubmit={handleSubmit} autoComplete="off">

                  <div className="ppl-field">
                    <label className="ppl-label">
                      <i className="fas fa-user" />
                      Username
                    </label>
                    <div className="ppl-input-box">
                      <input
                        className="ppl-input"
                        type="text"
                        placeholder="Enter your parent username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="ppl-field">
                    <label className="ppl-label">
                      <i className="fas fa-lock" />
                      Password
                    </label>
                    <div className="ppl-input-box">
                      <input
                        className="ppl-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="ppl-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"} />
                      </button>
                    </div>
                  </div>

                  <div className="ppl-row">
                    <label className="ppl-remember">
                      <input type="checkbox" />
                      Remember Me
                    </label>
                    <a href="#" className="ppl-forgot">Forgot Password?</a>
                  </div>

                  <button type="submit" className="ppl-submit" disabled={loading}>
                    {loading ? (
                      <><span className="ppl-spinner" /> Signing in...</>
                    ) : (
                      <>Sign In <i className="fas fa-arrow-right" style={{ fontSize: 11 }} /></>
                    )}
                  </button>

                </form>

                <div className="ppl-divider">
                  <div className="ppl-div-line" />
                  <span>OTHER PORTALS</span>
                  <div className="ppl-div-line" />
                </div>

                <div className="ppl-portal-row" style={{ gridTemplateColumns: "1fr" }}>
                  <Link href="/student-portal/login" className="ppl-chip student">
                    <i className="fas fa-graduation-cap" />
                    Student Portal
                  </Link>
                </div>

              </div>

              <p className="ppl-footer-row">
                Need help?{" "}
                <Link href="/contact">Contact Support</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
