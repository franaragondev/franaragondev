import { useState, useEffect } from "react";

let cachedVideoUrl: string | null = null;

export function useVideoCache(src: string) {
  const [videoUrl, setVideoUrl] = useState<string | null>(cachedVideoUrl);

  useEffect(() => {
    if (cachedVideoUrl) return;

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
    };
  }, [src]);

  return videoUrl;
}
