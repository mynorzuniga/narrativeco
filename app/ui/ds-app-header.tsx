import type { ComponentPropsWithoutRef } from "react";
import { BRAND_PRIMARY_HEX, brandShades, grey, pureBlack } from "../lib/color-palettes";
import { BODY_SIZES, DISPLAY_LEVELS } from "../lib/typography-scale";

const brand = brandShades(BRAND_PRIMARY_HEX);

/** Matches prototype preview wordmark scale (Heading 6 rem). */
const LOGO_WORDMARK_REM =
  DISPLAY_LEVELS.find((d) => d.level === 6)?.rem ?? 1.5;

const BODY_MICRO_REM =
  BODY_SIZES.find((s) => s.id === "micro")?.rem ?? 0.625;

const ICON_REM = "1.25rem";

export type DsAppHeaderProps = Omit<
  ComponentPropsWithoutRef<"header">,
  "children"
> & {
  /** Shown beside / on the streak flame cluster (defaults for demo). */
  streakCount?: string | number;
};

function FlameIcon({
  fill,
  className = "",
}: {
  fill: string;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`.trim()}
      style={{
        width: ICON_REM,
        height: ICON_REM,
      }}
    >
      <path
        fill={fill}
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={pureBlack}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
      style={{ width: ICON_REM, height: ICON_REM }}
    >
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9Z" />
      <path d="M10.3 21a2 2 0 0 0 3.4 0" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={pureBlack}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
      style={{ width: ICON_REM, height: ICON_REM }}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const iconButtonBase =
  "inline-flex size-11 cursor-pointer shrink-0 items-center justify-center border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

/**
 * Primary app navigation bar — see Components → Header and footer in `components-tab.tsx`.
 */
export function DsAppHeader({
  streakCount = 7,
  className = "",
  style,
  ...props
}: DsAppHeaderProps) {
  const countLabel = String(streakCount);

  return (
    <header
      {...props}
      className={[
        "box-border grid h-[3.75rem] w-full shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 bg-white px-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: grey[200],
        ...style,
      }}
    >
      <div className="flex min-w-0 items-center gap-2 justify-self-start">
        <div
          className="relative inline-flex shrink-0 items-center justify-center"
          role="group"
          aria-label={`Streak count ${countLabel}`}
        >
          <FlameIcon fill={brand[500]} />
          <span
            className="pointer-events-none absolute right-0 top-0 min-w-[1ch] -translate-y-0.5 font-ds-body font-semibold tabular-nums leading-none"
            style={{
              fontSize: `${BODY_MICRO_REM}rem`,
              color: pureBlack,
            }}
            aria-hidden
          >
            {countLabel}
          </span>
        </div>
      </div>

      <p
        className="m-0 justify-self-center truncate text-center font-ds-body font-semibold leading-none"
        style={{
          fontSize: `${LOGO_WORDMARK_REM}rem`,
          lineHeight: 1,
          color: pureBlack,
        }}
      >
        Narrative<span style={{ color: brand[500] }}>Co</span>
      </p>

      <div className="flex shrink-0 items-center justify-end gap-1 justify-self-end">
        <button type="button" className={iconButtonBase} aria-label="Notifications">
          <BellIcon />
        </button>
        <button type="button" className={iconButtonBase} aria-label="Account menu">
          <UserIcon />
        </button>
      </div>
    </header>
  );
}
