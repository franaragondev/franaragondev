export default function AppHero() {
  return (
    <section
      id="home"
      className="relative w-full min-h-[100vh] overflow-hidden"
    >
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay opcional para contraste */}
      <div className="absolute inset-0 bg-black/20" />
    </section>
  );
}
