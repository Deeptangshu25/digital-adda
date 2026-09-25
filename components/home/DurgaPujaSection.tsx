"use client";

import { useEffect, useState } from "react";

interface PujaPlaylist {
  title: string;
  description: string;
  icon: string;
  playlistId: string;
}

interface DurgaPujaSectionProps {
  onSelectPlaylist?: (playlistId: string) => void;
}

/*
 * =========================================================
 * DURGA PUJA 2026
 *
 * Maha Shashthi:
 * 17 October 2026
 *
 * India Standard Time:
 * UTC +05:30
 * =========================================================
 */

const PUJA_START = new Date(
  "2026-10-17T00:00:00+05:30"
).getTime();

export default function DurgaPujaSection({
  onSelectPlaylist,
}: DurgaPujaSectionProps) {
  /*
   * =========================================================
   * COUNTDOWN STATE
   * =========================================================
   */

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  /*
   * =========================================================
   * COUNTDOWN TIMER
   * =========================================================
   */

  useEffect(() => {
    const updateCountdown = () => {
      const difference =
        PUJA_START - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const days = Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference /
          (1000 * 60 * 60)) %
          24
      );

      const minutes = Math.floor(
        (difference /
          (1000 * 60)) %
          60
      );

      const seconds = Math.floor(
        (difference / 1000) %
          60
      );

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    updateCountdown();

    const timer = setInterval(
      updateCountdown,
      1000
    );

    return () => {
      clearInterval(timer);
    };
  }, []);

  /*
   * =========================================================
   * PUJO PLAYLISTS
   * =========================================================
   */

  const pujaPlaylists: PujaPlaylist[] = [
  {
    title: "Mahalaya",
    description:
      "Mahalaya special songs, Mahishasura Mardini and the sounds that mark the beginning of Pujo.",
    icon: "🌅",
    playlistId: "PLdmrlJOn6maQ",
  },

  {
    title: "Pujo Classics",
    description:
      "Classic Bengali Puja songs and timeless favourites for the Sharodiya season.",
    icon: "🥁",
    playlistId: "PLfaE80CWR08s",
  },
];

  /*
   * =========================================================
   * PLAYLIST SELECT
   * =========================================================
   */

  const handlePlaylistClick = (
    playlistId: string
  ) => {
    onSelectPlaylist?.(
      playlistId
    );

    /*
     * Scroll back to the main
     * music player.
     */

    setTimeout(() => {
      document
        .getElementById("radio")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  return (
    <section
      id="durga-puja"
      className="
        relative
        overflow-hidden
        bg-[#17120f]
        px-5
        py-24
        text-[#f4ead8]
        sm:px-8
        lg:px-12
      "
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Left glow */}

        <div
          className="
            absolute
            -left-32
            top-20
            h-80
            w-80
            rounded-full
            bg-[#c43d32]/10
            blur-3xl
          "
        />

        {/* Right glow */}

        <div
          className="
            absolute
            -right-32
            bottom-10
            h-80
            w-80
            rounded-full
            bg-[#d9a441]/10
            blur-3xl
          "
        />

        {/* Decorative flowers */}

        <div
          className="
            absolute
            left-[10%]
            top-24
            text-6xl
            opacity-[0.06]
          "
        >
          🌺
        </div>

        <div
          className="
            absolute
            right-[12%]
            top-32
            text-7xl
            opacity-[0.06]
          "
        >
          🪔
        </div>

        <div
          className="
            absolute
            bottom-16
            left-[18%]
            text-6xl
            opacity-[0.05]
          "
        >
          🌾
        </div>

      </div>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative mx-auto max-w-7xl">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mx-auto max-w-3xl text-center">

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.45em]
              text-[#d9a441]
            "
          >
            Digital Adda presents
          </p>

          <h2
            className="
              mt-4
              text-4xl
              font-bold
              tracking-tight
              sm:text-5xl
              lg:text-6xl
            "
          >
            Durga Puja
          </h2>

          {/* Decorative divider */}

          <div className="mx-auto mt-5 flex items-center justify-center gap-3">

            <span className="h-px w-12 bg-[#d9a441]/40" />

            <span className="text-xl">
              🪔
            </span>

            <span className="h-px w-12 bg-[#d9a441]/40" />

          </div>

          <p
            className="
              mt-6
              text-sm
              leading-7
              text-[#a99b8a]
              sm:text-base
            "
          >
            ঢাকের তালে, কাশফুলের গন্ধে,
            <br />
            Pujo hok Digital Adda-r sathe.
          </p>

          <p
            className="
              mt-3
              text-xs
              uppercase
              tracking-[0.25em]
              text-[#756958]
            "
          >
            Shubho Sharodiya
          </p>

        </div>

        {/* ===================================================
            COUNTDOWN
        =================================================== */}

        <div
          className="
            mx-auto
            mt-14
            max-w-4xl
            rounded-[2rem]
            border
            border-[#d9a441]/20
            bg-[#211813]
            px-5
            py-8
            sm:px-10
            sm:py-10
          "
        >

          {/* Countdown title */}

          <div className="text-center">

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.4em]
                text-[#d9a441]
              "
            >
              Pujo Starts In
            </p>

            <p
              className="
                mt-2
                text-xs
                text-[#756958]
              "
            >
              Maha Shashthi · 17 October 2026
            </p>

          </div>

          {/* Countdown numbers */}

          <div
            className="
              mt-8
              grid
              grid-cols-4
              gap-2
              sm:gap-5
            "
          >

            <CountdownBox
              value={timeLeft.days}
              label="Days"
            />

            <CountdownBox
              value={timeLeft.hours}
              label="Hours"
            />

            <CountdownBox
              value={timeLeft.minutes}
              label="Minutes"
            />

            <CountdownBox
              value={timeLeft.seconds}
              label="Seconds"
            />

          </div>

        </div>

        {/* ===================================================
            PLAYLIST SECTION
        =================================================== */}

        <div className="mt-20">

          {/* Section heading */}

          <div className="mb-8 text-center">

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-[#d9a441]
              "
            >
              Listen
            </p>

            <h3
              className="
                mt-3
                text-2xl
                font-semibold
                sm:text-3xl
              "
            >
              Pujo Playlists
            </h3>

          </div>

          {/* Playlist cards */}

          <div
            className="
              grid
              gap-5
              md:grid-cols-2
            "
          >

            {pujaPlaylists.map(
              (playlist) => (
                <button
                  key={
                    playlist.title
                  }
                  type="button"
                  onClick={() =>
                    handlePlaylistClick(
                      playlist.playlistId
                    )
                  }
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-[#f4ead8]/10
                    bg-[#211813]
                    p-8
                    text-left
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#d9a441]/40
                    hover:bg-[#261b15]
                    hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                    sm:p-10
                  "
                >

                  {/* Card glow */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-16
                      -top-16
                      h-40
                      w-40
                      rounded-full
                      bg-[#d9a441]/5
                      blur-3xl
                      transition-all
                      duration-500
                      group-hover:bg-[#d9a441]/10
                    "
                  />

                  <div className="relative">

                    {/* Icon + arrow */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                      "
                    >

                      <div
                        className="
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          border-[#d9a441]/15
                          bg-[#17120f]
                          text-3xl
                        "
                      >
                        {
                          playlist.icon
                        }
                      </div>

                      <span
                        className="
                          text-2xl
                          text-[#d9a441]
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      >
                        →
                      </span>

                    </div>

                    {/* Title */}

                    <h4
                      className="
                        mt-8
                        text-2xl
                        font-semibold
                        sm:text-3xl
                      "
                    >
                      {
                        playlist.title
                      }
                    </h4>

                    {/* Description */}

                    <p
                      className="
                        mt-3
                        max-w-md
                        text-sm
                        leading-7
                        text-[#756958]
                      "
                    >
                      {
                        playlist.description
                      }
                    </p>

                    {/* Listen button */}

                    <div className="mt-7">

                      <span
                        className="
                          inline-flex
                          items-center
                          rounded-full
                          border
                          border-[#d9a441]/30
                          px-5
                          py-2.5
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.2em]
                          text-[#d9a441]
                          transition-all
                          duration-300
                          group-hover:bg-[#d9a441]
                          group-hover:text-[#17120f]
                        "
                      >
                        ▶ Listen
                      </span>

                    </div>

                  </div>

                </button>
              )
            )}

          </div>

        </div>

        {/* ===================================================
            CLOSING MESSAGE
        =================================================== */}

        <div className="mt-16 text-center">

          <p
            className="
              text-xl
              font-medium
              text-[#f4ead8]
              sm:text-2xl
            "
          >
            ঢাক বাজুক, আলো জ্বলুক,
          </p>

          <p
            className="
              mt-2
              text-xl
              font-medium
              text-[#d9a441]
              sm:text-2xl
            "
          >
            আর Adda চলুক। ❤️
          </p>

        </div>

      </div>

    </section>
  );
}


/*
 * ===========================================================
 * COUNTDOWN BOX
 * ===========================================================
 */

function CountdownBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#f4ead8]/8
        bg-[#17120f]
        px-2
        py-5
        text-center
        sm:px-5
        sm:py-6
      "
    >

      <div
        className="
          text-2xl
          font-bold
          tabular-nums
          text-[#f4ead8]
          sm:text-4xl
        "
      >
        {String(value).padStart(
          2,
          "0"
        )}
      </div>

      <div
        className="
          mt-2
          text-[8px]
          uppercase
          tracking-[0.2em]
          text-[#756958]
          sm:text-[10px]
        "
      >
        {label}
      </div>

    </div>
  );
}