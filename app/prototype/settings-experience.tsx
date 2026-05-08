"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";
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
const HEADING_4 = DISPLAY_LEVELS.find((l) => l.level === 4)!;
const HEADING_5 = DISPLAY_LEVELS.find((l) => l.level === 5)!;

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

/** Keywords to highlight in scan order (must appear in sample story). */
const SCAN_KEYWORDS_ORDER = ["heartbeat", "echoes", "restless"] as const;

function normalizeWordForKeyword(word: string): string {
  return word.replace(/^\W+|\W+$/gu, "").toLowerCase();
}

/** First occurrence index per keyword, in story order. */
function findKeywordWordIndices(words: ReadonlyArray<string>): number[] | null {
  const consumed = new Set<number>();
  const indices: number[] = [];

  for (const key of SCAN_KEYWORDS_ORDER) {
    const idx = words.findIndex((w, i) => {
      if (consumed.has(i)) return false;
      return normalizeWordForKeyword(w) === key;
    });
    if (idx < 0) {
      return null;
    }
    consumed.add(idx);
    indices.push(idx);
  }

  return indices;
}

/** Title-case labels aligned with `SCAN_KEYWORDS_ORDER` (story keywords). */
const SCAN_KEYWORD_HEADING_LABELS = ["Heartbeat", "Echoes", "Restless"] as const;

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

/** Brief pause after the last on-story keyword pulse before the anchor “page”. */
const STORY_EVAL_BEFORE_ANCHOR_PAGE_MS = 600;

/** Fade-out for “Evaluating” + story before anchor handoff (not used if reduce motion). */
const STORY_PHASE_EXIT_MS = 620;
/** Pace for revealing each anchor line (one under the next). */
const ANCHOR_STACK_STAGGER_MS = 380;
/** Breath after last line’s entrance before Great Job / sentiment. */
const ANCHOR_STACK_SETTLE_MS = 300;

/** Story evaluation: text fade-in, then scan pass, then three “selected” words. */
const STORY_EVAL_ENTER_MS = 1100;
/** Duration of sliding grey-window scan (left → right; max 4 words grey at once). */
const STORY_EVAL_GREY_SWEEP_MS = 4200;
const STORY_EVAL_FINAL_KEYWORD_MS = 1500;

/** Up to this many adjacent words may use muted grey during the scan pass. */
const SCAN_GREY_WINDOW_SIZE = 4;

/** Muted sweep: lighter than body black so the sliding window stays readable. */
const SCAN_WORD_GREY = grey[400];

function StoryEvaluationScan({
  text,
  brand500,
  reduceMotion,
  onComplete,
}: {
  text: string;
  brand500: string;
  reduceMotion: boolean;
  onComplete: () => void;
}) {
  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);
  const keywordIndices = useMemo(() => findKeywordWordIndices(words), [words]);

  const orderByWordIndex = useMemo(() => {
    const m = new Map<number, number>();
    keywordIndices?.forEach((wordIndex, order) => {
      m.set(wordIndex, order);
    });
    return m;
  }, [keywordIndices]);

  const parentNotifiedRef = useRef(false);

  const notifyParent = useCallback(() => {
    if (parentNotifiedRef.current) return;
    parentNotifiedRef.current = true;
    onComplete();
  }, [onComplete]);

  const [textOpacity, setTextOpacity] = useState(0);
  /** enter → fade; scan → sliding grey; pick0–2 → keyword pulses on story text. */
  const [phase, setPhase] = useState<
    "enter" | "scan" | "pick0" | "pick1" | "pick2"
  >("enter");
  /**
   * In scan phase, grey applies to indices in [scanGreyWindowStart, scanGreyWindowStart + WINDOW).
   * Advances 0 → words.length so the window slides left-to-right and ends with all black.
   */
  const [scanGreyWindowStart, setScanGreyWindowStart] = useState(0);

  const paragraphShellStyle: CSSProperties & { ["--proto-scan-brand"]?: string } = {
    ["--proto-scan-brand"]: brand500,
  };

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setTextOpacity(1));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (words.length === 0) {
      notifyParent();
      return;
    }
    if (!keywordIndices || keywordIndices.length < SCAN_KEYWORDS_ORDER.length) {
      const id = window.setTimeout(notifyParent, 60);
      return () => window.clearTimeout(id);
    }

    if (reduceMotion) {
      setTextOpacity(1);
      setPhase("pick2");
      const id = window.setTimeout(notifyParent, 80);
      return () => window.clearTimeout(id);
    }

    let cancelled = false;
    const t0 = STORY_EVAL_ENTER_MS;
    const tScanEnd = t0 + STORY_EVAL_GREY_SWEEP_MS;
    const tPick0 = tScanEnd;
    const tPick1 = tPick0 + STORY_EVAL_FINAL_KEYWORD_MS;
    const tPick2 = tPick1 + STORY_EVAL_FINAL_KEYWORD_MS;
    const tStoryComplete =
      tPick2 + STORY_EVAL_FINAL_KEYWORD_MS + STORY_EVAL_BEFORE_ANCHOR_PAGE_MS;

    const ids: number[] = [
      window.setTimeout(() => {
        if (!cancelled) setPhase("scan");
      }, t0),
      window.setTimeout(() => {
        if (!cancelled) setPhase("pick0");
      }, tPick0),
      window.setTimeout(() => {
        if (!cancelled) setPhase("pick1");
      }, tPick1),
      window.setTimeout(() => {
        if (!cancelled) setPhase("pick2");
      }, tPick2),
      window.setTimeout(() => {
        if (!cancelled) notifyParent();
      }, tStoryComplete),
    ];

    return () => {
      cancelled = true;
      ids.forEach((id) => window.clearTimeout(id));
    };
  }, [words.length, keywordIndices, reduceMotion, notifyParent]);

  useEffect(() => {
    if (phase !== "scan" || reduceMotion || words.length === 0) {
      return;
    }

    setScanGreyWindowStart(0);
    const start = performance.now();
    const duration = STORY_EVAL_GREY_SWEEP_MS;
    let rafId = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const n = words.length;
      const next = Math.min(n, Math.floor(t * (n + 1)));
      setScanGreyWindowStart(next);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [phase, words.length, reduceMotion]);

  const wordNodes = words.map((word, i) => {
    const o = orderByWordIndex.get(i);
    const activeFinal =
      (phase === "pick0" && o === 0) ||
      (phase === "pick1" && o === 1) ||
      (phase === "pick2" && o === 2);

    const lockedAfter =
      o !== undefined &&
      ((phase === "pick1" && o === 0) ||
        (phase === "pick2" && (o === 0 || o === 1)));

    const showBrand =
      activeFinal ||
      lockedAfter ||
      (reduceMotion && o !== undefined);

    const inGreyWindow =
      phase === "scan" &&
      i >= scanGreyWindowStart &&
      i < scanGreyWindowStart + SCAN_GREY_WINDOW_SIZE;

    const color = showBrand
      ? brand500
      : inGreyWindow
        ? SCAN_WORD_GREY
        : pureBlack;

    const klass = [
      !reduceMotion && activeFinal ? "proto-settings-scan-hit" : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    const style: CSSProperties = {
      color,
      fontWeight: 400,
      transition: "color 0.22s ease-out",
    };

    return (
      <Fragment key={`eval-${i}-${word.slice(0, 20)}`}>
        {i > 0 ? " " : null}
        <span className={klass || undefined} style={style}>
          {word}
        </span>
      </Fragment>
    );
  });

  const evaluatingStatusStyle: CSSProperties = {
    fontSize: `${HEADING_4.rem}rem`,
    lineHeight: 1.05,
    color: pureBlack,
  };

  return (
    <>
      <div className="flex w-full min-w-0 flex-col items-start">
        <div
          className="flex w-full max-w-prose flex-col items-start py-2 transition-opacity duration-[1050ms] ease-out"
          style={{
            ...paragraphShellStyle,
            gap: `${BODY_SMALL_REM}rem`,
            opacity: reduceMotion ? 1 : textOpacity,
          }}
        >
          <p
            className="m-0 text-left font-ds-heading font-normal tracking-tight text-balance"
            role="status"
            aria-live="polite"
            style={evaluatingStatusStyle}
          >
            Evaluating
            {!reduceMotion ? (
              <span className="proto-settings-evaluating-dots" aria-hidden>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              "…"
            )}
          </p>
          <p
            className="m-0 text-left font-ds-body font-normal text-pretty break-words leading-relaxed"
            style={{
              fontSize: `${BODY_STANDARD_REM}rem`,
              color: pureBlack,
            }}
          >
            {wordNodes}
          </p>
        </div>
      </div>
    </>
  );
}

/** Three anchor words — reveal one under the next, then `onStackComplete`. */
function AnchorKeywordsCluster({
  brand500,
  reduceMotion,
  onStackComplete,
}: {
  brand500: string;
  reduceMotion: boolean;
  onStackComplete?: () => void;
}) {
  const [revealed, setRevealed] = useState(0);

  const headingStyle: CSSProperties = {
    fontSize: `${HEADING_4.rem}rem`,
    lineHeight: 1.05,
    color: brand500,
  };

  useEffect(() => {
    if (!onStackComplete) return;

    if (reduceMotion) {
      setRevealed(SCAN_KEYWORDS_ORDER.length);
      const id = window.setTimeout(onStackComplete, 60);
      return () => window.clearTimeout(id);
    }

    const stagger = ANCHOR_STACK_STAGGER_MS;
    const ids: number[] = [];
    for (let k = 1; k <= SCAN_KEYWORDS_ORDER.length; k++) {
      ids.push(
        window.setTimeout(() => setRevealed(k), stagger * (k - 1)),
      );
    }
    const lastStart = stagger * (SCAN_KEYWORDS_ORDER.length - 1);
    ids.push(
      window.setTimeout(
        onStackComplete,
        lastStart + CELEBRATION_CHIP_MS + ANCHOR_STACK_SETTLE_MS,
      ),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [onStackComplete, reduceMotion]);

  return (
    <div
      className="proto-settings-anchor-stack mx-auto w-full max-w-prose self-start"
      aria-label="Anchor words from your story"
    >
      <div className="flex w-full flex-col items-start gap-[0.35rem] text-left">
        {SCAN_KEYWORD_HEADING_LABELS.map((label, i) => {
          if (revealed <= i) return null;
          return (
            <h4
              key={label}
              className="m-0 w-full font-ds-heading font-normal capitalize tracking-tight proto-settings-collect-chip"
              style={headingStyle}
            >
              {label.toLowerCase()}
            </h4>
          );
        })}
      </div>
    </div>
  );
}

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

/** Great Job, explanation, and sentiment — flows below the scan (no full-screen overlay). */
function PostScanCelebration({
  brand500,
  revealFinished,
  onContinue,
}: {
  brand500: string;
  revealFinished: boolean;
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
    if (!revealFinished) {
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
  }, [revealFinished, reduceMotion]);

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

  if (!revealFinished) {
    return null;
  }

  return (
    <section
      aria-live="polite"
      className="mx-auto mt-8 flex w-full min-w-0 max-w-prose flex-col"
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
                <span className="font-normal" style={{ color: brand500 }}>
                  Heartbeat
                </span>
                ,{" "}
                <span className="font-normal" style={{ color: brand500 }}>
                  Echoes
                </span>
                , and{" "}
                <span className="font-normal" style={{ color: brand500 }}>
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
                    className="proto-settings-collect-chip min-w-0"
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
    </section>
  );
}

function LoadingAfterSubmit({
  fullText,
  brand500,
  onRewardsContinue,
}: {
  fullText: string;
  brand500: string;
  onRewardsContinue?: () => void;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [postFlow, setPostFlow] = useState<
    "story" | "storyExit" | "anchor" | "celebration"
  >("story");

  const handleStoryComplete = useCallback(() => {
    if (reduceMotion) {
      setPostFlow("anchor");
    } else {
      setPostFlow("storyExit");
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (postFlow !== "storyExit") return;
    const id = window.setTimeout(
      () => setPostFlow("anchor"),
      STORY_PHASE_EXIT_MS,
    );
    return () => window.clearTimeout(id);
  }, [postFlow]);

  const handleAnchorStackComplete = useCallback(() => {
    setPostFlow("celebration");
  }, []);

  const showStory =
    postFlow === "story" || postFlow === "storyExit";

  const storyHandoffOpacity = postFlow === "storyExit" ? 0 : 1;

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
      <div className="relative z-0 flex min-h-0 min-w-0 flex-1 flex-col justify-start px-4 pb-12 pt-6">
        {showStory ? (
          <div
            className={
              reduceMotion
                ? "w-full"
                : "w-full transition-[opacity] ease-out motion-reduce:transition-none"
            }
            style={
              reduceMotion
                ? undefined
                : {
                    opacity: storyHandoffOpacity,
                    transitionDuration: `${STORY_PHASE_EXIT_MS}ms`,
                  }
            }
            aria-hidden={postFlow === "storyExit"}
          >
            <StoryEvaluationScan
              text={fullText}
              brand500={brand500}
              reduceMotion={reduceMotion}
              onComplete={handleStoryComplete}
            />
          </div>
        ) : null}

        {postFlow !== "story" && postFlow !== "storyExit" ? (
          <>
            <div
              className={
                reduceMotion
                  ? "w-full"
                  : "proto-settings-post-story-handoff-enter w-full"
              }
            >
              <AnchorKeywordsCluster
                brand500={brand500}
                reduceMotion={reduceMotion}
                onStackComplete={handleAnchorStackComplete}
              />
            </div>
            {postFlow === "celebration" && (
              <PostScanCelebration
                brand500={brand500}
                revealFinished={true}
                onContinue={onRewardsContinue}
              />
            )}
          </>
        ) : null}
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
          className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto"
        >
          <LoadingAfterSubmit
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
