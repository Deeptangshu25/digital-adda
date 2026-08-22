export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24"
    >
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="absolute left-[-150px] top-[20%] h-[400px] w-[400px] rounded-full bg-[#7d3f24]/20 blur-3xl" />

      <div className="absolute bottom-[-150px] right-[-100px] h-[450px] w-[450px] rounded-full bg-[#d9a441]/10 blur-3xl" />

      {/* =====================================================
          HERO CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-5xl text-center">

        {/* SMALL HEADING */}

        <p className="mb-6 text-xs uppercase tracking-[0.5em] text-[#d9a441]">
          Open all hours
        </p>

        {/* MAIN HEADING */}

        <h2 className="text-6xl font-black leading-[0.9] tracking-tight sm:text-8xl md:text-9xl">
          WELCOME
          <br />

          <span className="font-serif italic text-[#d9a441]">
            TO THE ADDA
          </span>
        </h2>

        {/* DESCRIPTION */}

        <p className="mx-auto mt-10 max-w-xl text-base leading-7 text-[#b9a98f] sm:text-lg">
          A little corner of the internet for songs,
          stories, late-night conversations and the
          nostalgia we never really left behind.
        </p>

        {/* =====================================================
            HERO BUTTONS
        ===================================================== */}

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

          {/* START LISTENING */}

          <a
            href="#radio"
            className="rounded-full bg-[#d9a441] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[#17120f] transition hover:scale-105"
          >
            Start Listening
          </a>

          {/* EXPLORE BENGALI STORIES */}

          <a
            href="#sunday-suspense"
            className="rounded-full border border-[#f4ead8]/20 px-8 py-4 text-sm uppercase tracking-widest text-[#f4ead8] transition hover:border-[#d9a441] hover:bg-[#d9a441] hover:text-[#17120f]"
          >
            Explore Bengali Stories
          </a>

        </div>

        {/* =====================================================
            CASSETTE
        ===================================================== */}

        <div className="mx-auto mt-20 flex h-24 w-40 rotate-[-4deg] items-center justify-center rounded-lg border border-[#f4ead8]/20 bg-[#211a16] shadow-2xl">

          <div className="flex items-center gap-5">

            <div className="h-9 w-9 rounded-full border-4 border-[#b9a98f] bg-[#17120f]" />

            <div className="h-9 w-9 rounded-full border-4 border-[#b9a98f] bg-[#17120f]" />

          </div>

        </div>

        {/* SMALL FOOTER TEXT */}

        <p className="mt-5 text-[10px] uppercase tracking-[0.4em] text-[#756958]">
          press play & stay awhile
        </p>

      </div>
    </section>
  );
}