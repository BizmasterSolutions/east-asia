"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const LoginSection = () => {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .sl-page {
          min-height: 100vh;
          display: flex;
        }

        /* ── LEFT PANEL ── */
        .sl-left {
          width: 44%;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 44px 48px;
          background:
            radial-gradient(ellipse at 50% 60%, rgba(30,90,220,0.45) 0%, transparent 55%),
            radial-gradient(ellipse at 15% 20%, rgba(20,60,160,0.35) 0%, transparent 45%),
            radial-gradient(ellipse at 85% 10%, rgba(10,30,100,0.25) 0%, transparent 40%),
            linear-gradient(175deg, #0c1e52 0%, #06122e 50%, #020a1e 100%);
        }

        .sl-left::before {
          content: "";
          position: absolute; inset: 0; z-index: 0;
          background-image: radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        .sl-left::after {
          content: "";
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
          height: 48%;
          background: linear-gradient(
            to top,
            rgba(2,10,30,1.0) 0%,
            rgba(2,10,30,0.96) 25%,
            rgba(2,10,30,0.70) 55%,
            transparent 100%
          );
          pointer-events: none;
        }

        .sl-left-center {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 1;
        }
        .sl-crest-glow {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .sl-crest-glow::before {
          content: "";
          position: absolute;
          bottom: 15%; left: 50%;
          transform: translateX(-50%);
          width: 85%; height: 65%;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(60,110,255,0.22) 0%,
            rgba(30,60,180,0.10) 50%,
            transparent 72%);
          pointer-events: none;
          z-index: 0;
        }

        .sl-left-bottom { position: relative; z-index: 3; }
        .sl-badge {
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
        .sl-left-title {
          font-size: 38px; font-weight: 900;
          color: #fff; line-height: 1.12;
          margin-bottom: 16px;
          letter-spacing: -.5px;
        }
        .sl-left-title span { color: #F0D264; display: block; }
        .sl-accent-line {
          width: 44px; height: 3px;
          background: linear-gradient(90deg, #F0D264, transparent);
          border-radius: 2px;
          margin-bottom: 22px;
        }
        .sl-stats { display: flex; gap: 32px; }
        .sl-stat-num {
          font-size: 24px; font-weight: 900;
          color: #F0D264; line-height: 1;
          margin-bottom: 3px;
        }
        .sl-stat-lbl {
          font-size: 11px; color: rgba(255,255,255,0.55);
          font-weight: 500; letter-spacing: .4px;
        }

        /* ── RIGHT PANEL ── */
        .sl-right {
          flex: 1;
          background: #f7f8fa;
          display: flex;
          flex-direction: column;
        }

        .sl-topbar {
          padding: 18px 44px;
          display: flex;
          align-items: center;
        }
        .sl-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 700; color: #374151;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          transition: border-color .18s, color .18s, box-shadow .18s;
        }
        .sl-back-btn:hover {
          border-color: #CCAA00;
          color: #92700a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        }
        .sl-back-btn i { font-size: 11px; }

        /* portal selection area */
        .sl-form-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 44px 48px;
        }
        .sl-form-wrap { width: 100%; max-width: 420px; }

        .sl-card {
          background: #fff;
          border-radius: 20px;
          padding: 40px 38px 36px;
          box-shadow: 0 2px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04);
        }

        .sl-card-title {
          font-size: 24px; font-weight: 900;
          color: #0d0d0d; margin-bottom: 4px;
        }
        .sl-card-sub {
          font-size: 13px; color: #6b7280;
          margin-bottom: 32px;
        }

        /* portal cards */
        .sl-portal-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sl-portal-card {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 20px 22px;
          border-radius: 14px;
          text-decoration: none;
          border: 1.5px solid transparent;
          transition: transform .15s, box-shadow .18s, border-color .18s;
          position: relative;
          overflow: hidden;
        }
        .sl-portal-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.10);
        }
        .sl-portal-card::after {
          content: "";
          position: absolute; right: 22px; top: 50%;
          transform: translateY(-50%);
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        .sl-portal-card.student {
          background: #fffbeb;
          border-color: #d4a800;
        }
        .sl-portal-card.student:hover { border-color: #b38f00; }

        .sl-portal-card.parent {
          background: #eff6ff;
          border-color: #1d4ed8;
        }
        .sl-portal-card.parent:hover { border-color: #1e40af; }

        .sl-pcard-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .sl-portal-card.student .sl-pcard-icon {
          background: rgba(212,168,0,0.15);
          color: #a07800;
        }
        .sl-portal-card.parent .sl-pcard-icon {
          background: rgba(29,78,216,0.12);
          color: #1d4ed8;
        }

        .sl-pcard-body { flex: 1; }
        .sl-pcard-title {
          font-size: 15px; font-weight: 800;
          margin-bottom: 2px;
        }
        .sl-portal-card.student .sl-pcard-title { color: #7a6100; }
        .sl-portal-card.parent .sl-pcard-title { color: #1d4ed8; }

        .sl-pcard-desc {
          font-size: 12px; color: #9ca3af;
          font-weight: 500;
        }

        .sl-pcard-arrow {
          font-size: 13px;
          opacity: 0.5;
          flex-shrink: 0;
        }
        .sl-portal-card.student .sl-pcard-arrow { color: #7a6100; }
        .sl-portal-card.parent .sl-pcard-arrow { color: #1d4ed8; }
        .sl-portal-card:hover .sl-pcard-arrow { opacity: 1; }

        .sl-footer-row {
          text-align: center;
          font-size: 13px; color: #6b7280;
          margin-top: 24px;
        }
        .sl-footer-row a {
          color: #CCAA00; font-weight: 700; text-decoration: none;
        }
        .sl-footer-row a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .sl-left { display: none; }
          .sl-form-area { padding: 0 20px 40px; }
          .sl-topbar { padding: 16px 20px; }
          .sl-card { padding: 28px 22px 24px; }
        }
      `}</style>

      <div className="sl-page">

        {/* ── LEFT PANEL ── */}
        <div className="sl-left">
          <div className="sl-left-center">
            <div className="sl-crest-glow">
              <Image
                src="/Untitled design (3).png"
                alt="East Asian Student"
                fill
                sizes="44vw"
                style={{
                  objectFit: "contain",
                  objectPosition: "center 85%",
                  filter: "drop-shadow(0 10px 40px rgba(10,40,140,0.45))",
                  zIndex: 1,
                }}
                priority
              />
            </div>
          </div>

          <div className="sl-left-bottom">
            <div className="sl-badge">
              <i className="fas fa-award" style={{ fontSize: 10 }} />
              Est. 2005 &nbsp;·&nbsp; Accredited
            </div>
            <h2 className="sl-left-title">
              East Asian
              <span>International</span>
              School
            </h2>
            <div className="sl-accent-line" />
            <div className="sl-stats">
              <div>
                <div className="sl-stat-num">2,400+</div>
                <div className="sl-stat-lbl">Students</div>
              </div>
              <div>
                <div className="sl-stat-num">180+</div>
                <div className="sl-stat-lbl">Faculty</div>
              </div>
              <div>
                <div className="sl-stat-num">50+</div>
                <div className="sl-stat-lbl">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="sl-right">

          <div className="sl-topbar">
            <Link href="/" className="sl-back-btn">
              <i className="fas fa-arrow-left" />
              Back to Home
            </Link>
          </div>

          <div className="sl-form-area">
            <div className="sl-form-wrap">
              <div className="sl-card">

                <h2 className="sl-card-title">Portal Access</h2>
                <p className="sl-card-sub">Select your portal to sign in</p>

                <div className="sl-portal-list">

                  <Link href="/student-portal/login" className="sl-portal-card student">
                    <div className="sl-pcard-icon">
                      <i className="fas fa-graduation-cap" />
                    </div>
                    <div className="sl-pcard-body">
                      <div className="sl-pcard-title">Student Portal</div>
                      <div className="sl-pcard-desc">Access grades, assignments &amp; schedule</div>
                    </div>
                    <i className="fas fa-arrow-right sl-pcard-arrow" />
                  </Link>

                  <Link href="/parent-portal/login" className="sl-portal-card parent">
                    <div className="sl-pcard-icon">
                      <i className="fas fa-users" />
                    </div>
                    <div className="sl-pcard-body">
                      <div className="sl-pcard-title">Parent Portal</div>
                      <div className="sl-pcard-desc">Monitor your child&apos;s progress &amp; attendance</div>
                    </div>
                    <i className="fas fa-arrow-right sl-pcard-arrow" />
                  </Link>

                </div>

              </div>

              <p className="sl-footer-row">
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

export default LoginSection;
