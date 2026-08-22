export default function Footer() {
  return (
    <footer className="border-t border-[#f4ead8]/10 bg-[#17120f]">
      <div className="mx-auto max-w-7xl px-6 py-8">

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

          {/* BRAND */}

          <p className="text-[10px] uppercase tracking-[0.35em] text-[#756958]">
            Digital Adda
          </p>

          {/* COPYRIGHT */}

          <p className="text-center text-xs text-[#756958]">
            © {new Date().getFullYear()} Digital Adda. All rights reserved.
          </p>

          {/* TAGLINE */}

          <p className="text-[10px] uppercase tracking-[0.25em] text-[#756958]">
            Music · Stories · Nostalgia
          </p>

        </div>

      </div>
    </footer>
  );
}