"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const LoginSection = () => {
  return (
    <>
      <style suppressHydrationWarning>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        /* ─── LAYOUT ─── */
        .sl-page {
          min-height: 100vh;
          display: flex;
        }

        /* ─── LEFT PANEL ─── */
        .sl-left {
          width: 42%;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 32px 40px 44px;
        }
        .sl-left-overlay {
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


        /* top bar inside left panel */
        .sl-left-top {
          position: relative; z-index: 2;
          display: flex; align-items: center; gap: 10px;
        }
        .sl-left-logomark {
          width: 80px; height: 80px;
          flex-shrink: 0;
          position: relative;
        }
        .sl-left-logoname {
          font-size: 12px; font-weight: 700;
          color: rgba(255,255,255,0.65);
          letter-spacing: .3px;
        }

        /* center image */
        .sl-left-img {
          position: absolute;
          inset: 0; z-index: 1;
        }
        .sl-img-glow {
          position: relative; width: 100%; height: 100%;
        }

        /* bottom content */
        .sl-left-bottom {
          position: relative; z-index: 2;
        }
        .sl-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(212,168,0,0.12);
          border: 1px solid rgba(212,168,0,0.3);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 10px; font-weight: 700;
          color: #F0D264;
          letter-spacing: .8px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .sl-left-title {
          font-size: 34px; font-weight: 900;
          color: #fff; line-height: 1.12;
          letter-spacing: -.4px;
          margin-bottom: 14px;
        }
        .sl-left-title span { color: #F0D264; display: block; }
        .sl-left-rule {
          width: 36px; height: 2px;
          background: linear-gradient(90deg, #F0D264, transparent);
          border-radius: 2px;
          margin-bottom: 20px;
        }
        .sl-stats {
          display: flex; gap: 28px;
        }
        .sl-stat-num {
          font-size: 22px; font-weight: 900;
          color: #F0D264; line-height: 1;
          margin-bottom: 2px;
        }
        .sl-stat-lbl {
          font-size: 10px; font-weight: 600;
          color: rgba(255,255,255,0.45);
          letter-spacing: .6px;
          text-transform: uppercase;
        }

        /* ─── RIGHT PANEL ─── */
        .sl-right {
          flex: 1;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          border-left: 1px solid rgba(0,0,0,0.06);
        }

        /* topbar */
        .sl-topbar {
          padding: 22px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f3f4f6;
        }
        .sl-back-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 13px; font-weight: 600;
          color: #6b7280;
          text-decoration: none;
          transition: color .15s;
        }
        .sl-back-btn:hover { color: #111827; }
        .sl-back-btn i { font-size: 11px; }

        .sl-topbar-brand {
          display: none;
          align-items: center;
          gap: 8px;
        }
        .sl-topbar-brand-img {
          width: 32px; height: 32px;
          position: relative;
          flex-shrink: 0;
        }
        .sl-topbar-brand-name {
          font-size: 13px; font-weight: 700;
          color: #374151;
        }

        /* form area */
        .sl-form-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 48px 60px;
        }
        .sl-form-wrap {
          width: 100%;
          max-width: 400px;
        }

        /* heading */
        .sl-heading {
          margin-bottom: 32px;
        }
        .sl-heading h2 {
          font-size: 26px; font-weight: 900;
          color: #0f172a;
          letter-spacing: -.4px;
          margin-bottom: 4px;
        }
        .sl-heading p {
          font-size: 14px;
          color: #94a3b8;
        }

        /* portal items */
        .sl-portal-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }

        .sl-portal-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 12px;
          text-decoration: none;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-left-width: 4px;
          transition: background .16s, border-color .16s, box-shadow .16s, transform .16s;
          position: relative;
        }
        .sl-portal-item:hover {
          transform: translateX(2px);
          box-shadow: 0 4px 18px rgba(0,0,0,0.07);
        }

        .sl-portal-item.student {
          border-left-color: #d4a800;
        }
        .sl-portal-item.student:hover {
          background: #fffdf0;
          border-color: #d4a800;
          border-left-color: #d4a800;
        }

        .sl-portal-item.parent {
          border-left-color: #2563eb;
        }
        .sl-portal-item.parent:hover {
          background: #f0f5ff;
          border-color: #2563eb;
          border-left-color: #2563eb;
        }

        /* icon box */
        .sl-item-icon {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .sl-portal-item.student .sl-item-icon {
          background: #fef9c3;
          color: #a16207;
        }
        .sl-portal-item.parent .sl-item-icon {
          background: #dbeafe;
          color: #1d4ed8;
        }

        /* text */
        .sl-item-body { flex: 1; min-width: 0; }
        .sl-item-title {
          font-size: 15px; font-weight: 700;
          color: #0f172a;
          margin-bottom: 2px;
        }
        .sl-item-desc {
          font-size: 12px;
          color: #94a3b8;
        }

        /* arrow */
        .sl-item-arrow {
          width: 30px; height: 30px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
          transition: transform .16s;
        }
        .sl-portal-item:hover .sl-item-arrow { transform: translateX(3px); }

        .sl-portal-item.student .sl-item-arrow {
          background: #fef9c3;
          color: #a16207;
        }
        .sl-portal-item.parent .sl-item-arrow {
          background: #dbeafe;
          color: #1d4ed8;
        }

        /* divider */
        .sl-divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
        }
        .sl-divider-line {
          flex: 1; height: 1px;
          background: #f1f5f9;
        }
        .sl-divider-text {
          font-size: 11px; font-weight: 600;
          color: #cbd5e1;
          letter-spacing: .5px;
        }

        /* secure row */
        .sl-secure {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          font-size: 11.5px; color: #94a3b8;
          font-weight: 500;
        }
        .sl-secure-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
        }

        /* footer */
        .sl-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: #94a3b8;
        }
        .sl-footer a {
          color: #64748b; font-weight: 600;
          text-decoration: none;
        }
        .sl-footer a:hover { color: #0f172a; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 768px) {
          .sl-left { display: none; }
          .sl-right { border-left: none; }
          .sl-topbar { padding: 16px 20px; }
          .sl-topbar-brand { display: flex; }
          .sl-form-area { padding: 0 20px 48px; }
        }
      `}</style>

      <div className="sl-page">

        {/* ── LEFT PANEL ── */}
        <div className="sl-left" style={{ backgroundImage: "url('/front-view-male-student-green-checkered-shirt-wearing-black-backpack-holding-copybook-reading-blue-wall.avif')", backgroundSize: "cover", backgroundPosition: "center top" }}>

          <div className="sl-left-top">
            <div className="sl-left-logomark">
              <Image src="/Logo.png" alt="East Asian Logo" fill style={{ objectFit: "contain" }} />
            </div>
          </div>

          <div className="sl-left-overlay" />

          <div className="sl-left-bottom">
            <div className="sl-badge">
              <i className="fas fa-award" style={{ fontSize: 9 }} />
              Est. 2005 &nbsp;·&nbsp; Accredited
            </div>
            <h2 className="sl-left-title">
              East Asian
              <span>International</span>
              School
            </h2>
            <div className="sl-left-rule" />
          </div>

        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="sl-right">

          <div className="sl-topbar">
            <Link href="/" className="sl-back-btn">
              <i className="fas fa-arrow-left" />
              Back to Home
            </Link>
            <div className="sl-topbar-brand">
              <div className="sl-topbar-brand-img">
                <Image src="/Logo.png" alt="East Asian Logo" fill style={{ objectFit: "contain" }} />
              </div>
              <span className="sl-topbar-brand-name">East Asian International</span>
            </div>
          </div>

          <div className="sl-form-area">
            <div className="sl-form-wrap">

              <div className="sl-heading">
                <h2>Welcome back</h2>
                <p>Select your portal to continue</p>
              </div>

              <div className="sl-portal-list">

                <Link href="/student-portal/login" className="sl-portal-item student">
                  <div className="sl-item-icon">
                    <i className="fas fa-graduation-cap" />
                  </div>
                  <div className="sl-item-body">
                    <div className="sl-item-title">Student Portal</div>
                    <div className="sl-item-desc">Grades, assignments &amp; schedule</div>
                  </div>
                  <div className="sl-item-arrow">
                    <i className="fas fa-arrow-right" />
                  </div>
                </Link>

                <Link href="/parent-portal/login" className="sl-portal-item parent">
                  <div className="sl-item-icon">
                    <i className="fas fa-users" />
                  </div>
                  <div className="sl-item-body">
                    <div className="sl-item-title">Parent Portal</div>
                    <div className="sl-item-desc">Progress, attendance &amp; reports</div>
                  </div>
                  <div className="sl-item-arrow">
                    <i className="fas fa-arrow-right" />
                  </div>
                </Link>

              </div>

              <div className="sl-divider">
                <div className="sl-divider-line" />
                <span className="sl-divider-text">SECURE LOGIN</span>
                <div className="sl-divider-line" />
              </div>

              <div className="sl-secure">
                <span className="sl-secure-dot" />
                256-bit SSL encrypted connection
              </div>

              <div className="sl-footer">
                Need help? <Link href="/contact">Contact Support</Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default LoginSection;
