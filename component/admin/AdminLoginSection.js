"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const CHECKLIST = [
  { n: "01", label: "Homepage & content publishing" },
  { n: "02", label: "Gallery and media management" },
  { n: "03", label: "Student and parent records" },
];

const AdminLoginSection = () => {
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
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid credentials.", { position: "top-right" });
        return;
      }

      toast.success("Welcome, Admin!", { position: "top-right" });
      window.location.href = "/admin/dashboard";
    } catch {
      toast.error("Something went wrong. Please try again.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ea-login">
      <style jsx>{`
        .ea-login {
          min-height: 100vh;
          background: #000814;
          background-image: radial-gradient(rgba(240, 210, 100, 0.09) 1px, transparent 1px);
          background-size: 24px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
        }

        .ea-login-frame {
          width: 100%;
          max-width: 940px;
        }

        .ea-login-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 22px;
          background: #f0d264;
          border-radius: 6px 6px 0 0;
        }

        .ea-login-topbar span {
          font-family: var(--headingFont);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: #001d3d;
        }

        .ea-login-topbar span.dim {
          color: #4a3f1a;
          font-weight: 700;
        }

        .ea-login-panel {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          background: #ffffff;
          border-radius: 0 0 8px 8px;
          box-shadow: 10px 10px 0 rgba(240, 210, 100, 0.16);
          overflow: hidden;
        }

        .ea-login-aside {
          position: relative;
          background: #001d3d;
          color: #f8fafc;
          padding: 44px 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .ea-login-aside::after {
          content: "";
          position: absolute;
          right: -50px;
          bottom: -50px;
          width: 320px;
          height: 320px;
          background-image: url("/Logo%20mod.png");
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.07;
          pointer-events: none;
        }

        .ea-login-logo {
          width: 48px !important;
          height: 48px !important;
          object-fit: contain !important;
          position: relative;
          z-index: 1;
        }

        .ea-login-rule {
          width: 34px;
          height: 3px;
          background: #f0d264;
          margin: 22px 0 16px;
          position: relative;
          z-index: 1;
        }

        .ea-login-aside h1 {
          position: relative;
          z-index: 1;
          margin: 0;
          font-family: var(--headingFont);
          font-size: 28px;
          font-weight: 800;
          line-height: 1.25;
          color: #ffffff;
        }

        .ea-login-aside p {
          position: relative;
          z-index: 1;
          margin: 12px 0 0;
          font-family: var(--paraFont);
          font-size: 14px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.68);
          max-width: 280px;
        }

        .ea-login-checklist {
          position: relative;
          z-index: 1;
          margin: 30px 0 0;
          padding: 20px 0 0;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          list-style: none;
          display: grid;
          gap: 13px;
        }

        .ea-login-checklist li {
          display: flex;
          align-items: baseline;
          gap: 10px;
          font-family: var(--paraFont);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.82);
        }

        .ea-login-checklist b {
          font-family: var(--headingFont);
          font-size: 11px;
          font-weight: 800;
          color: #f0d264;
        }

        .ea-login-ref {
          position: relative;
          z-index: 1;
          margin-top: 28px;
          font-family: var(--paraFont);
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }

        .ea-login-form-side {
          padding: 44px 42px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .ea-login-eyebrow {
          font-family: var(--headingFont);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: #cc0000;
        }

        .ea-login-form-side h2 {
          margin: 8px 0 0;
          font-family: var(--headingFont);
          font-size: 26px;
          font-weight: 800;
          color: #001d3d;
        }

        .ea-login-form-side > p {
          margin: 8px 0 26px;
          font-family: var(--paraFont);
          font-size: 13.5px;
          color: #5b6473;
        }

        .ea-field {
          margin-bottom: 22px;
        }

        .ea-field label {
          display: block;
          font-family: var(--headingFont);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #001d3d;
          margin-bottom: 8px;
        }

        .ea-field-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .ea-field-box input {
          width: 100%;
          border: none;
          border-bottom: 2px solid #d8dde5;
          background: transparent;
          padding: 8px 30px 8px 2px;
          font-family: var(--paraFont);
          font-size: 15px;
          color: #001d3d;
          outline: none;
          transition: border-color 0.2s;
        }

        .ea-field-box input:focus {
          border-color: #f0d264;
        }

        .ea-field-box input::placeholder {
          color: #aab2bf;
        }

        .ea-field-toggle {
          position: absolute;
          right: 0;
          border: none;
          background: transparent;
          font-family: var(--headingFont);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          color: #7a8494;
          cursor: pointer;
          padding: 4px;
        }

        .ea-field-toggle:hover {
          color: #001d3d;
        }

        .ea-login-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 4px 0 26px;
        }

        .ea-login-note {
          margin: 0;
          font-family: var(--paraFont);
          font-size: 11.5px;
          color: #8994a3;
        }

        .ea-login-link {
          font-family: var(--paraFont);
          font-size: 12px;
          font-weight: 600;
          color: #001d3d;
          text-decoration: none;
          border-bottom: 1px solid #f0d264;
          padding-bottom: 1px;
        }

        .ea-submit {
          width: 100%;
          height: 50px;
          border: 2px solid #001d3d;
          border-radius: 4px;
          background: #001d3d;
          color: #f0d264;
          font-family: var(--headingFont);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }

        .ea-submit:hover:not(:disabled) {
          background: #f0d264;
          color: #001d3d;
        }

        .ea-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ea-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(240, 210, 100, 0.4);
          border-top-color: #f0d264;
          border-radius: 50%;
          animation: ea-spin 0.65s linear infinite;
          flex-shrink: 0;
        }

        .ea-submit:hover:not(:disabled) .ea-spinner {
          border-color: rgba(0, 29, 61, 0.35);
          border-top-color: #001d3d;
        }

        @keyframes ea-spin {
          to { transform: rotate(360deg); }
        }

        .ea-login-foot {
          margin-top: 24px;
          font-family: var(--paraFont);
          font-size: 11px;
          color: #aab2bf;
        }

        @media (max-width: 900px) {
          .ea-login-panel {
            grid-template-columns: 1fr;
          }

          .ea-login-aside {
            padding: 32px 28px;
          }

          .ea-login-form-side {
            padding: 34px 28px;
          }
        }

        @media (max-width: 480px) {
          .ea-login-topbar {
            flex-direction: column;
            gap: 4px;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="ea-login-frame">
        <div className="ea-login-topbar">
          <span>East Asian International School</span>
          <span className="dim">Staff Systems Access</span>
        </div>

        <div className="ea-login-panel">
          <aside className="ea-login-aside">
            <div>
              <img className="ea-login-logo" src="/Logo%20mod.png" alt="East Asian International School" />
              <div className="ea-login-rule" />
              <h1>Administrator Console</h1>
              <p>Sign in to manage the school&apos;s website content and records.</p>
            </div>

            <div>
              <ul className="ea-login-checklist">
                {CHECKLIST.map((item) => (
                  <li key={item.n}>
                    <b>{item.n}</b> {item.label}
                  </li>
                ))}
              </ul>
              <div className="ea-login-ref">Portal Ref &middot; EAIS / ADMIN</div>
            </div>
          </aside>

          <div className="ea-login-form-side">
            <span className="ea-login-eyebrow">Restricted Access</span>
            <h2>Sign in</h2>
            <p>Enter your administrator credentials to continue.</p>

            <form onSubmit={handleSubmit} autoComplete="on">
              <div className="ea-field">
                <label htmlFor="ea-username">Username</label>
                <div className="ea-field-box">
                  <input
                    id="ea-username"
                    type="text"
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="ea-field">
                <label htmlFor="ea-password">Password</label>
                <div className="ea-field-box">
                  <input
                    id="ea-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="ea-field-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              <div className="ea-login-actions">
                <p className="ea-login-note">Authorized staff only.</p>
                <a className="ea-login-link" href="/">Back to website</a>
              </div>

              <button type="submit" className="ea-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="ea-spinner" /> Signing in
                  </>
                ) : (
                  <>
                    Sign in <i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
                  </>
                )}
              </button>
            </form>

            <p className="ea-login-foot">&copy; {new Date().getFullYear()} East Asian International School. All rights reserved.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginSection;
