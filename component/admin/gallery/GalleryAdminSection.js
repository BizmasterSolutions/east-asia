"use client";
import { useState, useEffect } from "react";
import { ImageUpload, Msg, SectionCard, btnPrimary, btnDanger, inputStyle } from "@/component/admin/home-content/Shared";

const CATEGORIES = ["events", "sports", "academic", "arts", "competitions", "classroom"];

const CATEGORY_COLORS = {
  events:       { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  sports:       { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  academic:     { bg: "#faf5ff", color: "#7c3aed", border: "#e9d5ff" },
  arts:         { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  competitions: { bg: "#fefce8", color: "#ca8a04", border: "#fde68a" },
  classroom:    { bg: "#f0f9ff", color: "#0284c7", border: "#bae6fd" },
};

function PhotosTab() {
  const [photos, setPhotos] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [category, setCategory] = useState("events");
  const [filter, setFilter] = useState("all");
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch("/api/admin/gallery/photos")
      .then((r) => r.json())
      .then(setPhotos);

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!imagePath) { setMsg({ ok: false, text: "Please upload an image." }); return; }
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/gallery/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagePath, category }),
    });
    if (res.ok) {
      setMsg({ ok: true, text: "Photo added." });
      setImagePath("");
      setCategory("events");
      load();
    } else {
      setMsg({ ok: false, text: (await res.json()).message });
    }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this photo?")) return;
    await fetch(`/api/admin/gallery/photos/${id}`, { method: "DELETE" });
    load();
  };

  const visible = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  return (
    <div>
      <Msg msg={msg} />

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>Add New Photo</h3>
        <form onSubmit={save}>
          <ImageUpload
            label="Photo"
            currentUrl={imagePath}
            onUpload={setImagePath}
          />
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
              Category <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ ...inputStyle, width: 220 }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : "Add Photo"}
          </button>
        </form>
      </SectionCard>

      {/* Filter bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {["all", ...CATEGORIES].map((cat) => {
          const active = filter === cat;
          const colors = cat !== "all" ? CATEGORY_COLORS[cat] : null;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "5px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: active
                  ? (colors ? `1px solid ${colors.border}` : "1px solid #4f46e5")
                  : "1px solid #e5e7eb",
                background: active
                  ? (colors ? colors.bg : "#ede9fe")
                  : "#fff",
                color: active
                  ? (colors ? colors.color : "#4f46e5")
                  : "#6b7280",
                transition: "all 0.15s",
              }}
            >
              {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              {cat !== "all" && (
                <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.8 }}>
                  ({photos.filter((p) => p.category === cat).length})
                </span>
              )}
              {cat === "all" && (
                <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.8 }}>({photos.length})</span>
              )}
            </button>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p style={{ color: "#9ca3af", fontSize: 14 }}>
          {filter === "all" ? "No photos yet." : `No photos in "${filter}".`}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
        {visible.map((photo) => {
          const colors = CATEGORY_COLORS[photo.category] || CATEGORY_COLORS.events;
          return (
            <div
              key={photo.id}
              style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={photo.imagePath}
                  alt={photo.category}
                  style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
                />
                <span style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  background: colors.bg,
                  color: colors.color,
                  border: `1px solid ${colors.border}`,
                }}>
                  {photo.category}
                </span>
              </div>
              <div style={{ padding: "8px 12px" }}>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 8px" }}>
                  {new Date(photo.uploadedAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => del(photo.id)}
                  style={{ fontSize: 12, padding: "4px 12px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer", width: "100%" }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VideosTab() {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({ youtubeUrl: "", title: "" });
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch("/api/admin/gallery/videos")
      .then((r) => r.json())
      .then(setVideos);

  useEffect(() => { load(); }, []);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.youtubeUrl.trim()) { setMsg({ ok: false, text: "YouTube URL is required." }); return; }
    if (!form.title.trim()) { setMsg({ ok: false, text: "Title is required." }); return; }
    setSaving(true); setMsg(null);
    const res = await fetch("/api/admin/gallery/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg({ ok: true, text: "Video added." });
      setForm({ youtubeUrl: "", title: "" });
      load();
    } else {
      setMsg({ ok: false, text: (await res.json()).message });
    }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this video?")) return;
    await fetch(`/api/admin/gallery/videos/${id}`, { method: "DELETE" });
    load();
  };

  const getThumb = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
  };

  return (
    <div>
      <Msg msg={msg} />

      <SectionCard>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>Add New Video</h3>
        <form onSubmit={save}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
              YouTube URL <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              name="youtubeUrl"
              value={form.youtubeUrl}
              onChange={set}
              placeholder="https://www.youtube.com/watch?v=..."
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4, color: "#374151" }}>
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={set}
              placeholder="Video title…"
              style={inputStyle}
            />
          </div>
          <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : "Add Video"}
          </button>
        </form>
      </SectionCard>

      {videos.length === 0 && <p style={{ color: "#9ca3af", fontSize: 14 }}>No videos yet.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {videos.map((video) => {
          const thumb = getThumb(video.youtubeUrl);
          return (
            <div
              key={video.id}
              style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}
            >
              {thumb ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={thumb}
                    alt={video.title}
                    style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
                  />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.25)",
                  }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <i className="fas fa-play" style={{ color: "#dc2626", fontSize: 16, marginLeft: 3 }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ height: 140, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fab fa-youtube" style={{ fontSize: 40, color: "#dc2626" }} />
                </div>
              )}
              <div style={{ padding: "10px 14px" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: "0 0 4px", lineHeight: 1.4 }}>
                  {video.title}
                </p>
                <a
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 11, color: "#6b7280", wordBreak: "break-all", display: "block", marginBottom: 10 }}
                >
                  {video.youtubeUrl.length > 40 ? video.youtubeUrl.slice(0, 40) + "…" : video.youtubeUrl}
                </a>
                <button
                  onClick={() => del(video.id)}
                  style={{ fontSize: 12, padding: "4px 12px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer", width: "100%" }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TABS = [
  { id: "photos", label: "Photos", icon: "fas fa-camera" },
  { id: "videos", label: "Videos", icon: "fab fa-youtube" },
];

export default function GalleryAdminSection() {
  const [activeTab, setActiveTab] = useState("photos");

  return (
    <div style={{ padding: "36px 40px", fontFamily: "sans-serif", minHeight: "100vh" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Gallery Management</h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Upload and manage gallery photos and videos shown on the public gallery page.</p>
      </div>

      <div style={{
        display: "flex",
        gap: 4,
        borderBottom: "2px solid #e5e7eb",
        marginBottom: 28,
      }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 20px",
                background: "none",
                border: "none",
                borderBottom: active ? "2px solid #4f46e5" : "2px solid transparent",
                marginBottom: -2,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                color: active ? "#4f46e5" : "#6b7280",
                borderRadius: "4px 4px 0 0",
                transition: "color 0.15s",
              }}
            >
              <i className={tab.icon} style={{ fontSize: 14 }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ maxWidth: 900 }}>
        {activeTab === "photos" && <PhotosTab />}
        {activeTab === "videos" && <VideosTab />}
      </div>
    </div>
  );
}
