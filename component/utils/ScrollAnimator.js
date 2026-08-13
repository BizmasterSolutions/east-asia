"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const CSS = `
  @keyframes _fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes _fadeInDown {
    from { opacity: 0; transform: translateY(-40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes _fadeInLeft {
    from { opacity: 0; transform: translateX(-55px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes _fadeInRight {
    from { opacity: 0; transform: translateX(55px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes _fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes _zoomIn {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }

  .wow-pending {
    visibility: hidden;
    opacity: 0;
  }
  .wow.animated.fadeInUp    { animation: _fadeInUp    0.75s cubic-bezier(0.22,1,0.36,1) both; }
  .wow.animated.fadeInDown  { animation: _fadeInDown  0.75s cubic-bezier(0.22,1,0.36,1) both; }
  .wow.animated.fadeInLeft  { animation: _fadeInLeft  0.75s cubic-bezier(0.22,1,0.36,1) both; }
  .wow.animated.fadeInRight { animation: _fadeInRight 0.75s cubic-bezier(0.22,1,0.36,1) both; }
  .wow.animated.fadeIn      { animation: _fadeIn      0.75s ease both; }
  .wow.animated.zoomIn      { animation: _zoomIn      0.75s cubic-bezier(0.22,1,0.36,1) both; }

  .img-reveal img {
    transition: transform 0.9s cubic-bezier(0.22,1,0.36,1), opacity 0.9s ease;
    transform: scale(1.06);
    opacity: 0;
  }
  .img-reveal.in-view img { transform: scale(1); opacity: 1; }

  .menu_fix {
    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    transition: box-shadow 0.3s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .wow-pending {
      visibility: visible;
      opacity: 1;
    }
    .wow.animated.fadeInUp,
    .wow.animated.fadeInDown,
    .wow.animated.fadeInLeft,
    .wow.animated.fadeInRight,
    .wow.animated.fadeIn,
    .wow.animated.zoomIn {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
    .img-reveal img {
      transition: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
    .menu_fix {
      transition: none !important;
    }
  }
`;

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

function animateEl(el) {
  el.classList.remove("wow-pending");
  el.style.visibility = "";
  el.style.opacity = "";
  el.style.animationDelay = el.dataset.wowDelay || "0s";
  el.classList.add("animated");
}

export default function ScrollAnimator() {
  const pathname = usePathname();

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateEl(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    // For each .wow element: show immediately if already visible, otherwise hide and observe
    document.querySelectorAll(".wow").forEach((el) => {
      if (isInViewport(el)) {
        animateEl(el);
      } else {
        el.classList.add("wow-pending");
        observer.observe(el);
      }
    });

    // Smooth scale-in for section images
    const imgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            imgObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".tf__about_img, .tf__faq_img").forEach((el) => {
      el.classList.add("img-reveal");
      imgObserver.observe(el);
    });

    return () => {
      observer.disconnect();
      imgObserver.disconnect();
      styleEl.remove();
    };
  }, [pathname]);

  return null;
}
