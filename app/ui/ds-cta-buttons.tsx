import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  BRAND_PRIMARY_HEX,
  brandShades,
  grey,
  pureBlack,
  pureWhite,
} from "../lib/color-palettes";
import { DISPLAY_LEVELS } from "../lib/typography-scale";

const brand = brandShades(BRAND_PRIMARY_HEX);
const HEADING_5 = DISPLAY_LEVELS.find((l) => l.level === 5)!;

const baseClassName =
  "inline-flex items-center justify-center rounded-none border-0 px-6 font-ds-heading font-normal tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950";

/** Bebas Neue sits high in the line box; nudge label down for optical vertical centering. */
function CtaLabel({ children }: { children: ReactNode }) {
  return <span className="inline-block translate-y-0.5">{children}</span>;
}

type DsCtaButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function DsCtaMainButton({
  className = "",
  style,
  children = "Button",
  ...props
}: DsCtaButtonProps) {
  return (
    <button
      type="button"
      className={`${baseClassName} cursor-pointer ${className}`.trim()}
      style={{
        height: "3.25rem",
        backgroundColor: brand[500],
        color: pureWhite,
        fontSize: `${HEADING_5.rem}rem`,
        lineHeight: 1.05,
        ...style,
      }}
      {...props}
    >
      <CtaLabel>{children}</CtaLabel>
    </button>
  );
}

export function DsCtaSecondaryButton({
  className = "",
  style,
  children = "Button",
  ...props
}: DsCtaButtonProps) {
  return (
    <button
      type="button"
      className={`${baseClassName} cursor-pointer focus-visible:outline-white ${className}`.trim()}
      style={{
        height: "3.25rem",
        backgroundColor: pureBlack,
        color: grey[100],
        fontSize: `${HEADING_5.rem}rem`,
        lineHeight: 1.05,
        ...style,
      }}
      {...props}
    >
      <CtaLabel>{children}</CtaLabel>
    </button>
  );
}
