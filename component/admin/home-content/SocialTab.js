"use client";
import { useState, useEffect } from "react";
import { Field, Msg, btnPrimary } from "./Shared";

const EMPTY = {
  social_facebook: "",
  social_instagram: "",
  social_twitter: "",
  social_youtube: "",
  social_linkedin: "",
};

const FIELDS = [
  { key: "social_facebook", label: "Facebook URL", icon: "fab fa-facebook", placeholder: "https://facebook.com/yourpage" },
  { key: "social_instagram", label: "Instagram URL", icon: "fab fa-instagram", placeholder: "https://instagram.com/yourhandle" },
  { key: "social_twitter", label: "Twitter / X URL", icon: "fab fa-twitter", placeholder: "https://twitter.com/yourhandle" },
  { key: "social_youtube", label: "YouTube URL", icon: "fab fa-youtube", placeholder: "https://youtube.com/@yourchannel" },
  { key: "social_linkedin", label: "LinkedIn URL", icon: "fab fa-linkedin", placeholder: "https://linkedin.com/company/yourpage" },
];

export default function SocialTab() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch("/api/admin/home-content/social")
      .then((r) => r.json())
      .then((d) => { setForm({ ...EMPTY, ...d }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/home-content/social", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMsg({ ok: res.ok, text: (await res.json()).message });
    setSaving(false);
  };

  if (loading) return <p style={{ color: "#9ca3af" }}>Loading…</p>;

  return (
    <form onSubmit={save}>
      {FIELDS.map(({ key, label, placeholder }) => (
        <Field key={key} label={label} name={key} value={form[key]} onChange={set} placeholder={placeholder} />
      ))}
      <Msg msg={msg} />
      <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
        {saving ? "Saving…" : "Save Links"}
      </button>
    </form>
  );
}
