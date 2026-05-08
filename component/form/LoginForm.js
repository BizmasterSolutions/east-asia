"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <form onSubmit={handleFormSubmit}>
      <div className="row">
        <div className="col-xl-12">
          <div className="tf__login_imput">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="col-xl-12">
          <div className="tf__login_imput">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="col-xl-12">
          <div className="tf__login_imput tf__login_check_area">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Remember Me
              </label>
            </div>
            <a href="#">Forgot Password?</a>
          </div>
        </div>
        <div className="col-xl-12">
          <div className="tf__login_imput">
            <button type="submit" className="common_btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
