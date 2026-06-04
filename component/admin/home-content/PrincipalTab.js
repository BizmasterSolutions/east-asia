"use client";
import { useState, useEffect } from "react";
import { Msg, btnPrimary } from "./Shared";

export default function PrincipalTab() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch("/api/admin/home-content/principal")
      .then((r) => r.json())
      .then((d) => { setContent(d.content || ""); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/home-content/principal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setMsg({ ok: res.ok, text: (await res.json()).message });
    setSaving(false);
  };

  if (loading) return <p style={{ color: "#9ca3af" }}>Loading…</p>;

  return (
    <form onSubmit={save}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
          Welcome Note
        </label>
        <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 6px" }}>
          Supports basic HTML tags e.g. &lt;b&gt;, &lt;i&gt;, &lt;br&gt;, &lt;p&gt;
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder="Write the principal's welcome message here…"
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: 14,
            fontFamily: "sans-serif",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </div>

      {content && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>PREVIEW</p>
          <div
            style={{
              padding: "16px 20px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              fontSize: 14,
              lineHeight: 1.7,
              color: "#374151",
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}

      <Msg msg={msg} />
      <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
        {saving ? "Saving…" : "Save Note"}
      </button>
    </form>
  );
}
