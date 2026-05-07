import type { ComponentPropsWithoutRef } from "react";
import { grey } from "../lib/color-palettes";
import { BODY_SIZES } from "../lib/typography-scale";

const BODY_SMALL_REM =
  BODY_SIZES.find((s) => s.id === "small")?.rem ?? 0.75;

const baseClassName =
  "box-border flex w-full shrink-0 items-center justify-between px-4 font-ds-body font-normal";

/**
 * App footer chrome (see Components → Header and footer in `components-tab.tsx`).
 */
export type DsAppFooterProps = Omit<
  ComponentPropsWithoutRef<"footer">,
  "children"
>;

export function DsAppFooter({
  className = "",
  style,
  ...props
}: DsAppFooterProps) {
  return (
    <footer
      {...props}
      className={[baseClassName, className].filter(Boolean).join(" ")}
      style={{
        height: "2rem",
        backgroundColor: grey[200],
        color: grey[700],
        fontSize: `${BODY_SMALL_REM}rem`,
        ...style,
      }}
    >
      <a href="#" className="text-inherit">
        Terms and Conditions
      </a>
      <a href="#" className="text-inherit">
        Privacy Policy
      </a>
    </footer>
  );
}
