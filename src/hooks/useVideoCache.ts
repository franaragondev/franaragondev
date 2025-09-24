import { useState, useEffect } from "react";

const videoCache: Record<string, string> = {};

export function useVideoCache(src: string) {
  const [videoUrl, setVideoUrl] = useState<string | null>(
    videoCache[src] ?? null
  );

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
      videoCache[src] = src;
      setVideoUrl(src);
      return;
    }

    if (videoCache[src]) {
      setVideoUrl(videoCache[src]);
      return;
    }

    let isMounted = true;

    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        if (!isMounted) return;

        const newUrl = URL.createObjectURL(blob);

        if (videoCache[src]) {
          URL.revokeObjectURL(videoCache[src]);
        }

        videoCache[src] = newUrl;
        setVideoUrl(newUrl);
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return videoUrl;
}
