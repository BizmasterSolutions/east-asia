"use client";
import { useRouter } from "next/navigation";

export default function ChildSelector({ children, selectedId }) {
  const router = useRouter();

  if (children.length <= 1) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500, whiteSpace: "nowrap" }}>Viewing child:</label>
      <select
        value={selectedId}
        onChange={(e) => router.push(`/parent-portal/dashboard?child=${e.target.value}`)}
        style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", fontWeight: 600, color: "#111827", background: "#fff", cursor: "pointer", outline: "none" }}
      >
        {children.map((c) => (
          <option key={c.id} value={c.id}>{c.fullName} — {c.grade}</option>
        ))}
      </select>
    </div>
  );
}
