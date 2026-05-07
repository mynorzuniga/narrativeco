"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BRAND_PRIMARY_HEX,
  brandShades,
  grey,
  pureBlack,
} from "../lib/color-palettes";
import { DISPLAY_LEVELS } from "../lib/typography-scale";
import { DsAppFooter } from "../ui/ds-app-footer";
import { DsCtaMainButton, DsCtaSecondaryButton } from "../ui/ds-cta-buttons";

const brand = brandShades(BRAND_PRIMARY_HEX);
const HEADING_2 = DISPLAY_LEVELS[1];
/** Logo wordmark size — matches Heading 6 rem (user-requested ~1.5rem cap height). */
const LOGO_WORDMARK_REM =
  DISPLAY_LEVELS.find((d) => d.level === 6)?.rem ?? 1.5;

const LINES = [
  {
    id: "learn",
    dir: "rtl" as const,
    before: "Every rep is a chance to ",
    accent: "Learn",
    after: " what actually changed under the hood.",
  },
  {
    id: "to",
    dir: "ltr" as const,
    before: "The path from noise ",
    accent: "To",
    after: " signal is written in what you can explain out loud.",
  },
  {
    id: "tell",
    dir: "rtl" as const,
    before: "When you finally",
    accent: "TELL",
    after: "the steps out loud, the skill stops being a secret in your head.",
  },
  {
    id: "your",
    dir: "ltr" as const,
    before: "The hours only count when",
    accent: "YOUR",
    after: "eyes catch what actually broke between attempts.",
  },
  {
    id: "story",
    dir: "rtl" as const,
    before: "What you practiced becomes a",
    accent: "STORY",
    after: "you can teach tomorrow without memorizing buzzwords.",
  },
] as const;

type LineDef = (typeof LINES)[number];

/** Line slide ~2.95s (globals.css); short stagger so rows don’t idle long before motion. */
const ROW_DELAY_MS = [0, 80, 160, 420, 820] as const;

const HERO_LINE_HEIGHT_REM = HEADING_2.rem * 1.05;

/** Breathing room around accent words (0.5rem = sizing-scale step) */
const ACCENT_INLINE_PAD_REM = 0.5;

function useReducedMotionPreferred() {
  const [preferReducedMotion, setPreferReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPreferReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return preferReducedMotion;
}

/**
 * Moves the contiguous line horizontally so the accent midpoint matches the strip
 * midpoint; the row is centered in the frame, so the accent lands in frame. Only the
 * row’s horizontal overflow-x clip trims the tails — nothing clips between fragments.
 */
function HeroSentenceRow({
  line,
  animationDelayMs,
  animClass,
  headingStyle,
  rowHeightRem,
}: {
  line: LineDef;
  animationDelayMs: number;
  animClass: string;
  headingStyle: Readonly<{ fontSize: string; lineHeight: number; color: string }>;
  rowHeightRem: number;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const lastShiftRef = useRef<number | null>(null);

  const applyAccentShift = () => {
    const strip = stripRef.current;
    const accentEl = accentRef.current;
    if (!strip || !accentEl || strip.offsetWidth === 0) return;

    const stripRect = strip.getBoundingClientRect();
    const accentRect = accentEl.getBoundingClientRect();
    const accentMidRelStrip =
      accentRect.left - stripRect.left + accentRect.width / 2;
    const stripMid = stripRect.width / 2;
    const shift = stripMid - accentMidRelStrip;
    const prev = lastShiftRef.current;
    if (prev !== null && Math.abs(prev - shift) < 0.5) return;
    lastShiftRef.current = shift;
    strip.style.transform = `translate3d(${shift}px, 0, 0)`;
  };

  useLayoutEffect(() => {
    lastShiftRef.current = null;
    applyAccentShift();
    const strip = stripRef.current;
    if (!strip || typeof ResizeObserver === "undefined") return undefined;

    let raf = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(applyAccentShift);
    };

    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(strip);
    window.addEventListener("resize", scheduleMeasure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      strip.style.transform = "";
    };
  }, [line.before, line.after, line.accent]);

  const slideAnimStyle =
    animClass ?
      ({ animationDelay: `${animationDelayMs}ms` } as const)
    : undefined;
  const blackTextClass =
    animClass ? "proto-login-line-black-animate"
    : undefined;

  return (
    <div
      className="flex w-full min-w-0 items-center justify-center overflow-x-clip overflow-y-clip"
      style={{
        height: `${rowHeightRem}rem`,
      }}
    >
      <div
        className={["inline-block max-w-none", animClass].filter(Boolean).join(" ")}
        style={slideAnimStyle}
      >
        <div
          ref={stripRef}
          className="relative inline-flex flex-row flex-nowrap items-baseline whitespace-nowrap font-ds-heading font-normal tracking-tight"
        >
          <span className={blackTextClass} style={{ ...headingStyle, ...slideAnimStyle }}>
            {line.before}
          </span>
          <span
            ref={accentRef}
            className="inline-block whitespace-nowrap"
            style={{
              ...headingStyle,
              color: brand[500],
              paddingLeft: `${ACCENT_INLINE_PAD_REM}rem`,
              paddingRight: `${ACCENT_INLINE_PAD_REM}rem`,
            }}
          >
            {line.accent}
          </span>
          <span className={blackTextClass} style={{ ...headingStyle, ...slideAnimStyle }}>
            {line.after}
          </span>
        </div>
      </div>
    </div>
  );
}

export function StyleFoundationsLogin() {
  const reducedMotion = useReducedMotionPreferred();

  const headingStyle = useMemo(
    () => ({
      fontSize: `${HEADING_2.rem}rem`,
      lineHeight: 1.05 as const,
      color: pureBlack,
    }),
    [],
  );

  const logoWordmarkStyle = useMemo(
    () => ({
      fontSize: `${LOGO_WORDMARK_REM}rem`,
      lineHeight: 1 as const,
      color: grey[800],
    }),
    [],
  );

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip bg-white">
      <div className="shrink-0 pt-5 text-center md:pt-6">
        <p
          className="m-0 font-ds-body font-semibold"
          style={logoWordmarkStyle}
        >
          NarrativeCo
        </p>
      </div>

      <div className="flex w-full min-w-0 flex-1 flex-col justify-start pt-6 pb-4 md:pt-8">
        <h1
          className="flex w-full min-w-0 flex-col gap-3 md:gap-4"
          aria-label="Learn to tell your story: every rep is a chance to learn what actually changed under the hood. The path from noise to signal is written in what you can explain out loud. When you finally tell the steps out loud, the skill stops being a secret in your head. The hours only count when your eyes catch what actually broke between attempts. What you practiced becomes a story you can teach tomorrow without memorizing buzzwords."
        >
          {LINES.map((line, index) => {
            const rtl = line.dir === "rtl";
            const animClass =
              reducedMotion ?
                ""
              : rtl ? "proto-login-line-rtl"
              : "proto-login-line-ltr";
            const delayMs = ROW_DELAY_MS[index] ?? 0;

            return (
              <HeroSentenceRow
                key={line.id}
                line={line}
                animationDelayMs={delayMs}
                animClass={animClass}
                headingStyle={headingStyle}
                rowHeightRem={HERO_LINE_HEIGHT_REM}
              />
            );
          })}
        </h1>
      </div>

      <div
        className="box-border flex w-full shrink-0 flex-col"
        style={{
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingBottom: "1rem",
          gap: "1rem",
        }}
      >
        <DsCtaMainButton className="w-full" type="button">
          Login
        </DsCtaMainButton>
        <DsCtaSecondaryButton className="w-full" type="button">
          Sign Up
        </DsCtaSecondaryButton>
      </div>

      <DsAppFooter />
    </div>
  );
}
