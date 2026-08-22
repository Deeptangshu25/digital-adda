export default function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-4xl px-6 py-28 text-center"
    >

      <p className="text-xs uppercase tracking-[0.4em] text-[#d9a441]">
        About the Adda
      </p>

      <h3 className="mt-6 text-4xl font-bold sm:text-6xl">
        Not a radio.
        <br />
        Not a playlist.
        <br />

        <span className="font-serif italic text-[#d9a441]">
          A place.
        </span>
      </h3>

      <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-[#b9a98f]">
        Digital Adda is a little corner of the internet built
        around the simple idea that music can create a place.
        Come in, pick a mood, press play and stay as long as
        you want.
      </p>

    </section>
  );
}