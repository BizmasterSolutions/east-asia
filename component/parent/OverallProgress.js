"use client";

export default function OverallProgress({ value }) {
  if (value === null) return null;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 75 ? "#16a34a" : value >= 50 ? "#f59e0b" : "#ef4444";
  const label = value >= 75 ? "Excellent" : value >= 60 ? "Good" : value >= 50 ? "Average" : "Needs Improvement";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
      <div style={{ position: "relative", width: "140px", height: "140px" }}>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle
            cx="70" cy="70" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "26px", fontWeight: 800, color, lineHeight: 1 }}>{value}%</span>
          <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, marginTop: "3px" }}>Overall</span>
        </div>
      </div>
      <span style={{ fontSize: "13px", fontWeight: 600, color, background: color + "18", padding: "4px 14px", borderRadius: "12px" }}>
        {label}
      </span>
    </div>
  );
}
