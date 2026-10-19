"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { eventForLink, isSectionKey, type SectionKey } from "@/lib/analytics/catalog";
import { getTracker, initTracker } from "@/lib/analytics/client/track";
import { isSectionInView, SECTION_DWELL_MS } from "@/lib/analytics/client/sectionVisibility";

const SECTION_SELECTOR = "[data-analytics-section], main section[id]";
const THRESHOLDS = [0, 0.1, 0.25, 0.4, 0.5, 0.75, 1];

/**
 * AnalyticsTracker Component
 * * Rendered only after analytics consent (see ConsentScripts). Renders nothing;
 * it wires route changes, section visibility, link clicks and tab visibility into
 * the visit tracker. All work happens in effects and passive listeners, so it adds
 * no render cost and cannot cause hydration mismatches.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();

  // Session lifecycle: tab visibility, page unload and delegated link clicks.
  useEffect(() => {
    const tracker = initTracker();
    if (!tracker) return;

    const onVisibility = () => tracker.setVisible(document.visibilityState === "visible");
    const onPageHide = () => tracker.setVisible(false);
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor) return;
      const key = eventForLink(anchor.getAttribute("href") ?? "", window.location.host);
      if (key) tracker.event(key);
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  // Route views and section observation, re-armed on every client-side navigation.
  useEffect(() => {
    const tracker = getTracker();
    if (!tracker || typeof IntersectionObserver === "undefined") return;

    tracker.pageView(pathname);

    const timers = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = sectionKey(entry.target);
          if (!key) continue;
          const inView = isSectionInView(
            entry.intersectionRect.height,
            entry.boundingClientRect.height,
            window.innerHeight,
          );
          const pending = timers.get(entry.target);
          if (inView && pending === undefined) {
            timers.set(
              entry.target,
              window.setTimeout(() => {
                timers.delete(entry.target);
                if (tracker.sectionView(key)) observer.unobserve(entry.target);
              }, SECTION_DWELL_MS),
            );
          } else if (!inView && pending !== undefined) {
            window.clearTimeout(pending);
            timers.delete(entry.target);
          }
        }
      },
      { threshold: THRESHOLDS },
    );

    // Wait a frame so the new route's sections are in the DOM.
    const frame = window.requestAnimationFrame(() => {
      document.querySelectorAll(SECTION_SELECTOR).forEach((element) => {
        const key = sectionKey(element);
        if (key && !tracker.payload?.sections.includes(key)) observer.observe(element);
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

function sectionKey(element: Element): SectionKey | null {
  const key = element.getAttribute("data-analytics-section") ?? element.id;
  return isSectionKey(key) ? key : null;
}
