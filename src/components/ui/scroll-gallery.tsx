// biome-ignore-all lint: GSAP scroll gallery with dynamic img & video layers (registry primitive)
"use client";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type CSSProperties, useMemo, useRef } from "react";
import {
  isWindowScroller,
  observeWindowResize,
  waitForScrollerReady,
} from "@/components/ui/scroll-gallery-utils/scroll-trigger-utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MASK_HIDDEN =
  "linear-gradient(to bottom, transparent 0%, transparent 100%)";
const MASK_REVEALED = "linear-gradient(to bottom, black 0%, black 100%)";

const IMAGE_CONTAINER_STYLE =
  "position:absolute;top:0;left:0;width:100%;height:100%;transform:translateZ(0);backface-visibility:hidden;";

/** Minimal layout defaults — typography and styling via `variant` or the `classNames` prop. */
const LAYOUT = {
  root: "relative h-svh w-full overflow-hidden",
  images: "absolute inset-0 h-full w-full",
  imageFrame: "absolute inset-0 h-full w-full",
  image: "h-full w-full object-cover",
  info: "absolute top-1/2 left-0 z-[2] w-full -translate-y-1/2",
  infoInner: "flex gap-8",
  prefix: "flex-1",
  title: "relative flex-[2] overflow-hidden",
  link: "flex flex-1 justify-end",
} as const;

export type ScrollGalleryVariant = "minimal" | "studio";

/** Structural-only preset for `variant="minimal"`. Override slots via the `classNames` prop. */
export const SCROLL_GALLERY_MINIMAL_CLASSES = {
  ...LAYOUT,
  prefixText: "",
  titleText: "",
  linkText: "",
} as const;

/** Deadlock Studios featured-work layout — used by `variant="studio"` or pass via the `classNames` prop. */
export const SCROLL_GALLERY_STUDIO_CLASSES = {
  root: "relative h-svh w-full overflow-hidden max-lg:h-dvh",
  images: "absolute inset-0 h-full w-full",
  imageFrame: "absolute inset-0 h-full w-full",
  image: "h-full w-full origin-center object-cover",
  info: "absolute top-1/2 left-0 z-[2] w-full -translate-y-1/2 border-white/20 border-b",
  infoInner: "flex gap-8 px-6 md:px-9",
  prefix: "flex-1 max-[1000px]:hidden",
  prefixText:
    "font-medium text-[36px] text-white leading-none tracking-[-0.02rem] antialiased will-change-transform max-[1000px]:text-[18px]",
  title: "relative h-10 flex-[2] overflow-hidden max-[1000px]:h-[22px]",
  titleText:
    "font-medium text-[36px] text-white leading-none tracking-[-0.02rem] antialiased will-change-transform [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)] max-[1000px]:text-[18px]",
  link: "flex flex-1 justify-end",
  linkText:
    "font-medium text-[36px] text-white leading-none tracking-[-0.02rem] no-underline antialiased will-change-transform max-[1000px]:text-[18px]",
} as const;

export interface ScrollGallerySlide {
  image?: string;
  video?: string;
  /** Per-slide CTA label. Falls back to `linkLabel`. */
  linkLabel?: string;
  title?: string;
  url?: string;
}

export function isVideoSlide(slide?: ScrollGallerySlide): boolean {
  if (!slide) return false;
  if (slide.video) return true;
  if (!slide.image) return false;
  const lower = slide.image.toLowerCase();
  return (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.includes("/video/upload/") ||
    lower.includes(".mp4")
  );
}

export function getSlideMediaSrc(slide?: ScrollGallerySlide): string {
  if (!slide) return "";
  return slide.video || slide.image || "";
}

export interface ScrollGalleryTiming {
  /** Scroll padding after the last transition (vh units). @default 300 */
  finalDelay?: number;
  /** Scroll padding before the first transition (vh units). @default 300 */
  initialDelay?: number;
  /** Starting scale for the active image. @default 1.25 */
  scaleFrom?: number;
  /** Resting scale after a slide is revealed. @default 1 */
  scaleTo?: number;
  /** Multiplier for strip-mask reveal speed. @default 2 */
  stripRevealSpeed?: number;
  /** Progress within a transition before the title advances (0–1). @default 0.3 */
  titleChangeThreshold?: number;
  /** Title slide-out / slide-in duration (seconds). @default 0.3 */
  titleDuration?: number;
  /** GSAP ease for title transitions. @default "power2.out" */
  titleEase?: string;
  /** Vertical offset for title enter/exit (CSS %). @default "120%" */
  titleOffset?: string;
}

export interface ScrollGalleryClassNames {
  /** First slide img/video element. */
  image?: string;
  /** Image/video frame wrapper. */
  imageFrame?: string;
  /** Image stack wrapper. */
  images?: string;
  /** Info band wrapper. */
  info?: string;
  /** Info band inner flex row. */
  infoInner?: string;
  /** CTA link column. */
  link?: string;
  /** CTA link text. */
  linkText?: string;
  /** Prefix label column. */
  prefix?: string;
  /** Prefix label text. */
  prefixText?: string;
  /** Animated title column. */
  title?: string;
  /** Animated title text. */
  titleText?: string;
  /** Extra classes on the scroll track (embedded mode only). */
  track?: string;
}

export interface ScrollGalleryProps {
  className?: string;
  /** Per-slot class overrides. `cn()` merges after built-ins/variant preset. */
  classNames?: ScrollGalleryClassNames;
  /**
   * Use container query height (`cqh`) instead of viewport height (`svh/dvh`)
   * for embedded mode. Enable when the gallery lives inside a
   * `container-type: size` ancestor (e.g. a preview panel).
   * @default false
   */
  containerQuery?: boolean;
  /** Catalog/docs preview — CSS sticky scroll track (no GSAP pin). */
  embedded?: boolean;
  /**
   * Scroll distance per transition in embedded mode (vh units, same as `scrollPerTransition`).
   * When omitted, embedded mode auto-targets ~5 panel heights total.
   */
  embeddedScrollPerTransition?: number;
  /** Global CTA label (right column). @default "Explore" */
  linkLabel?: string;
  /** ScrollTrigger pin start. @default "top top" */
  pinStart?: string;
  /** Prefix label (left column). Set `showPrefix={false}` to hide. @default "Featured" */
  prefixLabel?: string;
  /**
   * GSAP ScrollTrigger refresh priority. Lower numbers refresh later.
   * Set below any pinned section that appears earlier in the DOM to ensure
   * their spacers are re-added before this trigger measures its position.
   * @default -1
   */
  refreshPriority?: number;
  /** Scroll container for ScrollTrigger. Defaults to `window`. */
  scroller?: Element | Window;
  /** Scroll distance in vh per slide transition. @default 1000 */
  scrollPerTransition?: number;
  /** GSAP scrub smoothing (seconds). @default 1 */
  scrub?: number;
  showInfoBand?: boolean;
  showLink?: boolean;
  showPrefix?: boolean;
  slides: ScrollGallerySlide[];
  /** Number of horizontal mask strips for the wipe transition. @default 20 */
  stripsCount?: number;
  timing?: ScrollGalleryTiming;
  /**
   * Visual preset. `studio` applies Deadlock Studios editorial styling;
   * `minimal` is structural-only (override via the `classNames` prop).
   * @default "minimal"
   */
  variant?: ScrollGalleryVariant;
  /**
   * When enabled, centers images/videos inside a bounded 16:9 container
   * with object-fit: contain so that the full video frame is never cut off.
   * @default false
   */
  contained?: boolean;
}

function resolveScrollGalleryClasses(
  variant: ScrollGalleryVariant,
  classNames: ScrollGalleryClassNames | undefined,
  contained: boolean,
) {
  const preset =
    variant === "studio"
      ? SCROLL_GALLERY_STUDIO_CLASSES
      : SCROLL_GALLERY_MINIMAL_CLASSES;

  const defaultRoot = contained
    ? "relative h-svh w-full flex items-center justify-center p-3 sm:p-6 md:p-8 xl:p-10 overflow-hidden"
    : preset.root;

  const defaultImages = contained
    ? "relative w-full max-w-[90%] sm:max-w-[480px] md:max-w-[540px] lg:max-w-[580px] xl:max-w-[660px] 2xl:max-w-[740px] aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
    : preset.images;

  const defaultImageFrame = contained
    ? "absolute inset-0 h-full w-full overflow-hidden"
    : preset.imageFrame;

  const defaultImage = contained
    ? "h-full w-full object-contain bg-black"
    : preset.image;

  return {
    rootPreset: defaultRoot,
    images: cn(defaultImages, classNames?.images),
    imageFrame: cn(defaultImageFrame, classNames?.imageFrame),
    image: cn(defaultImage, classNames?.image),
    info: cn(preset.info, classNames?.info),
    infoInner: cn(preset.infoInner, classNames?.infoInner),
    prefix: cn(preset.prefix, classNames?.prefix),
    prefixText: cn(preset.prefixText, classNames?.prefixText),
    title: cn(preset.title, classNames?.title),
    titleText: cn(preset.titleText, classNames?.titleText),
    link: cn(preset.link, classNames?.link),
    linkText: cn(preset.linkText, classNames?.linkText),
    track: classNames?.track,
  };
}

interface ResolvedTiming {
  finalDelay: number;
  initialDelay: number;
  scaleFrom: number;
  scaleRange: number;
  scaleStep: number;
  scaleTo: number;
  stripRevealSpeed: number;
  titleChangeThreshold: number;
  titleDuration: number;
  titleEase: string;
  titleOffset: string;
}

function resolveTiming(timing?: ScrollGalleryTiming, contained = false): ResolvedTiming {
  const scaleFrom = timing?.scaleFrom ?? (contained ? 1 : 1.25);
  const scaleTo = timing?.scaleTo ?? 1;
  const scaleRange = scaleFrom - scaleTo;

  return {
    initialDelay: timing?.initialDelay ?? 300,
    finalDelay: timing?.finalDelay ?? 300,
    titleChangeThreshold: timing?.titleChangeThreshold ?? 0.3,
    titleDuration: timing?.titleDuration ?? 0.3,
    titleEase: timing?.titleEase ?? "power2.out",
    titleOffset: timing?.titleOffset ?? "120%",
    scaleFrom,
    scaleTo,
    scaleRange,
    scaleStep: scaleRange / 2,
    stripRevealSpeed: timing?.stripRevealSpeed ?? 2,
  };
}

function getTotalScrollDistanceVh(
  slideCount: number,
  scrollPerTransition: number,
  timing: ResolvedTiming,
): number {
  const transitionCount = Math.max(0, slideCount - 1);
  return (
    transitionCount * scrollPerTransition +
    timing.initialDelay +
    timing.finalDelay
  );
}

/** ~5 preview-panel heights for catalog embedded demos (not full-page 20+ vh). */
const EMBEDDED_SCROLL_TARGET_TOTAL = 520;

function resolveEmbeddedScrollConfig(
  slideCount: number,
  scrollPerTransition: number,
  embeddedScrollPerTransition: number | undefined,
  timing: ResolvedTiming,
): { scrollPerTransition: number; timing: ResolvedTiming } {
  const embeddedTiming: ResolvedTiming = {
    ...timing,
    initialDelay: Math.min(timing.initialDelay, 50),
    finalDelay: Math.min(timing.finalDelay, 50),
  };
  const transitionCount = Math.max(0, slideCount - 1);

  if (embeddedScrollPerTransition !== undefined) {
    return {
      scrollPerTransition: embeddedScrollPerTransition,
      timing: embeddedTiming,
    };
  }

  if (transitionCount === 0) {
    return { scrollPerTransition, timing: embeddedTiming };
  }

  const padding = embeddedTiming.initialDelay + embeddedTiming.finalDelay;
  const perTransition = Math.max(
    70,
    Math.floor((EMBEDDED_SCROLL_TARGET_TOTAL - padding) / transitionCount),
  );

  return { scrollPerTransition: perTransition, timing: embeddedTiming };
}

function createStripBounds(stripsCount: number) {
  return Array.from({ length: stripsCount }, (_, j) => {
    const posFromBottom = stripsCount - j - 1;
    const step = 100 / stripsCount;
    const lower = (posFromBottom + 1) * step;
    const upper = posFromBottom * step;
    return {
      lower,
      upperGap: upper - 0.1,
      delay: (j / stripsCount) * 0.5,
    };
  });
}

function mergeIntervals(intervals: { top: number; bottom: number }[]) {
  if (!intervals.length) {
    return [];
  }
  intervals.sort((a, b) => a.top - b.top);
  const merged = [{ ...intervals[0] }];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged.at(-1);
    const next = intervals[i];
    if (!last) {
      break;
    }
    if (next.top <= last.bottom) {
      last.bottom = Math.max(last.bottom, next.bottom);
    } else {
      merged.push({ ...next });
    }
  }
  return merged;
}

function buildStripMask(
  stripBounds: ReturnType<typeof createStripBounds>,
  getAdj: (j: number, bounds: (typeof stripBounds)[number]) => number,
) {
  const intervals: { top: number; bottom: number }[] = [];
  for (let j = 0; j < stripBounds.length; j++) {
    const bounds = stripBounds[j];
    const adj = Math.max(0, Math.min(1, getAdj(j, bounds)));
    if (adj <= 0) {
      continue;
    }
    const sliceHeight = bounds.lower - bounds.upperGap;
    intervals.push({
      top: bounds.lower - adj * sliceHeight,
      bottom: bounds.lower,
    });
  }
  const merged = mergeIntervals(intervals);
  if (!merged.length) {
    return MASK_HIDDEN;
  }
  const stops: string[] = [];
  let cursor = 0;
  for (const { top, bottom } of merged) {
    if (top > cursor) {
      stops.push(`transparent ${cursor}%`, `transparent ${top}%`);
    }
    stops.push(`black ${top}%`, `black ${bottom}%`);
    cursor = bottom;
  }
  if (cursor < 100) {
    stops.push(`transparent ${cursor}%`, "transparent 100%");
  }
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

function setMaskImage(el: HTMLElement, value: string) {
  el.style.maskImage = value;
  el.style.webkitMaskImage = value;
}

function createScaleSetter(el: HTMLElement, initialScale: number) {
  const apply = (value: number) => {
    el.style.transform = `translate3d(0, 0, 0) scale(${value})`;
  };
  apply(initialScale);
  return apply;
}

function imageScaleStyle(scale: number): CSSProperties {
  return {
    backfaceVisibility: "hidden",
    transform: `translate3d(0, 0, 0) scale(${scale})`,
  };
}

export function ScrollGallery({
  slides,
  stripsCount = 20,
  scrollPerTransition = 1000,
  scrub = 1,
  pinStart = "top top",
  timing: timingProp,
  scroller: scrollerProp,
  embedded = false,
  containerQuery = false,
  embeddedScrollPerTransition,
  prefixLabel = "Featured",
  linkLabel = "Explore",
  showInfoBand = true,
  showPrefix = true,
  showLink = true,
  className,
  classNames,
  refreshPriority = -1,
  variant = "minimal",
  contained = false,
}: ScrollGalleryProps) {
  const classes = useMemo(
    () => resolveScrollGalleryClasses(variant, classNames, contained),
    [variant, classNames, contained],
  );

  const resolvedTiming = useMemo(
    () => resolveTiming(timingProp, contained),
    [timingProp, contained],
  );

  const scrollConfig = useMemo(() => {
    if (!embedded) {
      return {
        scrollPerTransition,
        timing: resolvedTiming,
      };
    }

    return resolveEmbeddedScrollConfig(
      slides.length,
      scrollPerTransition,
      embeddedScrollPerTransition,
      resolvedTiming,
    );
  }, [
    embedded,
    embeddedScrollPerTransition,
    resolvedTiming,
    scrollPerTransition,
    slides.length,
  ]);
  const scrollDistanceVh = useMemo(
    () =>
      getTotalScrollDistanceVh(
        slides.length,
        scrollConfig.scrollPerTransition,
        scrollConfig.timing,
      ),
    [slides.length, scrollConfig],
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const firstMediaRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const exploreLinkRef = useRef<HTMLAnchorElement>(null);
  const slideImagesRef = useRef<HTMLDivElement>(null);

  const shouldAnimate = slides.length > 0;
  const displayPrefix = showInfoBand && showPrefix && Boolean(prefixLabel);
  const displayLink = showInfoBand && showLink;

  useGSAP(
    () => {
      if (!shouldAnimate) {
        return;
      }

      const scrollTriggerRoot = embedded
        ? trackRef.current
        : sectionRef.current;
      if (!scrollTriggerRoot) {
        return;
      }

      if (embedded && scrollerProp === undefined) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "[ScrollGallery] embedded=true requires a `scroller` prop — animation will not mount without it.",
          );
        }
        return;
      }

      let disposed = false;
      let trigger: ScrollTrigger | null = null;
      let unbindResize: (() => void) | undefined;
      let resizeObserver: ResizeObserver | undefined;
      const createdContainers: HTMLDivElement[] = [];

      const mountGallery = async () => {
        const section = sectionRef.current;
        const scrollRoot = embedded ? trackRef.current : sectionRef.current;
        const slideImages = slideImagesRef.current;
        const titleElement = titleRef.current;
        const exploreLink = exploreLinkRef.current;
        const firstSlideMedia = firstMediaRef.current;

        if (!(section && slideImages && firstSlideMedia && scrollRoot)) {
          return;
        }
        if (showInfoBand && !titleElement) {
          return;
        }
        if (displayLink && !exploreLink) {
          return;
        }

        const scroller = scrollerProp ?? window;
        await waitForScrollerReady(scroller);

        if (disposed || sectionRef.current !== section) {
          return;
        }
        if (embedded && trackRef.current !== scrollRoot) {
          return;
        }

        const titleEl = titleElement;
        const exploreLinkEl = exploreLink;
        const {
          finalDelay,
          initialDelay,
          scaleFrom,
          scaleStep,
          scaleTo,
          stripRevealSpeed,
          titleChangeThreshold,
          titleDuration,
          titleEase,
          titleOffset,
        } = scrollConfig.timing;
        const activeScrollPerTransition = scrollConfig.scrollPerTransition;

        const stripBounds = createStripBounds(stripsCount);
        const totalSlides = slides.length;
        const setFirstMediaScale = createScaleSetter(firstSlideMedia, scaleFrom);

        interface SlideLayer {
          media: HTMLElement;
          revealState: "hidden" | "animating" | "revealed";
          setScale: (v: number) => void;
          transitionIndex: number;
        }

        const slideLayers: SlideLayer[] = [];

        const maskedStyle = contained
          ? "width:100%;height:100%;object-fit:contain;transform-origin:center center;backface-visibility:hidden;mask-size:100% 100%;-webkit-mask-size:100% 100%;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat;will-change:transform,mask-image;"
          : MASKED_IMAGE_STYLE;

        for (let i = 1; i < totalSlides; i++) {
          const container = document.createElement("div");
          container.style.cssText = IMAGE_CONTAINER_STYLE;

          const slide = slides[i];
          const isVid = isVideoSlide(slide);
          const media = isVid
            ? document.createElement("video")
            : document.createElement("img");
          media.style.cssText = maskedStyle;

          if (isVid) {
            const v = media as HTMLVideoElement;
            v.src = getSlideMediaSrc(slide);
            v.autoplay = true;
            v.loop = true;
            v.muted = true;
            v.playsInline = true;
            v.setAttribute("playsinline", "");
            v.setAttribute("webkit-playsinline", "");
            v.setAttribute("muted", "");
            v.setAttribute("autoplay", "");
            v.setAttribute("loop", "");
            v.controls = false;
            v.play().catch(() => {});
          } else {
            const img = media as HTMLImageElement;
            img.src = getSlideMediaSrc(slide);
            img.alt = slide.title || "";
            img.decoding = "async";
          }

          setMaskImage(media, MASK_HIDDEN);

          container.appendChild(media);
          slideImages.appendChild(container);
          createdContainers.push(container);

          slideLayers.push({
            transitionIndex: i - 1,
            media,
            setScale: createScaleSetter(media, scaleFrom),
            revealState: "hidden",
          });
        }

        const transitionCount = totalSlides - 1;
        const totalScrollDistance =
          transitionCount * activeScrollPerTransition +
          initialDelay +
          finalDelay;

        const transitionRanges: { startPercent: number; endPercent: number }[] =
          [];
        let pos = initialDelay;
        for (let i = 0; i < transitionCount; i++) {
          const start = pos;
          const end = start + activeScrollPerTransition;
          transitionRanges.push({
            startPercent: start / totalScrollDistance,
            endPercent: end / totalScrollDistance,
          });
          pos = end;
        }

        function calculateImageProgress(scrollProgress: number) {
          const firstRange = transitionRanges[0];
          const lastRange = transitionRanges.at(-1);
          if (!(firstRange && lastRange)) {
            return 0;
          }
          if (scrollProgress < firstRange.startPercent) {
            return 0;
          }
          if (scrollProgress > lastRange.endPercent) {
            return transitionRanges.length;
          }
          for (let i = 0; i < transitionRanges.length; i++) {
            const { startPercent, endPercent } = transitionRanges[i];
            if (
              scrollProgress >= startPercent &&
              scrollProgress <= endPercent
            ) {
              const norm =
                (scrollProgress - startPercent) / (endPercent - startPercent);
              return i + norm;
            }
          }
          return transitionRanges.length;
        }

        function getScaleForImage(
          imageIndex: number,
          currentImageIndex: number,
          progress: number,
        ) {
          const continuousProgress = currentImageIndex + progress;
          const diff = continuousProgress - imageIndex;
          if (diff <= 0) {
            return scaleFrom;
          }
          if (diff >= 2) {
            return scaleTo;
          }
          return scaleFrom - scaleStep * diff;
        }

        let currentTitleIndex = 0;
        let queuedTitleIndex: number | null = null;
        let isAnimating = false;
        let lastImageProgress = 0;

        function updateLinkForSlide(index: number) {
          if (!(displayLink && exploreLinkEl)) {
            return;
          }
          exploreLinkEl.href = slides[index]?.url ?? "#";
          const label = slides[index]?.linkLabel ?? linkLabel;
          if (label) {
            exploreLinkEl.textContent = label;
          }
        }

        function animateTitleChange(index: number, direction: "down" | "up") {
          if (!titleEl) {
            return;
          }
          if (index === currentTitleIndex) {
            return;
          }
          if (index < 0 || index >= slides.length) {
            return;
          }
          if (isAnimating) {
            queuedTitleIndex = index;
            return;
          }
          isAnimating = true;
          const offset = titleOffset;
          const outY = direction === "down" ? `-${offset}` : offset;
          const inY = direction === "down" ? offset : `-${offset}`;

          gsap.killTweensOf(titleEl);
          updateLinkForSlide(index);

          gsap.to(titleEl, {
            y: outY,
            duration: titleDuration,
            ease: titleEase,
            onComplete: () => {
              titleEl.textContent = slides[index]?.title || "";
              gsap.set(titleEl, { y: inY });
              gsap.to(titleEl, {
                y: "0%",
                duration: titleDuration,
                ease: titleEase,
                onComplete: () => {
                  currentTitleIndex = index;
                  isAnimating = false;
                  if (
                    queuedTitleIndex !== null &&
                    queuedTitleIndex !== currentTitleIndex
                  ) {
                    const next = queuedTitleIndex;
                    queuedTitleIndex = null;
                    animateTitleChange(next, direction);
                  }
                },
              });
            },
          });
        }

        function getTitleIndexForProgress(imageProgress: number) {
          const idx = Math.floor(imageProgress);
          const specific = imageProgress - idx;
          return specific >= titleChangeThreshold
            ? Math.min(idx + 1, slides.length - 1)
            : idx;
        }

        function setLayerRevealed(layer: SlideLayer) {
          if (layer.revealState === "revealed") {
            return;
          }
          setMaskImage(layer.media, MASK_REVEALED);
          layer.revealState = "revealed";
        }

        function setLayerHidden(layer: SlideLayer) {
          if (layer.revealState === "hidden") {
            return;
          }
          setMaskImage(layer.media, MASK_HIDDEN);
          layer.revealState = "hidden";
        }

        const useWindowPin = isWindowScroller(scroller);

        const handleScrollUpdate = (progress: number) => {
          const imageProgress = calculateImageProgress(progress);
          const scrollDirection =
            imageProgress > lastImageProgress ? "down" : "up";
          const currentImageIndex = Math.floor(imageProgress);
          const imageSpecificProgress = imageProgress - currentImageIndex;

          if (showInfoBand && titleEl) {
            const correctTitleIndex = getTitleIndexForProgress(imageProgress);
            if (correctTitleIndex !== currentTitleIndex) {
              queuedTitleIndex = correctTitleIndex;
              if (!isAnimating) {
                animateTitleChange(correctTitleIndex, scrollDirection);
              }
            }
          }

          setFirstMediaScale(
            getScaleForImage(0, currentImageIndex, imageSpecificProgress),
          );

          for (const layer of slideLayers) {
            const { transitionIndex, setScale } = layer;
            setScale(
              getScaleForImage(
                transitionIndex,
                currentImageIndex,
                imageSpecificProgress,
              ),
            );

            if (transitionIndex < currentImageIndex) {
              setLayerRevealed(layer);
            } else if (transitionIndex === currentImageIndex) {
              layer.revealState = "animating";
              setMaskImage(
                layer.media,
                buildStripMask(stripBounds, (_j, bounds) =>
                  Math.max(
                    0,
                    Math.min(
                      1,
                      (imageSpecificProgress - bounds.delay) * stripRevealSpeed,
                    ),
                  ),
                ),
              );
            } else {
              setLayerHidden(layer);
            }
          }

          lastImageProgress = imageProgress;
        };

        if (embedded) {
          trigger = ScrollTrigger.create({
            trigger: scrollRoot,
            scroller,
            start: "top top",
            end: "bottom bottom",
            scrub,
            invalidateOnRefresh: true,
            refreshPriority: -1,
            onUpdate: (self) => {
              handleScrollUpdate(self.progress);
            },
          });
        } else {
          trigger = ScrollTrigger.create({
            trigger: section,
            scroller,
            start: pinStart,
            end: `+=${totalScrollDistance}vh`,
            pin: true,
            pinReparent: !useWindowPin,
            pinSpacing: true,
            scrub,
            invalidateOnRefresh: true,
            refreshPriority,
            onUpdate: (self) => {
              handleScrollUpdate(self.progress);
            },
          });
        }

        if (scroller instanceof HTMLElement) {
          resizeObserver = new ResizeObserver(() => {
            ScrollTrigger.refresh();
            trigger?.refresh();
          });
          resizeObserver.observe(scroller);
        } else {
          unbindResize = observeWindowResize(() => {
            ScrollTrigger.refresh();
            trigger?.refresh();
          });
        }

        ScrollTrigger.refresh();
        trigger.refresh();
        handleScrollUpdate(trigger.progress);
      };

      mountGallery().catch(() => {
        /* ScrollTrigger setup aborted on unmount */
      });

      return () => {
        disposed = true;
        resizeObserver?.disconnect();
        trigger?.kill();
        trigger = null;
        unbindResize?.();
        for (const el of createdContainers) {
          el.remove();
        }
      };
    },
    {
      scope: embedded ? trackRef : sectionRef,
      dependencies: [
        slides,
        stripsCount,
        scrollPerTransition,
        scrub,
        pinStart,
        scrollerProp,
        scrollConfig,
        shouldAnimate,
        showInfoBand,
        displayLink,
        linkLabel,
        embedded,
        refreshPriority,
        contained,
      ],
    },
  );

  const firstSlide = slides[0];
  const initialLinkLabel = firstSlide?.linkLabel ?? linkLabel;
  const initialImageScale = scrollConfig.timing.scaleFrom;

  const trackStyle = {
    "--sg-scroll-vh": scrollDistanceVh,
  } as CSSProperties;

  const gallerySection = (
    <section
      className={cn(
        embedded
          ? contained
            ? "relative h-full w-full flex items-center justify-center p-3 sm:p-6 md:p-8 xl:p-10 overflow-hidden"
            : "relative h-full w-full overflow-hidden"
          : classes.rootPreset,
        className,
      )}
      ref={sectionRef}
    >
      <div className={classes.images} ref={slideImagesRef}>
        <div className={classes.imageFrame}>
          {firstSlide ? (
            isVideoSlide(firstSlide) ? (
              <video
                ref={firstMediaRef as React.RefObject<HTMLVideoElement>}
                src={getSlideMediaSrc(firstSlide)}
                autoPlay
                loop
                muted
                playsInline
                className={classes.image}
                style={imageScaleStyle(initialImageScale)}
              />
            ) : (
              <img
                alt={firstSlide.title || ""}
                className={classes.image}
                ref={firstMediaRef as React.RefObject<HTMLImageElement>}
                src={getSlideMediaSrc(firstSlide)}
                style={imageScaleStyle(initialImageScale)}
              />
            )
          ) : null}
        </div>
      </div>

      {showInfoBand && firstSlide ? (
        <div className={classes.info}>
          <div className={classes.infoInner}>
            {displayPrefix ? (
              <div className={classes.prefix}>
                <p className={classes.prefixText}>{prefixLabel}</p>
              </div>
            ) : null}

            <div className={classes.title}>
              <p className={classes.titleText} ref={titleRef}>
                {firstSlide.title || ""}
              </p>
            </div>

            {displayLink ? (
              <div className={classes.link}>
                <a
                  className={classes.linkText}
                  href={firstSlide.url ?? "#"}
                  ref={exploreLinkRef}
                >
                  {initialLinkLabel}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );

  if (embedded) {
    const trackHeightStyle: CSSProperties = containerQuery
      ? { ...trackStyle, height: `calc(var(--sg-scroll-vh) * 1cqh)` }
      : trackStyle;

    const stickyHeightStyle: CSSProperties = containerQuery
      ? { height: "100cqh" }
      : {};

    return (
      <div
        className={cn(
          "relative w-full",
          !containerQuery &&
            "h-[calc(var(--sg-scroll-vh)*1svh)] max-lg:h-[calc(var(--sg-scroll-vh)*1dvh)]",
          classes.track,
        )}
        ref={trackRef}
        style={trackHeightStyle}
      >
        <div
          className={cn(
            "sticky top-0 z-0 w-full overflow-hidden",
            !containerQuery && "h-svh max-lg:h-dvh",
          )}
          style={stickyHeightStyle}
        >
          {gallerySection}
        </div>
      </div>
    );
  }

  return gallerySection;
}

export default ScrollGallery;
