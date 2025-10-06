export default function Head() {
  return (
    <>
      <link
        rel="preload"
        as="video"
        href="/input.mp4"
        type="video/mp4"
        crossOrigin="anonymous"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
    </>
  );
}
