import { useState, useEffect } from "react";

let cachedVideoUrl: string | null = null; // memoria compartida entre páginas

export function useVideoCache(src: string) {
  const [videoUrl, setVideoUrl] = useState<string | null>(cachedVideoUrl);

  useEffect(() => {
    if (cachedVideoUrl) return; // ya está en memoria

    let isMounted = true;

    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        if (!isMounted) return;
        cachedVideoUrl = URL.createObjectURL(blob);
        setVideoUrl(cachedVideoUrl);
      });

    return () => {
      isMounted = false;
      // no liberamos la URL aquí para que quede en memoria entre páginas
    };
  }, [src]);

  return videoUrl;
}
