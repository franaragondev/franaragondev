export default function Head() {
  return (
    <>
      <link
        rel="preload"
        as="video"
        href="/hero-bg.webm"
        type="video/webm"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        as="video"
        href="/hero-bg.mp4"
        type="video/mp4"
        crossOrigin="anonymous"
      />
    </>
  );
}
