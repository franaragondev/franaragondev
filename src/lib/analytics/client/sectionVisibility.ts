/** A section counts as viewed after staying sufficiently visible for this long. */
export const SECTION_DWELL_MS = 1000;

/**
 * Tall sections can never be 50% visible on a phone, so a section qualifies
 * when half of it is visible or it fills 40% of the viewport, whichever is smaller.
 */
export function isSectionInView(
  visibleHeight: number,
  sectionHeight: number,
  viewportHeight: number,
): boolean {
  if (visibleHeight <= 0 || sectionHeight <= 0 || viewportHeight <= 0) return false;
  return visibleHeight >= Math.min(sectionHeight * 0.5, viewportHeight * 0.4);
}
