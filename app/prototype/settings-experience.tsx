"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BRAND_PRIMARY_HEX,
  brandShades,
  grey,
  pureBlack,
  pureWhite,
} from "../lib/color-palettes";
import { BODY_SIZES, DISPLAY_LEVELS } from "../lib/typography-scale";
import { DsAppHeader } from "../ui/ds-app-header";
import { DsCtaMainButton } from "../ui/ds-cta-buttons";

const HEADING_1 = DISPLAY_LEVELS.find((l) => l.level === 1)!;
const HEADING_3 = DISPLAY_LEVELS[2];
const HEADING_5 = DISPLAY_LEVELS.find((l) => l.level === 5)!;
const HEADING_6 = DISPLAY_LEVELS[5];

const BODY_STANDARD_REM =
  BODY_SIZES.find((s) => s.id === "standard")?.rem ?? 1;

const BODY_SMALL_REM =
  BODY_SIZES.find((s) => s.id === "small")?.rem ?? 0.75;

const brand = brandShades(BRAND_PRIMARY_HEX);

/** Static lesson context for this prototype preview. */
const LESSON_INDICATOR_NUMBER = 12;

/** Sample draft for prototype preview (~300 chars). */
const STORY_PREFILL_TIME_TRAVEL =
  "The vestibule liquefied into shimmering chronos—velvet static clung to my sleeves while brass harmonics hunted my heartbeat through graphite fog scented with unborn storms. Echoes landed bright and premature; a vertiginous future leaned close, humming itineraries only a restless paradox understands.";

const COLLECT_KEYWORDS = ["heartbeat", "echoes", "restless"] as const;

type CollectKeyword = (typeof COLLECT_KEYWORDS)[number];

const COLLECT_LABEL: Record<CollectKeyword, string> = {
  heartbeat: "Heartbeat",
  echoes: "Echoes",
  restless: "Restless",
};

const HIGHLIGHT_PATTERN = /\b(heartbeat|echoes|restless)\b/gi;

function canonKeyword(match: string): CollectKeyword | null {
  const k = match.toLowerCase();
  if (k === "heartbeat" || k === "echoes" || k === "restless") {
    return k;
  }
  return null;
}

function storyLineCollectableForScroll(
  text: string,
  brand500: string,
  lanePrefix: string,
  bindRef: (keyword: CollectKeyword, el: HTMLElement | null) => void,
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let nodeKey = 0;
  let lastIndex = 0;
  HIGHLIGHT_PATTERN.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = HIGHLIGHT_PATTERN.exec(text)) !== null) {
    const [word] = match;
    const { index } = match;
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }
    const kw = canonKeyword(word);
    if (kw !== null) {
      nodes.push(
        <span
          key={`${lanePrefix}-${kw}-${nodeKey}`}
          ref={(el) => bindRef(kw, el)}
          data-collect-keyword={kw}
          style={{ color: brand500 }}
        >
          {word}
        </span>,
      );
    } else {
      nodes.push(word);
    }
    lastIndex = index + word.length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

const SCROLL_SPEED_PX_PER_SEC = 460;

/** Heading 6 / black — ticker line tokens (stable ref for animation effect). */
const HEADING_6_SCROLL_LINE_STYLE: CSSProperties = {
  fontSize: `${HEADING_6.rem}rem`,
  lineHeight: 1.05,
  color: pureBlack,
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const CELEBRATION_PARAGRAPH_GAP_REM = BODY_SMALL_REM;

const SENTIMENT_GROUP_BORDER_REM = 0.25;

const LESSON_SENTIMENT_OPTIONS = [
  { id: "hopeful", label: "Hopeful" },
  { id: "grounded", label: "Grounded" },
  { id: "unsettled", label: "Unsettled" },
  { id: "motivated", label: "Motivated" },
] as const;

const REWARD_POINTS_LESSON = 3;
const REWARD_POINTS_QA = 3;
const REWARD_STREAK_DAYS = 1;

type LessonSentimentId = (typeof LESSON_SENTIMENT_OPTIONS)[number]["id"];

/** Matches `.proto-settings-collect-chip` duration in `globals.css`. */
const CELEBRATION_CHIP_MS = 550;

function RewardsSummaryView() {
  const rewardsHeadingId = "rewards-summary-heading";
  const brand500 = brand[500];

  const titleStyle = {
    fontSize: `${HEADING_1.rem}rem`,
    lineHeight: 1.05 as const,
    color: pureBlack,
  };

  const valueHeadingStyle = {
    fontSize: `${HEADING_5.rem}rem`,
    lineHeight: 1.05 as const,
    color: brand500,
  };

  const labelStyle = {
    fontSize: `${BODY_STANDARD_REM}rem`,
    lineHeight: 1.5 as const,
    color: pureBlack,
  };

  const introStyle = {
    fontSize: `${BODY_STANDARD_REM}rem`,
    lineHeight: 1.5 as const,
    color: grey[700],
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-white">
      <DsAppHeader />
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6">
        <main
          className="flex min-h-full max-w-prose min-w-0 flex-col"
          aria-labelledby={rewardsHeadingId}
          role="region"
          aria-live="polite"
        >
          <h1
            id={rewardsHeadingId}
            className="proto-rewards-reveal m-0 font-ds-heading font-normal tracking-tight text-balance"
            style={titleStyle}
          >
            Great progress so far.
          </h1>

          <p
            className="proto-rewards-reveal-soft proto-rewards-delay-1 m-0 mt-4 max-w-prose font-ds-body font-normal text-pretty break-words"
            style={introStyle}
          >
            {"You've earned the following:"}
          </p>

          <ul className="m-0 mt-6 flex list-none flex-col gap-6 p-0">
            <li className="proto-rewards-reveal-soft proto-rewards-delay-2 m-0 p-0">
              <RewardsStatRow
                value={`+${REWARD_POINTS_LESSON}`}
                label="Lesson points"
                valueHeadingStyle={valueHeadingStyle}
                labelStyle={labelStyle}
              />
            </li>
            <li className="proto-rewards-reveal-soft proto-rewards-delay-3 m-0 p-0">
              <RewardsStatRow
                value={`+${REWARD_POINTS_QA}`}
                label="Q&A points"
                valueHeadingStyle={valueHeadingStyle}
                labelStyle={labelStyle}
              />
            </li>
            <li className="proto-rewards-reveal-soft proto-rewards-delay-4 m-0 p-0">
              <RewardsStatRow
                value={`+${REWARD_STREAK_DAYS}`}
                label="Day Streak"
                valueHeadingStyle={valueHeadingStyle}
                labelStyle={labelStyle}
              />
            </li>
          </ul>

          <div className="mt-8 flex min-h-0 flex-1 flex-col justify-end pt-4">
            <DsCtaMainButton type="button" className="w-full max-w-prose cursor-pointer">
              Complete
            </DsCtaMainButton>
          </div>
        </main>
      </div>
    </div>
  );
}

function RewardsStatRow({
  value,
  label,
  valueHeadingStyle,
  labelStyle,
}: {
  value: string;
  label: string;
  valueHeadingStyle: CSSProperties;
  labelStyle: CSSProperties;
}) {
  return (
    <div className="flex min-w-0 flex-row flex-wrap items-center justify-start gap-4">
      <span
        className="font-ds-heading font-normal tabular-nums tracking-tight"
        style={valueHeadingStyle}
      >
        {value}
      </span>
      <span className="min-w-0 font-ds-body font-semibold text-left" style={labelStyle}>
        {label}
      </span>
    </div>
  );
}

function LoadingLeftStack({
  collected,
  brand500,
  marqueeFinished,
  onContinue,
}: {
  collected: Record<CollectKeyword, boolean>;
  brand500: string;
  marqueeFinished: boolean;
  onContinue?: () => void;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [showCelebrationParagraph, setShowCelebrationParagraph] =
    useState(false);
  const [lessonSentiment, setLessonSentiment] = useState<
    LessonSentimentId | null
  >(null);
  const [sentimentUiVisible, setSentimentUiVisible] = useState(false);

  const headingStyle: CSSProperties = {
    fontSize: `${HEADING_1.rem}rem`,
    lineHeight: 1.05,
    color: pureBlack,
  };

  const paragraphStyle: CSSProperties = {
    margin: 0,
    marginTop: `${CELEBRATION_PARAGRAPH_GAP_REM}rem`,
    fontSize: `${BODY_STANDARD_REM}rem`,
    lineHeight: 1.5,
    color: grey[700],
  };

  useEffect(() => {
    if (!marqueeFinished) {
      setShowCelebrationParagraph(false);
      setSentimentUiVisible(false);
      setLessonSentiment(null);
      return;
    }

    setShowCelebrationParagraph(false);
    setSentimentUiVisible(false);
    setLessonSentiment(null);

    if (reduceMotion) {
      const id = window.setTimeout(() => {
        setShowCelebrationParagraph(true);
      }, CELEBRATION_CHIP_MS);
      return () => window.clearTimeout(id);
    }
  }, [marqueeFinished, reduceMotion]);

  useEffect(() => {
    if (!showCelebrationParagraph) {
      setSentimentUiVisible(false);
      return;
    }
    if (reduceMotion) {
      const id = window.setTimeout(() => {
        setSentimentUiVisible(true);
      }, CELEBRATION_CHIP_MS);
      return () => window.clearTimeout(id);
    }
  }, [showCelebrationParagraph, reduceMotion]);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-10 box-border flex min-w-0 flex-col gap-0.5"
      style={{ padding: "1rem" }}
    >
      <div className="min-w-0 max-w-prose" aria-hidden={true}>
        {COLLECT_KEYWORDS.map((kw) =>
          collected[kw] ? (
            <span
              key={kw}
              className="font-ds-heading font-normal tracking-tight proto-settings-collect-chip block"
              style={{
                fontSize: `${HEADING_6.rem}rem`,
                lineHeight: 1.05,
                color: brand500,
              }}
            >
              {COLLECT_LABEL[kw]}
            </span>
          ) : null,
        )}
      </div>

      {marqueeFinished ? (
        <div
          aria-live="polite"
          className="pointer-events-auto mt-4 flex min-w-0 max-w-prose flex-col"
        >
          <h1
            className="m-0 font-ds-heading font-normal tracking-tight text-balance proto-settings-collect-chip"
            style={headingStyle}
            onAnimationEnd={(e) => {
              if (reduceMotion || e.target !== e.currentTarget) return;
              if (!e.animationName.includes("collect-chip")) return;
              setShowCelebrationParagraph(true);
            }}
          >
            Great Job!
          </h1>
          {showCelebrationParagraph ? (
            <>
              <p
                className="font-ds-body font-normal break-words proto-settings-collect-chip"
                style={paragraphStyle}
                onAnimationEnd={(e) => {
                  if (reduceMotion || e.target !== e.currentTarget) return;
                  if (!e.animationName.includes("collect-chip")) return;
                  setSentimentUiVisible(true);
                }}
              >
                Spotting anchors like{" "}
                <span className="font-semibold" style={{ color: brand500 }}>
                  Heartbeat
                </span>
                ,{" "}
                <span className="font-semibold" style={{ color: brand500 }}>
                  Echoes
                </span>
                , and{" "}
                <span className="font-semibold" style={{ color: brand500 }}>
                  Restless
                </span>{" "}
                ties feeling to structure—so someone else can trace how the lesson
                landed for you. That kind of specificity is what makes telling the
                story of this lesson so powerful.
              </p>

              {sentimentUiVisible ? (
                <>
                  <div className="proto-settings-collect-chip mt-8 min-w-0 max-w-prose">
                    <p
                      className="m-0 break-words font-ds-body font-normal"
                      style={{
                        fontSize: `${BODY_STANDARD_REM}rem`,
                        lineHeight: 1.5,
                        color: pureBlack,
                        marginBottom: "1rem",
                      }}
                    >
                      Which feeling from your lesson story matters most right now?
                    </p>
                  </div>

                  <div
                    className="proto-settings-collect-chip pointer-events-auto min-w-0"
                    style={{
                      marginLeft: "-1rem",
                      marginRight: "-1rem",
                      width: "calc(100% + 2rem)",
                    }}
                  >
                    <fieldset className="m-0 min-w-0 border-0 p-0">
                      <legend className="sr-only">
                        Most important sentiment from your lesson story
                      </legend>
                      <div
                        className="flex flex-col"
                        style={{
                          borderTopWidth: SENTIMENT_GROUP_BORDER_REM,
                          borderBottomWidth: SENTIMENT_GROUP_BORDER_REM,
                          borderLeftWidth: 0,
                          borderRightWidth: 0,
                          borderStyle: "solid",
                          borderColor: pureBlack,
                          backgroundColor: pureWhite,
                        }}
                      >
                        {LESSON_SENTIMENT_OPTIONS.map((opt, i) => {
                          const checked = lessonSentiment === opt.id;
                          return (
                            <label
                              key={opt.id}
                              className="flex min-w-0 cursor-pointer items-start gap-3 px-4 py-3"
                              style={{
                                backgroundColor: pureWhite,
                                fontSize: `${BODY_STANDARD_REM}rem`,
                                lineHeight: 1.5,
                                color: pureBlack,
                                ...(i > 0
                                  ? {
                                      borderTopWidth: 1,
                                      borderTopStyle: "solid",
                                      borderTopColor: pureBlack,
                                    }
                                  : {}),
                              }}
                            >
                              <span
                                className="relative mt-0.5 flex shrink-0 items-center justify-center rounded-full"
                                style={{
                                  width: "1.25rem",
                                  height: "1.25rem",
                                  borderWidth: SENTIMENT_GROUP_BORDER_REM,
                                  borderStyle: "solid",
                                  borderColor: pureBlack,
                                  boxSizing: "border-box",
                                }}
                                aria-hidden={true}
                              >
                                {checked ? (
                                  <span
                                    className="rounded-full"
                                    style={{
                                      width: "0.5rem",
                                      height: "0.5rem",
                                      backgroundColor: brand500,
                                    }}
                                  />
                                ) : null}
                              </span>
                              <input
                                type="radio"
                                className="sr-only"
                                name="lesson-story-sentiment"
                                value={opt.id}
                                checked={checked}
                                onChange={() => setLessonSentiment(opt.id)}
                              />
                              <span
                                className={
                                  checked
                                    ? "min-w-0 flex-1 font-ds-body font-semibold break-words"
                                    : "min-w-0 flex-1 font-ds-body font-normal break-words"
                                }
                              >
                                {opt.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>

                  <div className="proto-settings-collect-chip mt-8 w-full min-w-0 max-w-full">
                    <DsCtaMainButton
                      type="button"
                      className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={lessonSentiment === null}
                      onClick={() => onContinue?.()}
                    >
                      Continue
                    </DsCtaMainButton>
                  </div>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function LoadingStoryScroller({
  fullText,
  brand500,
  onRewardsContinue,
}: {
  fullText: string;
  brand500: string;
  onRewardsContinue?: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const keywordRefs = useRef<Partial<Record<CollectKeyword, HTMLElement | null>>>(
    {},
  );

  const reduceMotion = usePrefersReducedMotion();
  const [marqueeFinished, setMarqueeFinished] = useState(false);
  const [collected, setCollected] = useState<
    Record<CollectKeyword, boolean>
  >({
    heartbeat: false,
    echoes: false,
    restless: false,
  });

  const bindKeywordRef = useCallback(
    (keyword: CollectKeyword, el: HTMLElement | null) => {
      keywordRefs.current[keyword] = el;
    },
    [],
  );

  useLayoutEffect(() => {
    if (reduceMotion) {
      setCollected((prev) =>
        prev.heartbeat && prev.echoes && prev.restless
          ? prev
          : { heartbeat: true, echoes: true, restless: true },
      );
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) return;

    const obs = new IntersectionObserver(
      (entries) => {
        setCollected((prev) => {
          let next = prev;
          for (const e of entries) {
            if (!(e.target instanceof HTMLElement) || !e.isIntersecting) {
              continue;
            }
            const raw = e.target.dataset.collectKeyword as CollectKeyword | undefined;
            if (!raw || !COLLECT_KEYWORDS.includes(raw)) continue;
            if (!prev[raw]) {
              if (next === prev) next = { ...prev };
              next[raw] = true;
            }
          }
          return next;
        });
      },
      {
        root: viewport,
        rootMargin: "-2px",
        threshold: [0.02, 0.1],
      },
    );

    for (const kw of COLLECT_KEYWORDS) {
      const el = keywordRefs.current[kw];
      if (el) obs.observe(el);
    }

    return () => obs.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || reduceMotion) {
      return;
    }

    const vw = viewport.clientWidth;
    const tw = track.scrollWidth;
    const translateStart = vw;
    const translateEnd = -tw;
    const distancePx = vw + tw;
    const durationMs = Math.round(
      Math.min(Math.max((distancePx / SCROLL_SPEED_PX_PER_SEC) * 1000, 5200), 18000),
    );

    track.getAnimations().forEach((a) => a.cancel());
    track.style.transform = `translate3d(${translateStart}px, 0, 0)`;

    let alive = true;
    const anim = track.animate(
      [
        { transform: `translate3d(${translateStart}px, 0, 0)` },
        { transform: `translate3d(${translateEnd}px, 0, 0)` },
      ],
      {
        duration: durationMs,
        easing: "linear",
        fill: "forwards",
      },
    );

    void anim.finished
      .then(() => {
        if (!alive) return;
        setMarqueeFinished(true);
      })
      .catch(() => {});

    return () => {
      alive = false;
      anim.cancel();
    };
  }, [reduceMotion, fullText]);

  useEffect(() => {
    if (!reduceMotion) return;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    const tw = track.scrollWidth;
    track.style.transform = `translate3d(${-tw}px, 0, 0)`;
    setMarqueeFinished(true);
  }, [reduceMotion, fullText]);

  return (
    <div
      ref={viewportRef}
      className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto"
    >
      <LoadingLeftStack
        collected={collected}
        brand500={brand500}
        marqueeFinished={marqueeFinished}
        onContinue={onRewardsContinue}
      />
      <div className="flex min-h-0 min-w-0 w-full flex-1 items-center overflow-hidden">
        <div ref={trackRef} className="flex w-max shrink-0 will-change-transform flex-row flex-nowrap">
          <span
            className="inline-block whitespace-nowrap font-ds-heading font-normal tracking-tight"
            style={HEADING_6_SCROLL_LINE_STYLE}
          >
            {storyLineCollectableForScroll(
              fullText,
              brand500,
              "scroll",
              bindKeywordRef,
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Rewarding Interaction prototype — app header only (no tab navigation).
 */
export function SettingsExperience() {
  const [phase, setPhase] = useState<"form" | "loading" | "rewards">("form");

  const headingStyle = {
    fontSize: `${HEADING_3.rem}rem`,
    lineHeight: 1.05 as const,
    color: pureBlack,
  };

  const bodyStyle = {
    fontSize: `${BODY_STANDARD_REM}rem`,
    lineHeight: 1.5 as const,
    color: grey[700],
  };

  const lessonIndicatorStyle = {
    fontSize: `${BODY_SMALL_REM}rem`,
    lineHeight: 1.35 as const,
    color: brand[600],
  };

  const lessonHeadingId = "story-response-heading";

  if (phase === "rewards") {
    return <RewardsSummaryView />;
  }

  if (phase === "loading") {
    return (
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-white">
        <DsAppHeader />
        <div
          role="status"
          aria-busy={true}
          aria-live="polite"
          aria-label="Submitting your story"
          className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          <LoadingStoryScroller
            fullText={STORY_PREFILL_TIME_TRAVEL}
            brand500={brand[500]}
            onRewardsContinue={() => setPhase("rewards")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-white">
      <DsAppHeader />

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6">
        <section
          className="flex min-h-full flex-col"
          aria-labelledby={lessonHeadingId}
        >
          <p
            className="m-0 font-ds-body font-semibold tracking-tight"
            style={lessonIndicatorStyle}
          >
            Lesson {LESSON_INDICATOR_NUMBER}
          </p>

          <h1
            id={lessonHeadingId}
            className="m-0 mt-5 font-ds-heading font-normal tracking-tight text-balance"
            style={headingStyle}
          >
            Tell us a story.
          </h1>

          <p className="m-0 mt-3 max-w-prose font-ds-body font-normal" style={bodyStyle}>
            In your own words, tell a story that explains the video you just watched in this
            lesson—what shifted, what you noticed, and how you would describe it to someone else.
          </p>

          <label htmlFor="story-response-draft" className="sr-only">
            Your story
          </label>
          <textarea
            id="story-response-draft"
            name="storyResponse"
            rows={8}
            value={STORY_PREFILL_TIME_TRAVEL}
            readOnly={true}
            tabIndex={-1}
            spellCheck={false}
            className="m-0 mt-5 box-border min-h-[10rem] w-full max-w-prose cursor-default resize-none rounded-none font-ds-body font-normal outline-none"
            style={{
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: pureBlack,
              padding: "0.75rem 1rem",
              fontSize: `${BODY_STANDARD_REM}rem`,
              lineHeight: 1.5,
              color: grey[800],
              backgroundColor: pureWhite,
            }}
            placeholder="Write your story here…"
          />

          <div className="mt-8 flex min-h-0 flex-1 flex-col justify-end pt-4">
            <DsCtaMainButton
              type="button"
              className="w-full max-w-prose cursor-pointer"
              onClick={() => setPhase("loading")}
            >
              Submit
            </DsCtaMainButton>
          </div>
        </section>
      </div>
    </div>
  );
}
