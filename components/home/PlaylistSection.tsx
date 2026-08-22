"use client";

import { playlists } from "@/data/playlists";

interface PlaylistSectionProps {
  onSelectPlaylist?: (
    playlist: (typeof playlists)[number]
  ) => void;
}

export default function PlaylistSection({
  onSelectPlaylist,
}: PlaylistSectionProps) {
  return (
    <section
      id="playlists"
      className="mx-auto max-w-7xl px-6 py-24"
    >
      {/* HEADER */}

      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.4em] text-[#d9a441]">
          Choose your mood
        </p>

        <h3 className="mt-3 text-4xl font-bold sm:text-5xl">
          Tonight's Ada
        </h3>
      </div>

      {/* PLAYLIST CARDS */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {playlists.map((playlist, index) => {
          const symbols = [
            "☾",
            "☕",
            "♡",
            "✦",
          ];

          return (
            <div
              key={playlist.id}
              className="group cursor-pointer rounded-2xl border border-[#f4ead8]/10 bg-[#211a16] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#d9a441]/40"
            >
              {/* SYMBOL */}

              <div className="flex h-32 items-center justify-center rounded-xl bg-[#17120f] text-5xl text-[#d9a441] transition duration-500 group-hover:scale-[1.02]">
                {symbols[index]}
              </div>

              {/* TITLE */}

              <h4 className="mt-6 text-2xl font-bold">
                {playlist.name}
              </h4>

              {/* DESCRIPTION */}

              <p className="mt-2 text-sm leading-6 text-[#756958]">
                {playlist.description}
              </p>

              {/* LISTEN BUTTON */}

              <button
                type="button"
                onClick={() =>
                  onSelectPlaylist?.(
                    playlist
                  )
                }
                className="mt-6 text-xs uppercase tracking-widest text-[#d9a441] transition hover:text-[#f4ead8]"
              >
                Listen →
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}