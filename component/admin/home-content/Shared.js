"use client";
import { useState } from "react";

export const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box",
  fontFamily: "sans-serif",
};

export const btnPrimary = {
  padding: "9px 24px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
};

export const btnDanger = {
  padding: "6px 14px",
  background: "#fee2e2",
  color: "#dc2626",
  border: "1px solid #fecaca",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
};

export const btnSecondary = {
  padding: "6px 14px",
  background: "#f3f4f6",
  color: "#374151",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
};

export function Field({ label, name, value, onChange, placeholder, textarea, hint, type = "text", required }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
        {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      {hint && <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 5px" }}>{hint}</p>}
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
    </div>
  );
}

export function Msg({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      padding: "10px 14px",
      borderRadius: 6,
      fontSize: 13,
      marginBottom: 16,
      background: msg.ok ? "#f0fdf4" : "#fef2f2",
      color: msg.ok ? "#16a34a" : "#dc2626",
      border: `1px solid ${msg.ok ? "#bbf7d0" : "#fecaca"}`,
    }}>
      {msg.text}
    </div>
  );
}

export function ImageUpload({ currentUrl, onUpload, label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    if (currentUrl) fd.append("oldUrl", currentUrl);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) onUpload(data.url);
      else setError(data.message || "Upload failed.");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#374151" }}>
        {label}
      </label>
      {currentUrl && (
        <div style={{ width: 200, height: 130, borderRadius: 8, overflow: "hidden", marginBottom: 10, border: "1px solid #e5e7eb", background: "#f9fafb" }}>
          <img src={currentUrl} alt="preview" />
        </div>
      )}
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handleFile} disabled={uploading} style={{ fontSize: 13 }} />
      <span style={{ display: "block", fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Supported: JPG, PNG, WEBP, GIF, AVIF · Max 5 MB</span>
      {uploading && (
        <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>Uploading…</span>
      )}
      {error && (
        <div style={{
          marginTop: 6,
          padding: "7px 12px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 6,
          color: "#dc2626",
          fontSize: 13,
        }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
}

export function SectionCard({ children, style }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: "20px 24px",
      marginBottom: 16,
      ...style,
    }}>
      {children}
    </div>
  );
}
