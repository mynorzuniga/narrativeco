import type { ComponentPropsWithoutRef } from "react";
import { BRAND_PRIMARY_HEX, brandShades, pureBlack, pureWhite } from "../lib/color-palettes";
import { BODY_SIZES } from "../lib/typography-scale";

const brand = brandShades(BRAND_PRIMARY_HEX);

const ICON_REM = "1.25rem";

const BODY_STANDARD_REM =
  BODY_SIZES.find((s) => s.id === "standard")?.rem ?? 1;

const labelStyleFeed = {
  fontSize: `${BODY_STANDARD_REM}rem`,
  lineHeight: 1.25 as const,
  color: pureBlack,
};

const dividerWidth = "0.25rem";
const outerBorder = "0.25rem";

function HomeIcon({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
      style={{ width: ICON_REM, height: ICON_REM }}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

function BookOpenIcon({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
      style={{ width: ICON_REM, height: ICON_REM }}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export type DsBottomNavProps = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
>;

/**
 * Two-segment primary bottom navigation — documented under Components → Navigation.
 */
export function DsBottomNav({
  className = "",
  style,
  "aria-label": ariaLabel = "Main sections",
  ...props
}: DsBottomNavProps) {
  const labelStyleLearn = {
    fontSize: `${BODY_STANDARD_REM}rem`,
    lineHeight: 1.25 as const,
    color: brand[800],
  };

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={`box-border flex min-h-0 w-full min-w-0 shrink-0 items-stretch ${className}`.trim()}
      style={{
        height: "3.75rem",
        backgroundColor: pureWhite,
        borderStyle: "solid",
        borderColor: pureBlack,
        borderTopWidth: outerBorder,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        ...style,
      }}
    >
      <div className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-2 bg-white px-3">
        <span className="inline-flex shrink-0 items-center gap-2">
          <HomeIcon color={pureBlack} />
          <span
            className="font-ds-body font-semibold tracking-tight"
            style={labelStyleFeed}
          >
            Feed
          </span>
        </span>
      </div>
      <div
        aria-hidden
        className="shrink-0 self-stretch"
        style={{ width: dividerWidth, backgroundColor: pureBlack }}
      />
      <div
        className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-2 px-3"
        style={{ backgroundColor: brand[50] }}
      >
        <span className="inline-flex shrink-0 items-center gap-2">
          <BookOpenIcon color={brand[500]} />
          <span
            className="font-ds-body font-bold tracking-tight"
            style={labelStyleLearn}
          >
            Learn
          </span>
        </span>
      </div>
    </nav>
  );
}
