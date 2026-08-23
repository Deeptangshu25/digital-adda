"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "Radio",
    href: "#radio",
  },
  {
    label: "Playlists",
    href: "#playlists",
  },
  {
    label: "Sunday Suspense",
    href: "#sunday-suspense",
  },
  {
    label: "About",
    href: "#about",
  },
];

export default function Navbar() {
  const [profileOpen, setProfileOpen] =
    useState(false);

  // =========================================================
  // CLOSE PROFILE WITH ESCAPE
  // =========================================================

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =========================================================
  // PREVENT BACKGROUND SCROLL WHEN PROFILE IS OPEN
  // =========================================================

  useEffect(() => {
    if (profileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [profileOpen]);

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#f4ead8]/10 bg-[#17120f]/95 backdrop-blur-md">

        <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-6">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="#home"
            className="group flex flex-col"
          >
            <span className="text-[22px] font-bold tracking-[0.18em] text-[#f4ead8] transition group-hover:text-[#d9a441]">
              DIGITAL ADDA
            </span>

            <span className="mt-1 text-[9px] uppercase tracking-[0.42em] text-[#b9a98f]">
              Music · Stories · Nostalgia
            </span>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="hidden items-center gap-8 lg:flex">

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#f4ead8] transition duration-200 hover:text-[#d9a441]"
              >
                {item.label}
              </Link>
            ))}

          </nav>

          {/* =================================================
              PROFILE BUTTON
              Person icon remains exactly in the navbar.
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setProfileOpen(true)
            }
            aria-label="Open profile"
            className="group flex h-14 w-14 items-center justify-center rounded-full border border-[#f4ead8]/20 bg-[#17120f] transition duration-300 hover:border-[#d9a441] hover:bg-[#211a16] hover:scale-105"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#f4ead8] transition-colors duration-300 group-hover:text-[#d9a441]"
            >
              <path
                d="M20 21C20 17.6863 17.3137 15 14 15H10C6.68629 15 4 17.6863 4 21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>

        </div>

        {/* =================================================
            MOBILE NAVIGATION
        ================================================= */}

        <div className="border-t border-[#f4ead8]/5 lg:hidden">

          <nav className="flex gap-6 overflow-x-auto px-6 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 text-xs uppercase tracking-[0.12em] text-[#b9a98f] transition hover:text-[#d9a441]"
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() =>
                setProfileOpen(true)
              }
              className="shrink-0 text-xs uppercase tracking-[0.12em] text-[#b9a98f] transition hover:text-[#d9a441]"
            >
              Profile
            </button>

          </nav>

        </div>

      </header>

      {/* =====================================================
          PROFILE MODAL
      ===================================================== */}

      {profileOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-5 py-8 backdrop-blur-md animate-[fadeIn_250ms_ease-out]"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setProfileOpen(false);
            }
          }}
        >

          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <div
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-[#d9a441]/25 bg-[#17120f] shadow-[0_30px_100px_rgba(0,0,0,0.7)] animate-[profileIn_300ms_ease-out]"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                TOP GOLD LINE
            ================================================= */}

            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#d9a441] to-transparent" />

            {/* =================================================
                CLOSE BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                setProfileOpen(false)
              }
              aria-label="Close profile"
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#f4ead8]/15 bg-[#17120f]/80 text-xl text-[#b9a98f] transition-all duration-300 hover:rotate-90 hover:border-[#d9a441] hover:text-[#d9a441]"
            >
              ×
            </button>

            {/* =================================================
                PROFILE CONTENT
            ================================================= */}

            <div className="px-8 pb-9 pt-10 text-center sm:px-10">

              {/* =================================================
                  PROFILE PHOTO
              ================================================= */}

              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-2 border-[#d9a441]/50 p-1 shadow-[0_0_40px_rgba(217,164,65,0.12)] animate-[profilePhotoIn_450ms_ease-out]">

                <img
                  src="/profile.JPG"
                  alt="Deeptangshu Sen"
                  className="h-full w-full rounded-full object-cover transition duration-500 hover:scale-105"
                />

              </div>

              {/* =================================================
                  LABEL
              ================================================= */}

              <p className="mt-7 text-[10px] uppercase tracking-[0.45em] text-[#d9a441]">
                Digital Adda
              </p>

              {/* =================================================
                  NAME
              ================================================= */}

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#f4ead8]">
                Deeptangshu Sen
              </h2>

              {/* =================================================
                  BIO
              ================================================= */}

              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#756958]">
                Music, stories, nostalgia —
                and everything in between.
              </p>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div className="mx-auto my-7 h-px w-20 bg-[#d9a441]/30" />

              {/* =================================================
                  SOCIAL LINKS
              ================================================= */}

              <div className="flex flex-wrap justify-center gap-3">

                {/* =================================================
                    INSTAGRAM
                ================================================= */}

                <a
                  href="https://www.instagram.com/deeptangshu.sen_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-full border border-[#f4ead8]/10 bg-[#211a16] px-5 py-3 text-xs tracking-[0.12em] text-[#f4ead8] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9a441]/50 hover:bg-[#d9a441] hover:text-[#17120f]"
                >

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />

                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                    />
                  </svg>

                  Instagram

                </a>

                {/* =================================================
                    LINKEDIN
                ================================================= */}

                <a
                  href="https://www.linkedin.com/in/deeptangshu-sen-707864253/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-full border border-[#f4ead8]/10 bg-[#211a16] px-5 py-3 text-xs tracking-[0.12em] text-[#f4ead8] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9a441]/50 hover:bg-[#d9a441] hover:text-[#17120f]"
                >

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6.5 8.5H3.5V20H6.5V8.5ZM5 4C4.0335 4 3.25 4.7835 3.25 5.75C3.25 6.7165 4.0335 7.5 5 7.5C5.9665 7.5 6.75 6.7165 6.75 5.75C6.75 4.7835 5.9665 4 5 4ZM20.5 13.4C20.5 9.95 18.65 8.2 15.85 8.2C13.75 8.2 12.8 9.35 12.4 10V8.5H9.5V20H12.5V14.3C12.5 12.8 12.8 11.35 14.25 11.35C15.7 11.35 15.75 12.95 15.75 14.4V20H18.75V13.4H20.5Z" />
                  </svg>

                  LinkedIn

                </a>

              </div>

              {/* =================================================
                  FOOTER TEXT
              ================================================= */}

              <p className="mt-8 text-[9px] uppercase tracking-[0.35em] text-[#756958]">
                Welcome to my adda
              </p>

            </div>

          </div>

        </div>
      )}
    </>
  );
}