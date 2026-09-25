"use client";

import { useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import PlaylistSection from "@/components/home/PlaylistSection";
import DurgaPujaSection from "@/components/home/DurgaPujaSection";
import AboutSection from "@/components/home/AboutSection";
import SundaySuspenseSection from "@/components/home/SundaySuspenseSection";

import MusicPlayer from "@/components/music/MusicPlayer";

import { playlists } from "@/data/playlists";

interface CurrentVideo {
  videoId?: string;
  title?: string;
  author?: string;
}

export default function Home() {
  // =========================================================
  // CURRENT PLAYER PLAYLIST
  // =========================================================

  const [
    selectedPlaylistId,
    setSelectedPlaylistId,
  ] = useState(playlists[0].id);

  // =========================================================
  // CURRENT SONG INDEX
  // =========================================================

  const [
    selectedSongIndex,
    setSelectedSongIndex,
  ] = useState(0);

  // =========================================================
  // CURRENT VIDEO ID
  //
  // Keeps Sunday Suspense synchronized
  // with the actual YouTube player.
  // =========================================================

  const [
    currentVideoId,
    setCurrentVideoId,
  ] = useState<string | undefined>(
    undefined
  );

  // =========================================================
  // AUTOPLAY REQUEST
  // =========================================================

  const [
    shouldAutoplay,
    setShouldAutoplay,
  ] = useState(false);

  // =========================================================
  // NORMAL MUSIC PLAYLIST
  // =========================================================

  const handlePlaylistSelect = (
    playlist: (typeof playlists)[number]
  ) => {
    setSelectedPlaylistId(
      playlist.id
    );

    setSelectedSongIndex(0);

    setCurrentVideoId(undefined);

    // User explicitly clicked Listen.
    setShouldAutoplay(true);

    setTimeout(() => {
      document
        .getElementById("radio")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  // =========================================================
  // DURGA PUJA PLAYLIST
  //
  // Mahalaya:
  // PLdmrlJOn6maQ
  //
  // Pujo Classics:
  // PLfaE80CWR08s
  // =========================================================

  const handleDurgaPujaSelect = (
    playlistId: string
  ) => {
    setSelectedPlaylistId(
      playlistId
    );

    // Always start from first song.
    setSelectedSongIndex(0);

    // Clear old video while new playlist loads.
    setCurrentVideoId(undefined);

    // User explicitly selected a Pujo playlist.
    setShouldAutoplay(true);

    // Scroll to Music Player.
    setTimeout(() => {
      document
        .getElementById("radio")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  // =========================================================
  // SUNDAY SUSPENSE EPISODE SELECT
  // =========================================================

  const handleSundaySuspenseSelect = (
    playlistId: string,
    episodeIndex: number
  ) => {
    setSelectedPlaylistId(
      playlistId
    );

    setSelectedSongIndex(
      episodeIndex
    );

    // Clear old video while the
    // newly selected episode loads.
    setCurrentVideoId(undefined);

    // User explicitly selected an episode.
    setShouldAutoplay(true);

    setTimeout(() => {
      document
        .getElementById("radio")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  // =========================================================
  // PLAYER VIDEO CHANGE
  //
  // Called whenever YouTube changes
  // the currently playing video.
  // =========================================================

  const handleCurrentVideoChange = (
    video: CurrentVideo
  ) => {
    if (!video.videoId) {
      return;
    }

    setCurrentVideoId(
      video.videoId
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="min-h-screen bg-[#17120f] text-[#f4ead8]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <Hero />

      {/* =====================================================
          MUSIC PLAYER
          
          key forces a fresh MusicPlayer instance when
          the user selects a different playlist or episode.
      ===================================================== */}

      <MusicPlayer
        key={`${selectedPlaylistId}-${selectedSongIndex}`}
        playlistId={
          selectedPlaylistId
        }
        startIndex={
          selectedSongIndex
        }
        autoplay={
          shouldAutoplay
        }
        onCurrentVideoChange={
          handleCurrentVideoChange
        }
      />

      {/* =====================================================
          TONIGHT'S ADDA
      ===================================================== */}

      <PlaylistSection
        onSelectPlaylist={
          handlePlaylistSelect
        }
      />

      {/* =====================================================
          DURGA PUJA
          
          Contains:
          - Countdown
          - Mahalaya
          - Pujo Classics
          
          Clicking either playlist changes the
          main MusicPlayer.
      ===================================================== */}

      <DurgaPujaSection
        onSelectPlaylist={
          handleDurgaPujaSelect
        }
      />

      {/* =====================================================
          SUNDAY SUSPENSE
          
          currentVideoId keeps the featured episode
          and selected card synchronized with MusicPlayer.
      ===================================================== */}

      <SundaySuspenseSection
        currentVideoId={
          currentVideoId
        }
        onSelectEpisode={
          handleSundaySuspenseSelect
        }
      />

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <AboutSection />

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </main>
  );
}