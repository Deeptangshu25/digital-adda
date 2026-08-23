"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export interface YouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  playVideoAt: (index: number) => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoData: () => any;
}

interface YouTubePlayerProps {
  playlistId: string;

  startIndex?: number;

  autoplay?: boolean;

  onPlayingChange?: (
    playing: boolean
  ) => void;

  onTimeUpdate?: (
    currentTime: number,
    duration: number
  ) => void;

  onSongChange?: (
    video: any
  ) => void;
}

declare global {
  interface Window {
    YT: any;
  }
}

const YouTubePlayer = forwardRef<
  YouTubePlayerHandle,
  YouTubePlayerProps
>(function YouTubePlayer(
  {
    playlistId,
    startIndex = 0,
    autoplay = false,
    onPlayingChange,
    onTimeUpdate,
    onSongChange,
  },
  ref
) {

  // =========================================================
  // PLAYER
  // =========================================================

  const playerRef =
    useRef<any>(null);

  // =========================================================
  // CALLBACK REFS
  // =========================================================

  const playingCallbackRef =
    useRef(onPlayingChange);

  const timeCallbackRef =
    useRef(onTimeUpdate);

  const songCallbackRef =
    useRef(onSongChange);

  useEffect(() => {
    playingCallbackRef.current =
      onPlayingChange;
  }, [onPlayingChange]);

  useEffect(() => {
    timeCallbackRef.current =
      onTimeUpdate;
  }, [onTimeUpdate]);

  useEffect(() => {
    songCallbackRef.current =
      onSongChange;
  }, [onSongChange]);

  // =========================================================
  // TIMERS
  // =========================================================

  const progressIntervalRef =
    useRef<ReturnType<
      typeof setInterval
    > | null>(null);

  const skipTimeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const autoplayTimeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  // =========================================================
  // SKIP COUNT
  // =========================================================

  const skipAttemptsRef =
    useRef(0);

  // =========================================================
  // STOP PROGRESS
  // =========================================================

  const stopProgressTracking =
    () => {

      if (
        progressIntervalRef.current
      ) {

        clearInterval(
          progressIntervalRef.current
        );

        progressIntervalRef.current =
          null;
      }
    };

  // =========================================================
  // START PROGRESS
  // =========================================================

  const startProgressTracking =
    () => {

      stopProgressTracking();

      progressIntervalRef.current =
        setInterval(() => {

          const player =
            playerRef.current;

          if (!player) return;

          try {

            const currentTime =
              player.getCurrentTime?.() ||
              0;

            const duration =
              player.getDuration?.() ||
              0;

            timeCallbackRef.current?.(
              currentTime,
              duration
            );

          } catch {
            // Ignore temporary player errors.
          }

        }, 500);
    };

  // =========================================================
  // SEND CURRENT VIDEO
  // =========================================================

  const sendVideoData = () => {

    const player =
      playerRef.current;

    if (!player) return;

    try {

      const videoData =
        player.getVideoData?.();

      if (!videoData) return;

      if (!videoData.video_id) {
        return;
      }

      songCallbackRef.current?.({
        videoId:
          videoData.video_id,

        title:
          videoData.title ||
          "Unknown Song",

        author:
          videoData.author ||
          "YouTube",
      });

    } catch (error) {

      console.warn(
        "Unable to get YouTube video data:",
        error
      );
    }
  };

  // =========================================================
  // SKIP UNPLAYABLE VIDEO
  // =========================================================

  const skipUnplayableVideo = (
    errorCode: number
  ) => {

    if (!playerRef.current) {
      return;
    }

    if (
      skipAttemptsRef.current >= 58
    ) {

      console.warn(
        "Unable to find a playable video in the playlist."
      );

      playingCallbackRef.current?.(
        false
      );

      stopProgressTracking();

      return;
    }

    skipAttemptsRef.current += 1;

    console.warn(
      `Video cannot be played (error ${errorCode}). Trying next playable song...`
    );

    if (
      skipTimeoutRef.current
    ) {

      clearTimeout(
        skipTimeoutRef.current
      );
    }

    skipTimeoutRef.current =
      setTimeout(() => {

        const player =
          playerRef.current;

        if (!player) return;

        try {

          player.nextVideo?.();

        } catch (error) {

          console.warn(
            "Could not move to next video:",
            error
          );
        }

      }, 400);
  };

  // =========================================================
  // PUBLIC API
  // =========================================================

  useImperativeHandle(
    ref,
    () => ({
      play() {
        playerRef.current?.playVideo?.();
      },

      pause() {
        playerRef.current?.pauseVideo?.();
      },

      next() {
        skipAttemptsRef.current = 0;

        playerRef.current?.nextVideo?.();
      },

      previous() {
        skipAttemptsRef.current = 0;

        playerRef.current?.previousVideo?.();
      },

      playVideoAt(index: number) {
        skipAttemptsRef.current = 0;

        playerRef.current?.playVideoAt?.(
          index
        );
      },

      seekTo(seconds: number) {
        playerRef.current?.seekTo?.(
          seconds,
          true
        );
      },

      setVolume(volume: number) {
        playerRef.current?.setVolume?.(
          volume
        );
      },

      getCurrentTime() {
        return (
          playerRef.current?.getCurrentTime?.() ||
          0
        );
      },

      getDuration() {
        return (
          playerRef.current?.getDuration?.() ||
          0
        );
      },

      getVideoData() {
        return (
          playerRef.current?.getVideoData?.() ||
          {}
        );
      },
    }),
    []
  );

  // =========================================================
  // CREATE PLAYER
  // =========================================================

  useEffect(() => {

    let mounted = true;

    const createPlayer = () => {

      if (!mounted) return;

      if (
        !window.YT ||
        !window.YT.Player
      ) {
        return;
      }

      // ---------------------------------------------
      // DESTROY OLD PLAYER
      // ---------------------------------------------

      if (playerRef.current) {

        try {
          playerRef.current.destroy();
        } catch {
          // Ignore.
        }

        playerRef.current =
          null;
      }

      // ---------------------------------------------
      // RESET
      // ---------------------------------------------

      skipAttemptsRef.current = 0;

      // ---------------------------------------------
      // CREATE
      // ---------------------------------------------

      playerRef.current =
        new window.YT.Player(
          "youtube-player",
          {
            width: "1",
            height: "1",

            playerVars: {

              listType:
                "playlist",

              list:
                playlistId,

              /*
               * YouTube playlist indexes are
               * zero-based.
               */

              index:
                Math.max(
                  0,
                  startIndex
                ),

              autoplay:
                autoplay
                  ? 1
                  : 0,

              controls: 0,

              playsinline: 1,

              rel: 0,

              modestbranding: 1,

              iv_load_policy: 3,

              origin:
                window.location.origin,
            },

            events: {

              // =========================================
              // READY
              // =========================================

              onReady: () => {

                if (!mounted) {
                  return;
                }

                console.log(
                  "YouTube playlist player ready"
                );

                const player =
                  playerRef.current;

                if (!player) {
                  return;
                }

                try {
                  player.setVolume(80);
                } catch {
                  // Ignore.
                }

                /*
                 * Explicitly select the requested
                 * playlist item.
                 */

                if (
                  startIndex > 0
                ) {

                  try {

                    player.playVideoAt?.(
                      startIndex
                    );

                  } catch (error) {

                    console.warn(
                      "Unable to select requested episode:",
                      error
                    );
                  }
                }

                // -----------------------------------------
                // SONG DATA
                // -----------------------------------------

                setTimeout(() => {

                  if (!mounted) {
                    return;
                  }

                  sendVideoData();

                  try {

                    timeCallbackRef.current?.(
                      player.getCurrentTime?.() ||
                        0,

                      player.getDuration?.() ||
                        0
                    );

                  } catch {
                    // Ignore.
                  }

                }, 700);

                // -----------------------------------------
                // AUTOPLAY
                // -----------------------------------------

                if (autoplay) {

                  console.log(
                    `Starting playlist at index ${startIndex}...`
                  );

                  autoplayTimeoutRef.current =
                    setTimeout(() => {

                      if (!mounted) {
                        return;
                      }

                      try {

                        if (
                          startIndex > 0
                        ) {

                          player.playVideoAt?.(
                            startIndex
                          );

                        } else {

                          player.playVideo?.();

                        }

                      } catch (error) {

                        console.warn(
                          "Unable to autoplay:",
                          error
                        );
                      }

                    }, 900);
                }
              },

              // =========================================
              // STATE CHANGE
              // =========================================

              onStateChange: (
                event: any
              ) => {

                if (!mounted) {
                  return;
                }

                /*
                 * 0 = ENDED
                 * 1 = PLAYING
                 * 2 = PAUSED
                 * 3 = BUFFERING
                 * 5 = CUED
                 */

                // ---------------------------------------
                // PLAYING
                // ---------------------------------------

                if (
                  event.data === 1
                ) {

                  console.log(
                    "YouTube: PLAYING"
                  );

                  skipAttemptsRef.current = 0;

                  playingCallbackRef.current?.(
                    true
                  );

                  startProgressTracking();

                  setTimeout(() => {

                    if (!mounted) {
                      return;
                    }

                    sendVideoData();

                  }, 300);
                }

                // ---------------------------------------
                // PAUSED
                // ---------------------------------------

                if (
                  event.data === 2
                ) {

                  console.log(
                    "YouTube: PAUSED"
                  );

                  playingCallbackRef.current?.(
                    false
                  );

                  stopProgressTracking();

                  sendVideoData();
                }

                // ---------------------------------------
                // ENDED
                // ---------------------------------------

                if (
                  event.data === 0
                ) {

                  console.log(
                    "YouTube: SONG ENDED"
                  );

                  playingCallbackRef.current?.(
                    false
                  );

                  stopProgressTracking();

                  setTimeout(() => {

                    if (!mounted) {
                      return;
                    }

                    sendVideoData();

                  }, 300);
                }

                // ---------------------------------------
                // BUFFERING
                // ---------------------------------------

                if (
                  event.data === 3
                ) {

                  console.log(
                    "YouTube: BUFFERING"
                  );
                }

                // ---------------------------------------
                // CUED
                // ---------------------------------------

                if (
                  event.data === 5
                ) {

                  console.log(
                    "YouTube: VIDEO CUED"
                  );

                  setTimeout(() => {

                    if (!mounted) {
                      return;
                    }

                    sendVideoData();

                  }, 400);

                  if (autoplay) {

                    setTimeout(() => {

                      if (!mounted) {
                        return;
                      }

                      try {

                        if (
                          startIndex > 0
                        ) {

                          playerRef.current?.playVideoAt?.(
                            startIndex
                          );

                        } else {

                          playerRef.current?.playVideo?.();

                        }

                      } catch {
                        // Ignore.
                      }

                    }, 700);
                  }
                }
              },

              // =========================================
              // ERROR
              // =========================================

              onError: (
                event: any
              ) => {

                if (!mounted) {
                  return;
                }

                const errorCode =
                  event?.data;

                console.warn(
                  "YouTube playback issue:",
                  errorCode
                );

                /*
                 * 2   = invalid parameter
                 * 5   = HTML5 player error
                 * 100 = video removed/private
                 * 101 = embedding not allowed
                 * 150 = embedding not allowed
                 */

                const unplayableErrors =
                  [
                    2,
                    5,
                    100,
                    101,
                    150,
                  ];

                if (
                  !unplayableErrors.includes(
                    errorCode
                  )
                ) {
                  return;
                }

                playingCallbackRef.current?.(
                  false
                );

                stopProgressTracking();

                sendVideoData();

                /*
                 * Automatically move to the
                 * next playable song.
                 */

                skipUnplayableVideo(
                  errorCode
                );
              },

              // =========================================
              // AUTOPLAY BLOCKED
              // =========================================

              onAutoplayBlocked: () => {

                console.warn(
                  "YouTube autoplay was blocked by the browser."
                );

                /*
                 * We don't repeatedly force
                 * playback here because browsers
                 * can reject scripted autoplay.
                 *
                 * The main Play button remains
                 * available.
                 */
              },
            },
          }
        );
    };

    // =========================================================
    // LOAD YOUTUBE API
    // =========================================================

    const loadYouTubeAPI = () => {

      if (
        window.YT &&
        window.YT.Player
      ) {

        createPlayer();

        return;
      }

      const existingScript =
        document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]'
        );

      if (!existingScript) {

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://www.youtube.com/iframe_api";

        script.async = true;

        document.body.appendChild(
          script
        );
      }

      window.onYouTubeIframeAPIReady =
        () => {

          if (!mounted) {
            return;
          }

          createPlayer();
        };
    };

    loadYouTubeAPI();

    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {

      mounted = false;

      stopProgressTracking();

      if (
        skipTimeoutRef.current
      ) {

        clearTimeout(
          skipTimeoutRef.current
        );

        skipTimeoutRef.current =
          null;
      }

      if (
        autoplayTimeoutRef.current
      ) {

        clearTimeout(
          autoplayTimeoutRef.current
        );

        autoplayTimeoutRef.current =
          null;
      }

      if (playerRef.current) {

        try {
          playerRef.current.destroy();
        } catch {
          // Ignore.
        }

        playerRef.current =
          null;
      }
    };

  }, [
    playlistId,
    startIndex,
    autoplay,
  ]);

  // =========================================================
  // HIDDEN PLAYER
  // =========================================================

  return (
    <div
      className="absolute left-0 top-0 h-px w-px overflow-hidden opacity-0 pointer-events-none"
      aria-hidden="true"
    >
      <div
        id="youtube-player"
        className="h-px w-px"
      />
    </div>
  );
});

YouTubePlayer.displayName =
  "YouTubePlayer";

export default YouTubePlayer;