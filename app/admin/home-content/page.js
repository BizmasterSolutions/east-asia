"use client";
import { useState } from "react";
import HeroTab from "@/component/admin/home-content/HeroTab";
import SlideshowTab from "@/component/admin/home-content/SlideshowTab";
import PrincipalTab from "@/component/admin/home-content/PrincipalTab";
import StoriesTab from "@/component/admin/home-content/StoriesTab";
import NewsTab from "@/component/admin/home-content/NewsTab";
import EventsTab from "@/component/admin/home-content/EventsTab";
import SocialTab from "@/component/admin/home-content/SocialTab";
import StatsTab from "@/component/admin/home-content/StatsTab";
import AboutTab from "@/component/admin/home-content/AboutTab";
import CoursesTab from "@/component/admin/home-content/CoursesTab";
import ActivitiesTab from "@/component/admin/home-content/ActivitiesTab";
import BlogTab from "@/component/admin/home-content/BlogTab";
import NavbarTab from "@/component/admin/home-content/NavbarTab";

const TABS = [
  { id: "navbar",       label: "Navbar",                icon: "fas fa-bars" },
  { id: "hero",         label: "Hero Banner",           icon: "fas fa-image" },
  { id: "about",        label: "About Section",         icon: "fas fa-info-circle" },
  { id: "courses",      label: "Advance Courses",       icon: "fas fa-graduation-cap" },
  { id: "activities",   label: "Activities",            icon: "fas fa-running" },
  { id: "blog",         label: "Blog & News",           icon: "fas fa-newspaper" },
  { id: "slideshow",    label: "Slideshow",             icon: "fas fa-images" },
  { id: "principal",    label: "Principal's Note",      icon: "fas fa-user-tie" },
  { id: "stories",      label: "Success Stories",       icon: "fas fa-star" },
  { id: "news",         label: "News",                  icon: "fas fa-bullhorn" },
  { id: "events",       label: "Events",                icon: "fas fa-calendar-alt" },
  { id: "social",       label: "Social Links",          icon: "fas fa-share-alt" },
  { id: "stats",        label: "School Stats",          icon: "fas fa-chart-bar" },
];

export default function HomeContentPage() {
  const [activeTab, setActiveTab] = useState("hero");

  return (
    <div style={{ padding: "36px 40px", fontFamily: "sans-serif", minHeight: "100vh" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Home Page Content</h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Manage everything shown on the public home page.</p>
      </div>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
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
                padding: "9px 16px",
                background: "none",
                border: "none",
                borderBottom: active ? "2px solid #4f46e5" : "2px solid transparent",
                marginBottom: -2,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? "#4f46e5" : "#6b7280",
                borderRadius: "4px 4px 0 0",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              <i className={tab.icon} style={{ fontSize: 13 }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ maxWidth: ["courses", "blog"].includes(activeTab) ? 1200 : 760 }}>
        {activeTab === "navbar"       && <NavbarTab />}
        {activeTab === "hero"         && <HeroTab />}
        {activeTab === "about"        && <AboutTab />}
        {activeTab === "courses"      && <CoursesTab />}
        {activeTab === "activities"   && <ActivitiesTab />}
        {activeTab === "blog"         && <BlogTab />}
        {activeTab === "slideshow"    && <SlideshowTab />}
        {activeTab === "principal"    && <PrincipalTab />}
        {activeTab === "stories"      && <StoriesTab />}
        {activeTab === "news"         && <NewsTab />}
        {activeTab === "events"       && <EventsTab />}
        {activeTab === "social"       && <SocialTab />}
        {activeTab === "stats"        && <StatsTab />}
      </div>
    </div>
  );
}
