import React from "react";

const Loading = () => {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#f8f9ff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}>

      {/* Top accent bar */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #00306e, #1a7fd4, #f0a500, #00306e)",
        backgroundSize: "200% 100%",
        animation: "slide 2s linear infinite",
      }} />

      {/* Card */}
      <div style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "48px 56px",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,48,110,0.12)",
        border: "1px solid #e8edf8",
        minWidth: "300px",
      }}>

        {/* Spinning ring + logo */}
        <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 24px" }}>
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: "3px solid #e8edf8",
            borderTopColor: "#00306e",
            animation: "spin 1s linear infinite",
          }} />
          <div style={{
            position: "absolute", inset: "10px",
            borderRadius: "50%",
            border: "3px solid #e8edf8",
            borderBottomColor: "#f0a500",
            animation: "spin 1.5s linear infinite reverse",
          }} />
          <div style={{
            position: "absolute", inset: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img
              src="/6f7e80d6-498f-11ef-bb81-1fc350a940db.svg"
              alt="Loading"
              style={{ width: 48, height: 48 }}
            />
          </div>
        </div>

        {/* School name */}
        <h2 style={{
          color: "#00306e",
          fontSize: "18px",
          fontWeight: 700,
          letterSpacing: "1px",
          margin: "0 0 4px",
        }}>
          East Asian Int&apos;l School
        </h2>
        <p style={{
          color: "#6b7280",
          fontSize: "12px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          margin: "0 0 28px",
        }}>
          Sri Lanka
        </p>

        {/* Progress bar */}
        <div style={{ background: "#e8edf8", borderRadius: "99px", height: "5px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: "40%",
            borderRadius: "99px",
            background: "linear-gradient(90deg, #00306e, #1a7fd4)",
            animation: "progress 1.4s ease-in-out infinite",
          }} />
        </div>

        <p style={{ color: "#9ca3af", fontSize: "11px", marginTop: "12px", letterSpacing: "1px" }}>
          Please wait…
        </p>
      </div>

      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes slide    { 0% { background-position: 0% 0; } 100% { background-position: 200% 0; } }
        @keyframes progress { 0% { margin-left: -40%; } 100% { margin-left: 110%; } }
      `}</style>
    </div>
  );
};

export default Loading;
