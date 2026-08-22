"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

const SUNDAY_SUSPENSE_PLAYLIST =
  "PLhzkzKZauxcylFfRSA9F7LFPuRZpLRwim";

interface Episode {
  videoId: string;
  title: string;
  channel: string;
  position: number;
}

interface SundaySuspenseSectionProps {
  onSelectEpisode?: (
    playlistId: string,
    episodeIndex: number
  ) => void;

  /*
   * Actual video currently playing in MusicPlayer.
   */
  currentVideoId?: string;
}

export default function SundaySuspenseSection({
  onSelectEpisode,
  currentVideoId,
}: SundaySuspenseSectionProps) {

  // =========================================================
  // EPISODES
  // =========================================================

  const [episodes, setEpisodes] =
    useState<Episode[]>([]);

  const [
    selectedEpisode,
    setSelectedEpisode,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // CAROUSEL REF
  // =========================================================

  const episodeScrollRef =
    useRef<HTMLDivElement | null>(null);

  // =========================================================
  // HOLD-TO-SCROLL
  // =========================================================

  const scrollAnimationRef =
    useRef<number | null>(null);

  const scrollDirectionRef =
    useRef<
      "left" | "right" | null
    >(null);

  const isHoldingRef =
    useRef(false);

  // =========================================================
  // LOAD SUNDAY SUSPENSE PLAYLIST
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadEpisodes = async () => {

      try {
        setLoading(true);

        const response =
          await fetch(
            `/api/playlist?playlistId=${encodeURIComponent(
              SUNDAY_SUSPENSE_PLAYLIST
            )}`,
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to load Sunday Suspense"
          );
        }

        if (cancelled) {
          return;
        }

        const loadedEpisodes =
          data.songs ?? [];

        setEpisodes(
          loadedEpisodes
        );

      } catch (error) {

        console.error(
          "Failed to load Sunday Suspense:",
          error
        );

        if (!cancelled) {
          setEpisodes([]);
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }
    };

    loadEpisodes();

    return () => {
      cancelled = true;
    };

  }, []);

  // =========================================================
  // SYNCHRONIZE WITH MUSIC PLAYER
  //
  // THIS FIXES THE ISSUE:
  //
  // MusicPlayer → currentVideoId
  //              ↓
  // find matching episode
  //              ↓
  // selectedEpisode updates
  //              ↓
  // Featured Episode updates
  //              ↓
  // SELECTED card updates
  // =========================================================

  useEffect(() => {

    if (
      !currentVideoId ||
      episodes.length === 0
    ) {
      return;
    }

    const playingIndex =
      episodes.findIndex(
        (episode) =>
          episode.videoId ===
          currentVideoId
      );

    if (
      playingIndex === -1
    ) {
      return;
    }

    setSelectedEpisode(
      playingIndex
    );

  }, [
    currentVideoId,
    episodes,
  ]);

  // =========================================================
  // CURRENT EPISODE
  // =========================================================

  const currentEpisode =
    episodes[selectedEpisode];

  // =========================================================
  // STOP HOLD SCROLL
  // =========================================================

  const stopScrolling = () => {

    isHoldingRef.current =
      false;

    scrollDirectionRef.current =
      null;

    if (
      scrollAnimationRef.current !==
      null
    ) {
      cancelAnimationFrame(
        scrollAnimationRef.current
      );

      scrollAnimationRef.current =
        null;
    }
  };

  // =========================================================
  // CONTINUOUS SCROLL
  // =========================================================

  const performContinuousScroll =
    () => {

      if (
        !isHoldingRef.current
      ) {
        return;
      }

      const container =
        episodeScrollRef.current;

      const direction =
        scrollDirectionRef.current;

      if (
        !container ||
        !direction
      ) {
        return;
      }

      const scrollSpeed = 8;

      container.scrollLeft +=
        direction === "right"
          ? scrollSpeed
          : -scrollSpeed;

      scrollAnimationRef.current =
        requestAnimationFrame(
          performContinuousScroll
        );
    };

  // =========================================================
  // START HOLD SCROLL
  // =========================================================

  const startScrolling = (
    direction:
      | "left"
      | "right"
  ) => {

    if (
      isHoldingRef.current
    ) {
      return;
    }

    isHoldingRef.current =
      true;

    scrollDirectionRef.current =
      direction;

    performContinuousScroll();
  };

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {

    return () => {
      stopScrolling();
    };

  }, []);

  // =========================================================
  // NORMAL CLICK SCROLL
  // =========================================================

  const clickScroll = (
    direction:
      | "left"
      | "right"
  ) => {

    const container =
      episodeScrollRef.current;

    if (!container) {
      return;
    }

    container.scrollBy({
      left:
        direction === "right"
          ? 320
          : -320,
      behavior: "smooth",
    });
  };

  // =========================================================
  // LISTEN TO CURRENT EPISODE
  // =========================================================

  const handleListen = () => {

    if (!currentEpisode) {
      return;
    }

    onSelectEpisode?.(
      SUNDAY_SUSPENSE_PLAYLIST,
      selectedEpisode
    );
  };

  // =========================================================
  // SELECT EPISODE
  // =========================================================

  const handleEpisodeSelect = (
    index: number
  ) => {

    /*
     * Immediately update the UI.
     */

    setSelectedEpisode(index);

    /*
     * Tell parent to change MusicPlayer.
     */

    onSelectEpisode?.(
      SUNDAY_SUSPENSE_PLAYLIST,
      index
    );
  };

  // =========================================================
  // POINTER DOWN
  // =========================================================

  const handlePointerDown = (
    direction:
      | "left"
      | "right"
  ) => {

    startScrolling(
      direction
    );
  };

  // =========================================================
  // POINTER UP
  // =========================================================

  const handlePointerUp = (
    direction:
      | "left"
      | "right"
  ) => {

    stopScrolling();

    clickScroll(direction);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section
      id="sunday-suspense"
      className="relative overflow-hidden bg-[#0f0c0a] px-6 py-28 text-[#f4ead8]"
    >

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9a441]/[0.035] blur-3xl" />

        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#d9a441]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#d9a441]/25 to-transparent" />

      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="text-center">

          <p className="text-xs uppercase tracking-[0.55em] text-[#d9a441]">
            Digital Adda presents
          </p>

          <h2 className="mt-5 text-5xl font-black uppercase tracking-[0.08em] sm:text-6xl lg:text-7xl">
            Sunday Suspense
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#756958] sm:text-base">
            Stories that keep you awake.
          </p>

        </div>

        {/* =====================================================
            FEATURED EPISODE
        ===================================================== */}

        <div className="mx-auto mt-16 max-w-6xl">

          <div className="overflow-hidden rounded-[2rem] border border-[#f4ead8]/10 bg-[#17120f]">

            {/* GOLD LINE */}

            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d9a441]/60 to-transparent" />

            <div className="grid min-h-[450px] md:grid-cols-[0.9fr_1.1fr]">

              {/* =================================================
                  LEFT SIDE
              ================================================= */}

              <div className="relative flex items-center justify-center overflow-hidden border-b border-[#f4ead8]/10 p-10 md:border-b-0 md:border-r">

                <div className="absolute h-80 w-80 rounded-full bg-[#d9a441]/5 blur-3xl" />

                {/* RECORD */}

                <div className="relative h-72 w-72 rounded-full border border-[#d9a441]/20 bg-[#090807] shadow-[0_0_100px_rgba(217,164,65,0.08)]">

                  {/* RECORD GROOVES */}

                  <div className="absolute inset-5 rounded-full border border-[#f4ead8]/5" />

                  <div className="absolute inset-10 rounded-full border border-[#f4ead8]/5" />

                  <div className="absolute inset-[60px] rounded-full border border-[#f4ead8]/5" />

                  <div className="absolute inset-[78px] rounded-full border border-[#f4ead8]/5" />

                  <div className="absolute inset-[92px] rounded-full border border-[#f4ead8]/5" />

                  {/* CENTRE LABEL */}

                  <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9a441]/30 bg-[#211a16]">

                    <div className="text-center">

                      <p className="text-[9px] uppercase tracking-[0.35em] text-[#d9a441]">
                        Sunday
                      </p>

                      <p className="mt-2 text-[9px] uppercase tracking-[0.35em] text-[#b9a98f]">
                        Suspense
                      </p>

                    </div>

                  </div>

                  {/* RECORD HOLE */}

                  <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9a441]" />

                </div>

              </div>

              {/* =================================================
                  RIGHT SIDE
              ================================================= */}

              <div className="flex flex-col justify-center p-10 lg:p-16">

                <div className="flex items-center gap-4">

                  <span className="text-xs uppercase tracking-[0.3em] text-[#d9a441]">
                    Featured Episode
                  </span>

                  <span className="h-px flex-1 bg-[#f4ead8]/10" />

                </div>

                {/* LOADING */}

                {loading ? (

                  <div className="mt-10">

                    <div className="h-8 w-3/4 animate-pulse rounded bg-[#f4ead8]/5" />

                    <div className="mt-5 h-4 w-1/2 animate-pulse rounded bg-[#f4ead8]/5" />

                    <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-[#f4ead8]/5" />

                  </div>

                ) : currentEpisode ? (

                  <>

                    <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[#756958]">
                      Episode{" "}
                      {String(
                        selectedEpisode + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </p>

                    <h3 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                      {currentEpisode.title}
                    </h3>

                    <p className="mt-5 text-sm text-[#756958]">
                      {currentEpisode.channel}
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleListen
                      }
                      className="mt-10 flex w-fit items-center gap-4 rounded-full bg-[#d9a441] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#17120f] transition hover:scale-105 hover:bg-[#e4b557]"
                    >

                      <span className="text-base">
                        ▶
                      </span>

                      Listen Now

                    </button>

                  </>

                ) : (

                  <p className="mt-10 text-[#756958]">
                    No episodes available.
                  </p>

                )}

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            EPISODES
        ===================================================== */}

        {!loading &&
          episodes.length > 0 && (

            <div className="mx-auto mt-14 max-w-6xl">

              {/* =================================================
                  EPISODE HEADER
              ================================================= */}

              <div className="mb-6 flex items-center justify-between">

                <p className="text-xs uppercase tracking-[0.35em] text-[#756958]">
                  Episodes
                </p>

                <p className="text-xs text-[#756958]">
                  {episodes.length} stories
                </p>

              </div>

              {/* =================================================
                  CAROUSEL
              ================================================= */}

              <div className="relative">

                {/* =================================================
                    LEFT ARROW
                ================================================= */}

                <button
                  type="button"
                  aria-label="Previous episodes"
                  onPointerDown={(
                    event
                  ) => {

                    event.currentTarget.setPointerCapture(
                      event.pointerId
                    );

                    handlePointerDown(
                      "left"
                    );

                  }}
                  onPointerUp={() => {
                    handlePointerUp(
                      "left"
                    );
                  }}
                  onPointerCancel={
                    stopScrolling
                  }
                  onPointerLeave={
                    stopScrolling
                  }
                  className="absolute left-0 top-1/2 z-30 flex h-12 w-12 -translate-x-5 -translate-y-1/2 touch-none select-none items-center justify-center rounded-full border border-[#f4ead8]/15 bg-[#17120f] text-2xl text-[#f4ead8] shadow-xl transition hover:border-[#d9a441] hover:bg-[#211a16] hover:text-[#d9a441] active:scale-90"
                >
                  ‹
                </button>

                {/* =================================================
                    EPISODE CARDS
                ================================================= */}

                <div
                  ref={
                    episodeScrollRef
                  }
                  id="sunday-suspense-episodes"
                  className="flex gap-4 overflow-x-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >

                  {episodes.map(
                    (
                      episode,
                      index
                    ) => {

                      const active =
                        selectedEpisode ===
                        index;

                      return (

                        <button
                          key={
                            episode.videoId
                          }
                          type="button"
                          onClick={() =>
                            handleEpisodeSelect(
                              index
                            )
                          }
                          className={`group min-w-[260px] rounded-2xl border p-6 text-left transition duration-300 ${
                            active
                              ? "border-[#d9a441]/50 bg-[#211a16]"
                              : "border-[#f4ead8]/10 bg-[#17120f] hover:-translate-y-1 hover:border-[#d9a441]/30"
                          }`}
                        >

                          {/* CARD HEADER */}

                          <div className="flex items-center justify-between">

                            <span className="text-xs tracking-[0.25em] text-[#d9a441]">
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            {active && (
                              <span className="text-[9px] uppercase tracking-[0.2em] text-[#d9a441]">
                                Selected
                              </span>
                            )}

                          </div>

                          {/* TITLE */}

                          <p className="mt-5 line-clamp-3 text-sm font-semibold leading-6">
                            {episode.title}
                          </p>

                          {/* CHANNEL */}

                          <p className="mt-4 text-xs text-[#756958]">
                            {episode.channel}
                          </p>

                        </button>

                      );

                    }
                  )}

                </div>

                {/* =================================================
                    RIGHT ARROW
                ================================================= */}

                <button
                  type="button"
                  aria-label="Next episodes"
                  onPointerDown={(
                    event
                  ) => {

                    event.currentTarget.setPointerCapture(
                      event.pointerId
                    );

                    handlePointerDown(
                      "right"
                    );

                  }}
                  onPointerUp={() => {
                    handlePointerUp(
                      "right"
                    );
                  }}
                  onPointerCancel={
                    stopScrolling
                  }
                  onPointerLeave={
                    stopScrolling
                  }
                  className="absolute right-0 top-1/2 z-30 flex h-12 w-12 translate-x-5 -translate-y-1/2 touch-none select-none items-center justify-center rounded-full border border-[#f4ead8]/15 bg-[#17120f] text-2xl text-[#f4ead8] shadow-xl transition hover:border-[#d9a441] hover:bg-[#211a16] hover:text-[#d9a441] active:scale-90"
                >
                  ›
                </button>

              </div>

            </div>

          )}

        {/* =====================================================
            FOOTER MESSAGE
        ===================================================== */}

        <div className="mt-16 text-center">

          <p className="text-xs uppercase tracking-[0.4em] text-[#756958]">
            Turn down the lights. Turn up the story.
          </p>

        </div>

      </div>

    </section>
  );
}