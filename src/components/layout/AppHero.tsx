import ParallaxBackground from "./ParallaxBackground";

export default function AppHero() {
  return (
    <ParallaxBackground
      backgroundImage="/hero-bg.webp"
      speed={-20}
      minHeight="400px"
      sectionName="home"
    ></ParallaxBackground>
  );
}
