"use client";
import { useEffect } from "react";

export default function ScrollAnimator() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .wow {
        visibility: hidden;
        opacity: 0;
      }
      .wow.animated {
        visibility: visible;
      }
      @keyframes _fadeInUp {
        from { opacity: 0; transform: translateY(40px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes _fadeInDown {
        from { opacity: 0; transform: translateY(-40px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes _fadeInLeft {
        from { opacity: 0; transform: translateX(-50px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes _fadeInRight {
        from { opacity: 0; transform: translateX(50px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes _fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes _zoomIn {
        from { opacity: 0; transform: scale(0.85); }
        to   { opacity: 1; transform: scale(1); }
      }
      .wow.animated.fadeInUp    { animation: _fadeInUp    0.7s ease forwards; }
      .wow.animated.fadeInDown  { animation: _fadeInDown  0.7s ease forwards; }
      .wow.animated.fadeInLeft  { animation: _fadeInLeft  0.7s ease forwards; }
      .wow.animated.fadeInRight { animation: _fadeInRight 0.7s ease forwards; }
      .wow.animated.fadeIn      { animation: _fadeIn      0.7s ease forwards; }
      .wow.animated.zoomIn      { animation: _zoomIn      0.7s ease forwards; }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.wowDelay || "0s";
            el.style.animationDelay = delay;
            el.classList.add("animated");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".wow").forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      style.remove();
    };
  }, []);

  return null;
}
