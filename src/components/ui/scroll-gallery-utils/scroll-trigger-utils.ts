/**
 * Utility functions for GSAP ScrollTrigger scroller and window listeners
 */

export function isWindowScroller(scroller: Element | Window): boolean {
  if (typeof window === "undefined") return true;
  return (
    scroller === window ||
    scroller === document.documentElement ||
    scroller === document.body
  );
}

export function observeWindowResize(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  
  let frameId: number | null = null;
  const onResize = () => {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => {
      callback();
    });
  };

  window.addEventListener("resize", onResize, { passive: true });
  return () => {
    if (frameId !== null) cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
  };
}

export async function waitForScrollerReady(
  scroller: Element | Window,
): Promise<void> {
  if (typeof window === "undefined") return;
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}
