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
    label: "Durga Puja",
    href: "#durga-puja",
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

  const [supportOpen, setSupportOpen] =
    useState(false);

  // =========================================================
  // LIVE IST CLOCK
  // =========================================================

  const [clockParts, setClockParts] =
    useState({
      hour: "",
      minute: "",
      period: "",
    });

  const [showColon, setShowColon] =
    useState(true);

  // =========================================================
  // UPDATE IST CLOCK
  // =========================================================

  useEffect(() => {
    const updateClock = () => {
      const parts =
        new Intl.DateTimeFormat(
          "en-IN",
          {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        ).formatToParts(new Date());

      const hour =
        parts.find(
          (part) =>
            part.type === "hour"
        )?.value ?? "";

      const minute =
        parts.find(
          (part) =>
            part.type === "minute"
        )?.value ?? "";

      const period =
        parts.find(
          (part) =>
            part.type === "dayPeriod"
        )?.value ?? "";

      setClockParts({
        hour,
        minute,
        period,
      });
    };

    updateClock();

    const clockTimer =
      setInterval(
        updateClock,
        1000
      );

    return () => {
      clearInterval(clockTimer);
    };
  }, []);

  // =========================================================
  // BLINK CLOCK COLON
  // =========================================================

  useEffect(() => {
    const colonTimer =
      setInterval(() => {
        setShowColon(
          (previous) => !previous
        );
      }, 500);

    return () => {
      clearInterval(colonTimer);
    };
  }, []);

  // =========================================================
  // CLOSE MODALS WITH ESCAPE
  // =========================================================

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setSupportOpen(false);
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
  // PREVENT BACKGROUND SCROLL WHEN MODAL IS OPEN
  // =========================================================

  useEffect(() => {
    if (
      profileOpen ||
      supportOpen
    ) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [
    profileOpen,
    supportOpen,
  ]);

  // =========================================================
  // COPY UPI ID
  // =========================================================

  const copyUPI = async () => {
    try {
      await navigator.clipboard.writeText(
        "8371987472@pz"
      );
    } catch (error) {
      console.error(
        "Failed to copy UPI ID:",
        error
      );
    }
  };

  return (
    <>
      {/* =====================================================
          LIVE IST CLOCK
      ===================================================== */}

      <div
  className="
    fixed
    left-[18px]
    top-[19px]
    z-[70]
    hidden
    lg:block
    rounded-full
    border
    border-[#d9a441]/35
    bg-[#5b3828]/90
    px-4
    py-2
    shadow-[0_8px_30px_rgba(0,0,0,0.3)]
    backdrop-blur-md
  "
>
        <div
          className="
            flex
            items-center
            whitespace-nowrap
            font-sans
            font-semibold
            text-[#f4ead8]
          "
        >
          {/* HOUR */}

          <span
            className="
              text-[17px]
              tracking-wide
            "
          >
            {clockParts.hour}
          </span>

          {/* BLINKING COLON */}

          <span
            className={`
              mx-[5px]
              text-[17px]
              transition-opacity
              duration-100
              ${
                showColon
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
          >
            :
          </span>

          {/* MINUTE */}

          <span
            className="
              text-[17px]
              tracking-wide
            "
          >
            {clockParts.minute}
          </span>

          {/* AM / PM */}

          <span
            className="
              ml-2
              text-[15px]
              font-semibold
              lowercase
              text-[#f4ead8]
            "
          >
            {clockParts.period}
          </span>

          {/* IST */}

          <span
            className="
              ml-2
              text-[14px]
              font-semibold
              tracking-wide
              text-[#f4ead8]/75
            "
          >
            IST
          </span>
        </div>
      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-[#f4ead8]/10
          bg-[#17120f]/95
          backdrop-blur-md
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[72px]
            max-w-7xl
            items-center
            justify-between
            px-4
            sm:h-[88px]
            sm:px-6
            lg:pl-[90px]
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

<Link
  href="#home"
  className="
    group
    relative
    flex
    shrink-0
    flex-col
  "
>
  {/* Background glow */}

  <div
    className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
      -z-10
      h-16
      w-56
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      bg-[#d9a441]/20
      blur-2xl
      transition-all
      duration-500
      group-hover:bg-[#d9a441]/35
      group-hover:blur-3xl
    "
  />

  {/* DIGITAL ADDA */}

  <span
    className="
      relative
      text-[16px]
      sm:text-[22px]
      font-bold
      tracking-[0.18em]
      text-[#f4ead8]
      drop-shadow-[0_0_12px_rgba(217,164,65,0.25)]
      transition-all
      duration-300
      group-hover:text-[#ffe8a3]
      group-hover:drop-shadow-[0_0_18px_rgba(217,164,65,0.65)]
    "
  >
    DIGITAL ADDA
  </span>

  {/* Subtitle */}

  <span
    className="
      relative
      mt-0.5
      text-[7px]
      sm:mt-1
      sm:text-[9px]
      uppercase
      tracking-[0.42em]
      text-[#b9a98f]
    "
  >
    Music · Stories · Nostalgia
  </span>
</Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav
            className="
              hidden
              items-center
              gap-8
              lg:flex
            "
          >
            {navItems.map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    group
                    relative
                    whitespace-nowrap
                    text-sm
                    font-medium
                    text-[#f4ead8]
                    transition-all
                    duration-300
                    hover:text-[#d9a441]
                    hover:drop-shadow-[0_0_10px_rgba(217,164,65,0.8)]
                  "
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* =================================================
              RIGHT SIDE BUTTONS
          ================================================= */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-3
            "
          >
            {/* ===============================================
                BUY ME A TEA
            =============================================== */}

            <button
              type="button"
              onClick={() =>
                setSupportOpen(true)
              }
              aria-label="Support Digital Adda"
              title="Buy me a tea"
              className="
                group
                flex
                h-11
                w-11
                items-center
                sm:h-14
                sm:w-14
                justify-center
                rounded-full
                border
                border-[#f4ead8]/20
                bg-[#17120f]
                transition
                duration-300
                hover:scale-105
                hover:border-[#d9a441]
                hover:bg-[#211a16]
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="
                  text-[#f4ead8]
                  transition-colors
                  duration-300
                  group-hover:text-[#d9a441]
                "
              >
                <path
                  d="M5 8H17V14C17 17.314 14.314 20 11 20H10C6.686 20 4 17.314 4 14V9C4 8.448 4.448 8 5 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />

                <path
                  d="M17 10H19C20.105 10 21 10.895 21 12V13C21 14.105 20.105 15 19 15H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M7 4C7 5 8 5 8 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M11 4C11 5 12 5 12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* ===============================================
                PROFILE
            =============================================== */}

            <button
              type="button"
              onClick={() =>
                setProfileOpen(true)
              }
              aria-label="Open profile"
              title="Profile"
              className="
                group
                flex
                h-11
                w-11
                items-center
                sm:h-14
                sm:w-14
                justify-center
                rounded-full
                border
                border-[#f4ead8]/20
                bg-[#17120f]
                transition
                duration-300
                hover:scale-105
                hover:border-[#d9a441]
                hover:bg-[#211a16]
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="
                  text-[#f4ead8]
                  transition-colors
                  duration-300
                  group-hover:text-[#d9a441]
                "
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
        </div>

        {/* =================================================
            MOBILE NAVIGATION
        ================================================= */}

        <div
          className="
            border-t
            border-[#f4ead8]/5
            lg:hidden
          "
        >
          <nav
            className="
              flex
              items-center
              gap-5
              overflow-x-auto
              px-4
              py-3
              sm:gap-6
              sm:px-6
              sm:py-4
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {/* MOBILE IST CLOCK */}
            <div className="flex shrink-0 items-center rounded-full border border-[#d9a441]/30 bg-[#5b3828]/60 px-3 py-1.5 backdrop-blur-md lg:hidden">
              <span className="text-[12px] font-semibold tracking-wide text-[#f4ead8]">
                {clockParts.hour}
                <span className={showColon ? "opacity-100" : "opacity-0"}>:</span>
                {clockParts.minute}
              </span>
              <span className="ml-1.5 text-[10px] font-semibold lowercase text-[#f4ead8]">
                {clockParts.period}
              </span>
              <span className="ml-1.5 text-[9px] font-semibold tracking-wide text-[#f4ead8]/65">
                IST
              </span>
            </div>

            {navItems
              .filter(
                (item) =>
                  item.label !==
                    "Home" &&
                  item.label !==
                    "Radio" &&
                  item.label !==
                    "Playlists"
              )
              .map(
                (item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      shrink-0
                      text-xs
                      uppercase
                      tracking-[0.12em]
                      text-[#b9a98f]
                      transition
                      hover:text-[#d9a441]
                    "
                  >
                    {item.label}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        -inset-x-3
                        -inset-y-2
                        -z-10
                        rounded-full
                        bg-[#d9a441]/0
                        blur-md
                        transition-all
                        duration-300
                        group-hover:bg-[#d9a441]/20
                      "
                    />
                  </Link>
                )
              )}
          </nav>
        </div>
      </header>

      {/* =====================================================
          SUPPORT / BUY ME A TEA MODAL
      ===================================================== */}

      {supportOpen && (
        <div
          className="
            fixed
            inset-0
            z-[110]
            flex
            items-center
            justify-center
            bg-black/80
            px-3
            py-3
            backdrop-blur-md
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSupportOpen(false);
            }
          }}
        >
          <div
            className="
              relative
              flex
              w-full
              max-w-[410px]
              max-h-[calc(100vh-24px)]
              flex-col
              overflow-hidden
              rounded-[28px]
              border
              border-[#d9a441]/30
              bg-[#17120f]
              shadow-[0_25px_100px_rgba(0,0,0,0.8)]
            "
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="
                h-[2px]
                w-full
                shrink-0
                bg-gradient-to-r
                from-transparent
                via-[#d9a441]
                to-transparent
              "
            />

            <button
              type="button"
              onClick={() =>
                setSupportOpen(false)
              }
              aria-label="Close support"
              className="
                absolute
                right-5
                top-5
                z-20
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-[#f4ead8]/15
                bg-[#17120f]/80
                text-xl
                text-[#b9a98f]
                transition-all
                duration-300
                hover:rotate-90
                hover:border-[#d9a441]
                hover:text-[#d9a441]
              "
            >
              ×
            </button>

            <div
              className="
                flex
                min-h-0
                flex-col
                items-center
                px-6
                py-5
                sm:px-8
                sm:py-6
              "
            >
              {/* TEA CUP */}

              <div
                className="
                  relative
                  flex
                  h-[82px]
                  w-[82px]
                  shrink-0
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    absolute
                    h-[55px]
                    w-[55px]
                    rounded-full
                    bg-[#d9a441]/20
                    blur-[28px]
                  "
                />

                <img
                  src="/hot-tea-cup-by-Vexels.png"
                  alt="Tea"
                  className="
                    relative
                    z-10
                    h-[82px]
                    w-[82px]
                    object-contain
                    mix-blend-screen
                    drop-shadow-[0_0_8px_rgba(217,164,65,0.28)]
                  "
                />
              </div>

              <p
                className="
                  mt-1
                  text-[9px]
                  uppercase
                  tracking-[0.42em]
                  text-[#d9a441]
                "
              >
                Support Digital Adda
              </p>

              <h2
                className="
                  mt-1.5
                  text-[25px]
                  font-bold
                  leading-tight
                  text-[#f4ead8]
                "
              >
                Buy Me a Tea
              </h2>

              <p
                className="
                  mt-2
                  max-w-[330px]
                  text-center
                  text-[13px]
                  leading-[1.45]
                  text-[#756958]
                "
              >
                Enjoying the music, stories and
                nostalgia? You can support Digital
                Adda with a cup of tea.
              </p>

              <div
                className="
                  mt-4
                  shrink-0
                  rounded-[18px]
                  bg-white
                  p-2.5
                  shadow-[0_8px_35px_rgba(0,0,0,0.35)]
                "
              >
                <img
                  src="/upi-qr.png"
                  alt="Digital Adda UPI QR Code"
                  className="
                    h-[clamp(145px,28vh,185px)]
                    w-[clamp(145px,28vh,185px)]
                    object-contain
                  "
                />
              </div>

              <p
                className="
                  mt-3
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-[#756958]
                "
              >
                UPI ID
              </p>

              <p
                className="
                  mt-1
                  text-[14px]
                  font-medium
                  tracking-wide
                  text-[#f4ead8]
                "
              >
                8371987472@pz
              </p>

              <button
                type="button"
                onClick={copyUPI}
                className="
                  mt-3
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#f4ead8]/10
                  bg-[#211a16]
                  px-5
                  py-2.5
                  text-[11px]
                  tracking-[0.12em]
                  text-[#f4ead8]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-[#d9a441]/50
                  hover:bg-[#d9a441]
                  hover:text-[#17120f]
                "
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="8"
                    y="8"
                    width="11"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <path
                    d="M16 8V6C16 4.89543 15.1046 4 14 4H6C4.89543 4 4 4.89543 4 6V14C4 15.1046 4.89543 16 6 16H8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>

                Copy UPI ID
              </button>

              <p
                className="
                  mt-4
                  text-[8px]
                  uppercase
                  tracking-[0.35em]
                  text-[#756958]
                "
              >
                Every cup keeps the adda alive
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          PROFILE MODAL
      ===================================================== */}

      {profileOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/75
            px-5
            py-8
            backdrop-blur-md
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setProfileOpen(false);
            }
          }}
        >
          <div
            className="
              relative
              max-h-[90vh]
              w-full
              max-w-md
              overflow-y-auto
              rounded-[2rem]
              border
              border-[#d9a441]/25
              bg-[#17120f]
              shadow-[0_30px_100px_rgba(0,0,0,0.7)]
            "
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="
                h-[2px]
                w-full
                bg-gradient-to-r
                from-transparent
                via-[#d9a441]
                to-transparent
              "
            />

            <button
              type="button"
              onClick={() =>
                setProfileOpen(false)
              }
              aria-label="Close profile"
              className="
                absolute
                right-5
                top-5
                z-10
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-[#f4ead8]/15
                bg-[#17120f]/80
                text-xl
                text-[#b9a98f]
                transition-all
                duration-300
                hover:rotate-90
                hover:border-[#d9a441]
                hover:text-[#d9a441]
              "
            >
              ×
            </button>

            <div
              className="
                px-8
                pb-9
                pt-10
                text-center
                sm:px-10
              "
            >
              {/* PROFILE PHOTO */}

              <div
                className="
                  mx-auto
                  h-32
                  w-32
                  overflow-hidden
                  rounded-full
                  border-2
                  border-[#d9a441]/50
                  p-1
                  shadow-[0_0_40px_rgba(217,164,65,0.12)]
                "
              >
                <img
                  src="/profile.JPG"
                  alt="Deeptangshu Sen"
                  className="
                    h-full
                    w-full
                    rounded-full
                    object-cover
                    transition
                    duration-500
                    hover:scale-105
                  "
                />
              </div>

              <p
                className="
                  mt-7
                  text-[10px]
                  uppercase
                  tracking-[0.45em]
                  text-[#d9a441]
                "
              >
                Digital Adda
              </p>

              <h2
                className="
                  mt-3
                  text-3xl
                  font-bold
                  tracking-tight
                  text-[#f4ead8]
                "
              >
                Deeptangshu Sen
              </h2>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-xs
                  text-sm
                  leading-6
                  text-[#756958]
                "
              >
                Music, stories, nostalgia — and
                everything in between.
              </p>

              <div
                className="
                  mx-auto
                  my-7
                  h-px
                  w-20
                  bg-[#d9a441]/30
                "
              />

              <div
                className="
                  flex
                  flex-wrap
                  justify-center
                  gap-3
                "
              >
                {/* INSTAGRAM */}

                <a
                  href="https://www.instagram.com/deeptangshu.sen_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-full
                    border
                    border-[#f4ead8]/10
                    bg-[#211a16]
                    px-5
                    py-3
                    text-xs
                    tracking-[0.12em]
                    text-[#f4ead8]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#d9a441]/50
                    hover:bg-[#d9a441]
                    hover:text-[#17120f]
                  "
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

                {/* LINKEDIN */}

                <a
                  href="https://www.linkedin.com/in/deeptangshu-sen-707864253/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-full
                    border
                    border-[#f4ead8]/10
                    bg-[#211a16]
                    px-5
                    py-3
                    text-xs
                    tracking-[0.12em]
                    text-[#f4ead8]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#d9a441]/50
                    hover:bg-[#d9a441]
                    hover:text-[#17120f]
                  "
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

              <p
                className="
                  mt-8
                  text-[9px]
                  uppercase
                  tracking-[0.35em]
                  text-[#756958]
                "
              >
                Welcome to my adda
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}