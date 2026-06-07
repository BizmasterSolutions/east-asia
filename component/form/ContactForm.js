"use client";
import { useEduorContext } from "@/context/EduorContext";
import React, { useState } from "react";
import { toast } from "react-toastify";

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.08)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  borderRadius: "10px",
  padding: "14px 18px 14px 46px",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
  marginBottom: "18px",
  boxSizing: "border-box",
};

const wrapStyle = {
  position: "relative",
  width: "100%",
};

const iconStyle = {
  position: "absolute",
  left: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#F0D264",
  fontSize: "15px",
  pointerEvents: "none",
};

const ContactForm = () => {
  const { isValidEmail } = useEduorContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill out all required fields.", { position: "top-right" });
    } else if (!isValidEmail(email)) {
      toast.warning("Please provide a valid email address.", { position: "top-right" });
    } else {
      toast.success("Message sent successfully! We'll get back to you shortly.", { position: "top-right" });
      setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="row g-3">
        {/* Name */}
        <div className="col-xl-6 col-md-6">
          <div style={wrapStyle}>
            <i className="fal fa-user" style={iconStyle}></i>
            <input
              type="text"
              placeholder="Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Email */}
        <div className="col-xl-6 col-md-6">
          <div style={wrapStyle}>
            <i className="fal fa-envelope" style={iconStyle}></i>
            <input
              type="email"
              placeholder="Email Address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="col-xl-6 col-md-6">
          <div style={wrapStyle}>
            <i className="fal fa-phone" style={iconStyle}></i>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Subject */}
        <div className="col-xl-6 col-md-6">
          <div style={wrapStyle}>
            <i className="fal fa-tag" style={iconStyle}></i>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Message */}
        <div className="col-xl-12">
          <div style={{ position: "relative" }}>
            <i className="fal fa-comment-alt" style={{ ...iconStyle, top: "20px", transform: "none" }}></i>
            <textarea
              rows={6}
              placeholder="Your Message *"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ ...inputStyle, padding: "14px 18px 14px 46px", resize: "vertical" }}
            ></textarea>
          </div>
        </div>

        {/* Submit */}
        <div className="col-xl-12">
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              background: "#F0D264",
              color: "#003B69",
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "16px",
              letterSpacing: "0.5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "opacity 0.2s",
            }}
          >
            <i className="fal fa-paper-plane"></i>
            Send Message
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
