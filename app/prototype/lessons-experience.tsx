"use client";

import {
  BRAND_PRIMARY_HEX,
  brandShades,
  green,
  grey,
  pureBlack,
  pureWhite,
} from "../lib/color-palettes";
import { BODY_SIZES, DISPLAY_LEVELS } from "../lib/typography-scale";
import { DsAppHeader } from "../ui/ds-app-header";
import { DsBottomNav } from "../ui/ds-bottom-nav";

const HEADING_3 = DISPLAY_LEVELS[2];

const BODY_STANDARD_REM =
  BODY_SIZES.find((s) => s.id === "standard")?.rem ?? 1;

const BODY_SMALL_REM =
  BODY_SIZES.find((s) => s.id === "small")?.rem ?? 0.75;

const brand = brandShades(BRAND_PRIMARY_HEX);

/** Half-dome (flat bottom); wide enough for labels like “Circle 10”. */
const CIRCLE_BADGE_DIAMETER_REM = 5;
const CIRCLE_BADGE_RADIUS_REM = CIRCLE_BADGE_DIAMETER_REM / 2;

const DAY_TOTAL = 7;

/** Number of circle blocks in the 70-day story (7 days × 10 circles). */
const STORY_CIRCLE_TOTAL = 10;

/** Four columns × two rows → row 1 has four days; row 2 has three days (fourth column empty for alignment). */
const GRID_COL_COUNT = 4;

/** Internal grid — active circle uses pure black chroming; disabled uses this fill everywhere (badge + borders). */
const DISABLED_CIRCLE_FILL = grey[400];

/** Hairline thickness for grid rules (badge color matches chroming when disabled). */
const GRID_BORDER = "0.25rem";

/** Flame scale for streak chip — compact next to body small. */
const STREAK_CHIP_ICON_REM = "0.875rem";

/** Indicator scale above tile label (body standard) */
const DAY_CHECK_ICON_REM = "1.25rem";

function StreakChipFlameIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="shrink-0"
      aria-hidden
      style={{
        width: STREAK_CHIP_ICON_REM,
        height: STREAK_CHIP_ICON_REM,
      }}
    >
      <path
        fill={pureBlack}
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      />
    </svg>
  );
}

function DayCompleteCircleCheckIcon() {
  const stroke = green[500];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
      aria-hidden
      style={{
        width: DAY_CHECK_ICON_REM,
        height: DAY_CHECK_ICON_REM,
      }}
    >
      <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth={2.25} fill="none" />
      <path
        d="M8 12.25 L11 15 L16 9"
        stroke={stroke}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Down-arrow for the active day tile — glyph matches label color */
function DayActiveArrowDownIcon({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
      aria-hidden
      style={{
        width: DAY_CHECK_ICON_REM,
        height: DAY_CHECK_ICON_REM,
      }}
    >
      <path
        d="M12 5v11M8 13l4 4 4-4"
        stroke={color}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STORY_CIRCLE_GROUPS = Array.from({ length: STORY_CIRCLE_TOTAL }, (_, i) => ({
  n: i + 1,
  disabled: i > 0,
}));

function StoryCircleBlock({
  circleNumber,
  disabled,
  dayWordStyle,
  dayNumberStyle,
}: {
  circleNumber: number;
  disabled: boolean;
  dayWordStyle: { fontSize: string; lineHeight: number };
  dayNumberStyle: { fontSize: string; lineHeight: number };
}) {
  const chromBorder = disabled ? DISABLED_CIRCLE_FILL : pureBlack;
  const badgeBg = chromBorder;
  const badgeFg = pureWhite;
  const tileInactiveFill = grey[50];
  const tileDisabledWord = grey[500];
  const tileDisabledNum = grey[600];

  const globalDayOffset = (circleNumber - 1) * DAY_TOTAL;

  const days = Array.from({ length: DAY_TOTAL }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex flex-col gap-0 leading-none" aria-disabled={disabled}>
      <div className="m-0 block self-start p-0 leading-none">
        <div
          className="box-border flex shrink-0 items-end justify-center pb-px font-ds-body font-bold normal-case"
          style={{
            width: `${CIRCLE_BADGE_DIAMETER_REM}rem`,
            height: `${CIRCLE_BADGE_RADIUS_REM}rem`,
            backgroundColor: badgeBg,
            color: badgeFg,
            borderTopLeftRadius: `${CIRCLE_BADGE_RADIUS_REM}rem`,
            borderTopRightRadius: `${CIRCLE_BADGE_RADIUS_REM}rem`,
            fontSize: `${BODY_SMALL_REM}rem`,
            lineHeight: 1.35,
          }}
        >
          <span className="-translate-y-1 inline-block">Circle {circleNumber}</span>
        </div>
      </div>

      <ol className="-mx-4 -mt-px mb-0 grid w-[calc(100%+2rem)] list-none grid-cols-4 gap-0 border-0 p-0 leading-none outline-none [&>li]:m-0">
        {days.map((slot) => {
          const globalDay = globalDayOffset + slot;
          const index = slot - 1;
          const col = index % GRID_COL_COUNT;
          const row = Math.floor(index / GRID_COL_COUNT);

          let backgroundColor: string;
          let wordColor: string;
          let numColor: string;

          if (disabled) {
            backgroundColor = tileInactiveFill;
            wordColor = tileDisabledWord;
            numColor = tileDisabledNum;
          } else if (globalDay === 1) {
            backgroundColor = green[50];
            wordColor = green[800];
            numColor = green[800];
          } else if (globalDay === 2) {
            backgroundColor = brand[50];
            wordColor = brand[500];
            numColor = brand[500];
          } else {
            backgroundColor = pureWhite;
            wordColor = grey[800];
            numColor = grey[800];
          }

          const isDone = !disabled && globalDay === 1;
          const isCurrent = !disabled && globalDay === 2;

          const borderRightWidth = col < GRID_COL_COUNT - 1 ? GRID_BORDER : 0;
          const borderBottomWidth = GRID_BORDER;

          return (
            <li
              key={`circle-${circleNumber}-slot-${slot}`}
              className="box-border flex aspect-square min-h-0 min-w-0 flex-col items-center justify-center p-2 text-center md:p-3"
              style={{
                backgroundColor,
                borderStyle: "solid",
                borderColor: chromBorder,
                borderLeftWidth: 0,
                borderTopWidth: row === 0 ? GRID_BORDER : 0,
                borderRightWidth,
                borderBottomWidth,
              }}
            >
              <div className="flex min-h-0 w-full flex-col items-center justify-center gap-1">
                {isDone ? (
                  <>
                    <DayCompleteCircleCheckIcon />
                    <span className="sr-only">Completed. </span>
                  </>
                ) : isCurrent ? (
                  <>
                    <DayActiveArrowDownIcon color={brand[500]} />
                    <span className="sr-only">Due next. </span>
                  </>
                ) : null}
                <span className="inline-flex max-w-full flex-wrap items-baseline justify-center gap-1 whitespace-nowrap normal-case">
                  <span
                    className="font-ds-body font-normal"
                    style={{
                      ...dayWordStyle,
                      color: wordColor,
                    }}
                  >
                    Day
                  </span>
                  <span
                    className="font-ds-body font-semibold tabular-nums"
                    style={{
                      ...dayNumberStyle,
                      color: numColor,
                    }}
                  >
                    {globalDay}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * Lessons flow prototype — 70-day grid under shared app chrome.
 */
export function LessonsExperience() {
  const headingStyle = {
    fontSize: `${HEADING_3.rem}rem`,
    lineHeight: 1.05 as const,
    color: pureBlack,
  };

  const chipTextStyle = {
    fontSize: `${BODY_SMALL_REM}rem`,
    lineHeight: 1.35 as const,
    color: pureBlack,
  };

  const dayWordStyle = {
    fontSize: `${BODY_SMALL_REM}rem`,
    lineHeight: 1.35 as const,
  };

  const dayNumberStyle = {
    fontSize: `${BODY_STANDARD_REM}rem`,
    lineHeight: 1.25 as const,
  };

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-white">
      <DsAppHeader />

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6">
        <section aria-labelledby="story-heading">
          <h1
            id="story-heading"
            className="m-0 font-ds-heading font-normal tracking-tight text-balance"
            style={headingStyle}
          >
            Your 70 Day Story
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div
              className="inline-flex items-center gap-1.5 rounded-none px-2 py-1 font-ds-body font-normal"
              style={{
                backgroundColor: brand[100],
                ...chipTextStyle,
              }}
            >
              <StreakChipFlameIcon />
              <span>1 day streak</span>
            </div>
            <div
              className="rounded-none px-2 py-1 font-ds-body font-normal"
              style={{
                backgroundColor: brand[100],
                ...chipTextStyle,
              }}
            >
              Pause tokens: 9
            </div>
          </div>

          {STORY_CIRCLE_GROUPS.map(({ n, disabled }) => (
            <StoryCircleBlock
              key={n}
              circleNumber={n}
              disabled={disabled}
              dayWordStyle={dayWordStyle}
              dayNumberStyle={dayNumberStyle}
            />
          ))}
        </section>
      </div>

      <DsBottomNav />
    </div>
  );
}
