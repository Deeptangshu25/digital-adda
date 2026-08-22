"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import YouTubePlayer, {
  YouTubePlayerHandle,
} from "@/components/music/YouTubePlayer";

import { playlists } from "@/data/playlists";

interface PlaylistSong {
  videoId: string;
  title: string;
  channel: string;
  position: number;
}

interface CurrentVideo {
  videoId?: string;
  title?: string;
  author?: string;
}

interface MusicPlayerProps {
  playlistId?: string;
  startIndex?: number;
  autoplay?: boolean;

  /*
   * Sends the actual currently playing YouTube
   * video back to the parent.
   */
  onCurrentVideoChange?: (
    video: CurrentVideo
  ) => void;
}

export default function MusicPlayer({
  playlistId,
  startIndex = 0,
  autoplay = false,
  onCurrentVideoChange,
}: MusicPlayerProps) {

  // =========================================================
  // PLAYLIST INFORMATION
  // =========================================================

  const normalPlaylist =
    playlists.find(
      (playlist) =>
        playlist.id === playlistId
    );

  const isSundaySuspense =
    playlistId ===
    "PLhzkzKZauxcylFfRSA9F7LFPuRZpLRwim";

  const playlistName =
    normalPlaylist?.name ??
    (isSundaySuspense
      ? "Sunday Suspense"
      : "Digital Adda");

  // =========================================================
  // PLAYER REF
  // =========================================================

  const playerRef =
    useRef<YouTubePlayerHandle>(null);

  // =========================================================
  // STATE
  // =========================================================

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(80);

  const [
    playlistSongs,
    setPlaylistSongs,
  ] = useState<PlaylistSong[]>([]);

  const [
    currentVideo,
    setCurrentVideo,
  ] = useState<CurrentVideo>({
    title: "Digital Adda",
    author: "YouTube Playlist",
  });

  // =========================================================
  // CALLBACK REF
  //
  // Prevents stale callback references.
  // =========================================================

  const currentVideoCallbackRef =
    useRef(onCurrentVideoChange);

  useEffect(() => {
    currentVideoCallbackRef.current =
      onCurrentVideoChange;
  }, [onCurrentVideoChange]);

  // =========================================================
  // LOAD PLAYLIST
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadPlaylist = async () => {
      if (!playlistId) {
        return;
      }

      try {
        console.log(
          `Loading ${playlistName} playlist...`
        );

        setPlaylistSongs([]);

        setCurrentTime(0);

        setDuration(0);

        setIsPlaying(false);

        setCurrentVideo({
          title: "Loading...",
          author: playlistName,
        });

        const response =
          await fetch(
            `/api/playlist?playlistId=${encodeURIComponent(
              playlistId
            )}`,
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          console.error(
            "Playlist API error:",
            data
          );

          throw new Error(
            data?.youtubeError
              ?.message ||
              data?.error ||
              "Failed to load playlist"
          );
        }

        if (cancelled) {
          return;
        }

        const songs =
          data.songs ?? [];

        setPlaylistSongs(songs);

        console.log(
          `${playlistName} playlist loaded:`,
          songs
        );

        if (songs.length === 0) {
          setCurrentVideo({
            title: "No songs found",
            author: playlistName,
          });

          return;
        }

        /*
         * Show the selected starting episode
         * immediately while YouTube loads.
         */

        const safeIndex =
          Math.min(
            Math.max(
              startIndex,
              0
            ),
            songs.length - 1
          );

        const selectedSong =
          songs[safeIndex];

        if (selectedSong) {
          const video = {
            videoId:
              selectedSong.videoId,

            title:
              selectedSong.title,

            author:
              selectedSong.channel,
          };

          setCurrentVideo(video);

          /*
           * Inform parent immediately.
           *
           * This keeps Sunday Suspense synchronized
           * even before the YouTube event arrives.
           */

          currentVideoCallbackRef.current?.(
            video
          );
        }

      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          `Failed to load ${playlistName} playlist:`,
          error
        );

        setPlaylistSongs([]);

        setCurrentVideo({
          title:
            "Unable to load playlist",
          author:
            playlistName,
        });
      }
    };

    loadPlaylist();

    return () => {
      cancelled = true;
    };

  }, [
    playlistId,
    playlistName,
    startIndex,
  ]);

  // =========================================================
  // PLAYING CHANGE
  // =========================================================

  const handlePlayingChange = (
    playing: boolean
  ) => {
    setIsPlaying(playing);
  };

  // =========================================================
  // TIME UPDATE
  // =========================================================

  const handleTimeUpdate = (
    time: number,
    totalDuration: number
  ) => {
    setCurrentTime(time);

    setDuration(
      totalDuration
    );
  };

  // =========================================================
  // SONG CHANGE
  //
  // This is the important synchronization point.
  // Whenever YouTube changes the actual video,
  // Sunday Suspense is informed.
  // =========================================================

  const handleSongChange = (
    video: CurrentVideo
  ) => {

    const playlistSong =
      playlistSongs.find(
        (song) =>
          song.videoId ===
          video.videoId
      );

    if (playlistSong) {

      const updatedVideo = {
        videoId:
          playlistSong.videoId,

        title:
          playlistSong.title,

        author:
          playlistSong.channel,
      };

      setCurrentVideo(
        updatedVideo
      );

      currentVideoCallbackRef.current?.(
        updatedVideo
      );

      return;
    }

    setCurrentVideo(video);

    currentVideoCallbackRef.current?.(
      video
    );
  };

  // =========================================================
  // PLAY / PAUSE
  // =========================================================

  const handlePlayPause = () => {

    if (!playerRef.current) {
      return;
    }

    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  // =========================================================
  // NEXT
  // =========================================================

  const handleNext = () => {

    playerRef.current?.next();

    setCurrentTime(0);

    setDuration(0);
  };

  // =========================================================
  // PREVIOUS
  // =========================================================

  const handlePrevious = () => {

    playerRef.current?.previous();

    setCurrentTime(0);

    setDuration(0);
  };

  // =========================================================
  // SEEK
  // =========================================================

  const handleSeek = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const newTime =
      Number(event.target.value);

    setCurrentTime(newTime);

    playerRef.current?.seekTo(
      newTime
    );
  };

  // =========================================================
  // VOLUME
  // =========================================================

  const handleVolume = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const newVolume =
      Number(event.target.value);

    setVolume(newVolume);

    playerRef.current?.setVolume(
      newVolume
    );
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (
    seconds: number
  ) => {

    if (
      !Number.isFinite(seconds)
    ) {
      return "00:00";
    }

    const minutes =
      Math.floor(
        seconds / 60
      );

    const remainingSeconds =
      Math.floor(
        seconds % 60
      );

    return `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(
        2,
        "0"
      )}`;
  };

  // =========================================================
  // PROGRESS
  // =========================================================

  const progress =
    duration > 0
      ? Math.min(
          (currentTime /
            duration) *
            100,
          100
        )
      : 0;

  // =========================================================
  // CURRENT SONG
  // =========================================================

  const currentPlaylistSong =
    playlistSongs.find(
      (song) =>
        song.videoId ===
        currentVideo.videoId
    );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section
      id="radio"
      className="border-y border-[#f4ead8]/10 bg-[#211a16]"
    >

      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-10 flex items-end justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.4em] text-[#d9a441]">
              {isSundaySuspense
                ? "Sunday Suspense"
                : "Live Radio"}
            </p>

            <h3 className="mt-3 text-4xl font-bold">
              Now Playing
            </h3>

          </div>

          <span className="hidden text-xs uppercase tracking-widest text-[#756958] sm:block">
            • broadcasting
          </span>

        </div>

        {/* =====================================================
            PLAYER
        ===================================================== */}

        <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">

          {/* ===================================================
              VINYL
          =================================================== */}

          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-[#f4ead8]/10 bg-[#17120f]">

            <div
              className={`absolute h-72 w-72 rounded-full bg-[#d9a441]/10 blur-3xl transition-opacity duration-700 ${
                isPlaying
                  ? "opacity-100"
                  : "opacity-50"
              }`}
            />

            <div
              className={`relative z-10 h-72 w-72 rounded-full border border-[#d9a441]/20 bg-[#0d0b0a] shadow-[0_0_80px_rgba(217,164,65,0.12)] ${
                isPlaying
                  ? "animate-spin"
                  : ""
              }`}
              style={{
                animationDuration:
                  "9s",
              }}
            >

              <div className="absolute inset-5 rounded-full border border-[#f4ead8]/5" />

              <div className="absolute inset-10 rounded-full border border-[#f4ead8]/5" />

              <div className="absolute inset-[60px] rounded-full border border-[#f4ead8]/5" />

              <div className="absolute inset-[75px] rounded-full border border-[#f4ead8]/5" />

              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9a441]/30 bg-[#211a16]">

                <div className="text-center">

                  <div className="text-[8px] uppercase tracking-[0.35em] text-[#d9a441]">
                    {isSundaySuspense
                      ? "Sunday"
                      : "Digital"}
                  </div>

                  <div className="mt-1 text-[8px] uppercase tracking-[0.35em] text-[#b9a98f]">
                    {isSundaySuspense
                      ? "Suspense"
                      : "Adda"}
                  </div>

                </div>

              </div>

              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9a441]" />

            </div>

            <div className="absolute bottom-7 left-0 right-0 z-30 text-center">

              <p className="text-[9px] uppercase tracking-[0.45em] text-[#756958]">
                {isPlaying
                  ? "Now Playing"
                  : playlistName}
              </p>

            </div>

            {/* =================================================
                YOUTUBE PLAYER
            ================================================= */}

            <YouTubePlayer
              ref={playerRef}
              playlistId={
                playlistId ??
                playlists[0].id
              }
              startIndex={
                startIndex
              }
              autoplay={
                autoplay
              }
              onPlayingChange={
                handlePlayingChange
              }
              onTimeUpdate={
                handleTimeUpdate
              }
              onSongChange={
                handleSongChange
              }
            />

          </div>

          {/* ===================================================
              INFORMATION
          =================================================== */}

          <div className="flex flex-col justify-center">

            <p className="text-xs uppercase tracking-[0.3em] text-[#756958]">
              Currently playing
            </p>

            <h4 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              {currentVideo.title ||
                "Digital Adda"}
            </h4>

            <p className="mt-3 text-[#b9a98f]">
              {currentVideo.author ||
                "YouTube Playlist"}
            </p>

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#756958]">

              {currentPlaylistSong
                ? `Track ${
                    currentPlaylistSong.position +
                    1
                  } of ${
                    playlistSongs.length
                  }`
                : playlistName}

            </p>

            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="mt-10">

              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={
                  handleSeek
                }
                style={{
                  background: `linear-gradient(
                    to right,
                    #d9a441 ${progress}%,
                    rgba(244,234,216,0.12) ${progress}%
                  )`,
                }}
                className="h-1 w-full cursor-pointer appearance-none rounded-full focus:outline-none"
              />

              <div className="mt-3 flex justify-between text-xs text-[#756958]">

                <span>
                  {formatTime(
                    currentTime
                  )}
                </span>

                <span>
                  {formatTime(
                    duration
                  )}
                </span>

              </div>

            </div>

            {/* =================================================
                CONTROLS
            ================================================= */}

            <div className="mt-8 flex items-center gap-4">

              <button
                type="button"
                onClick={
                  handlePrevious
                }
                aria-label="Previous song"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f4ead8]/15 text-xl transition hover:border-[#d9a441] hover:text-[#d9a441]"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={
                  handlePlayPause
                }
                aria-label={
                  isPlaying
                    ? "Pause"
                    : "Play"
                }
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d9a441] text-xl font-bold text-[#17120f] shadow-lg transition hover:scale-105"
              >
                {isPlaying
                  ? "||"
                  : "▶"}
              </button>

              <button
                type="button"
                onClick={
                  handleNext
                }
                aria-label="Next song"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f4ead8]/15 text-xl transition hover:border-[#d9a441] hover:text-[#d9a441]"
              >
                ›
              </button>

            </div>

            {/* =================================================
                VOLUME
            ================================================= */}

            <div className="mt-8 flex max-w-sm items-center gap-4">

              <span className="text-sm">
                🔊
              </span>

              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={
                  handleVolume
                }
                className="h-1 w-full cursor-pointer accent-[#d9a441]"
              />

              <span className="w-8 text-right text-xs text-[#756958]">
                {volume}
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}