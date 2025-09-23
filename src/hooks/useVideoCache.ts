import { useState, useEffect } from "react";

export function useVideoCache(src: string) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
      // Usar la URL normal en Safari
      setVideoUrl(src);
      return;
    }

    let isMounted = true;

    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        if (!isMounted) return;
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return videoUrl;
}
