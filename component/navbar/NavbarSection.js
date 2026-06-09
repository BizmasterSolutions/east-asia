"use client";
import { useEduorContext } from "@/context/EduorContext";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import NavigationSection from "./NavigationSection";

const NavbarSection = ({ style, logo, colors = {} }) => {
  const { bgColor, textColor, linkColor } = colors;
  const {
    isHeaderFixed,
    handleMobileNavOpen,
    isMobileNavOpen,
    handleMobileNavClose,
    setIsMobileNavOpen,
  } = useEduorContext();
  const navMenuRef = useRef(null);

  useEffect(() => {
    // Function to handle clicks outside the navigation menu
    const handleClickOutside = (event) => {
      if (
        navMenuRef.current &&
        !navMenuRef.current.contains(event.target) &&
        isMobileNavOpen
      ) {
        setIsMobileNavOpen(false); // Close the mobile navigation menu
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileNavOpen, setIsMobileNavOpen]);
  return (
    <>
      {(bgColor || linkColor) && (
        <style dangerouslySetInnerHTML={{ __html: `
          .main_menu { ${bgColor ? `background-color: ${bgColor} !important;` : ""} }
          .main_menu .nav-link, .main_menu .navbar-nav > li > a { ${linkColor ? `color: ${linkColor} !important;` : ""} }
        ` }} />
      )}
    <nav
      className={`navbar navbar-expand-lg main_menu ${style} ${
        isHeaderFixed ? "menu_fix" : ""
      }`}
      ref={navMenuRef}
      style={{
        marginTop: isHeaderFixed ? "0px" : "29px",
        ...(textColor && { color: textColor }),
      }}
    >
      <div className="container">
        <Link className="navbar-brand" href="/">
          <img src={logo} alt="East Asian" className="img-fluid w-100" />
          <img src="/Logo name.png" alt="Logo Name" className="img-fluid" style={{ marginTop: "15px" }} />
        </Link>
        {isMobileNavOpen ? (
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleMobileNavClose}
          >
            <i className="fa fa-times close_icon"></i>
          </button>
        ) : (
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleMobileNavOpen}
          >
            <i className="fa fa-bars menu_icon"></i>
          </button>
        )}

        <NavigationSection
          position="ms-auto"
          btnPosition={false}
          navRef={navMenuRef}
        />
      </div>
    </nav>
    </>
  );
};

export default NavbarSection;
