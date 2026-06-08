"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const LoginForm = () => {
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
    <>
      <style>{`
        .lf-field { margin-bottom: 16px; }

        .lf-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 800;
          color: #6b7280; text-transform: uppercase;
          letter-spacing: .8px; margin-bottom: 7px;
        }
        .lf-label i { font-size: 10px; color: #CCAA00; }

        .lf-input-box { position: relative; }

        .lf-input {
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
        .lf-input:focus {
          border-color: #CCAA00;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(204,170,0,0.10);
        }
        .lf-input::placeholder { color: #c5c9d3; font-size: 13px; }

        .lf-eye-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; padding: 0;
          color: #c5c9d3; font-size: 14px;
          transition: color .15s;
          display: flex; align-items: center;
        }
        .lf-eye-btn:hover { color: #6b7280; }

        .lf-row {
          display: flex; align-items: center;
          justify-content: space-between;
          margin: 14px 0 22px;
        }
        .lf-remember {
          display: flex; align-items: center; gap: 7px;
          font-size: 13px; color: #6b7280;
          cursor: pointer; user-select: none;
        }
        .lf-remember input[type="checkbox"] {
          width: 15px; height: 15px;
          accent-color: #CCAA00; cursor: pointer;
          border-radius: 4px;
        }
        .lf-forgot {
          font-size: 12px; font-weight: 700;
          color: #CCAA00; text-decoration: none;
          letter-spacing: .2px;
        }
        .lf-forgot:hover { color: #92700a; text-decoration: underline; }

        .lf-submit {
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
        .lf-submit:hover:not(:disabled) {
          background: #003B69;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,29,61,0.22);
        }
        .lf-submit:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 3px 10px rgba(0,29,61,0.18);
        }
        .lf-submit:disabled { opacity: .65; cursor: not-allowed; }

        .lf-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(240,210,100,0.3);
          border-top-color: #F0D264;
          border-radius: 50%;
          animation: lf-spin .7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes lf-spin { to { transform: rotate(360deg); } }
      `}</style>

      <form onSubmit={handleFormSubmit} autoComplete="off">

        {/* Username */}
        <div className="lf-field">
          <label className="lf-label">
            <i className="fas fa-user" />
            Username
          </label>
          <div className="lf-input-box">
            <input
              className="lf-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
        </div>

        {/* Password */}
        <div className="lf-field">
          <label className="lf-label">
            <i className="fas fa-lock" />
            Password
          </label>
          <div className="lf-input-box">
            <input
              className="lf-input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="lf-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"} />
            </button>
          </div>
        </div>

        {/* Remember / Forgot */}
        <div className="lf-row">
          <label className="lf-remember">
            <input type="checkbox" />
            Remember Me
          </label>
          <a href="#" className="lf-forgot">Forgot Password?</a>
        </div>

        {/* Submit */}
        <button type="submit" className="lf-submit" disabled={loading}>
          {loading ? (
            <><span className="lf-spinner" /> Signing in...</>
          ) : (
            <>Sign In <i className="fas fa-arrow-right" style={{ fontSize: 11 }} /></>
          )}
        </button>

      </form>
    </>
  );
};

export default LoginForm;
