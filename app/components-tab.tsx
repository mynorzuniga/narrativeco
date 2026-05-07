"use client";

import { useId, useState } from "react";
import { BODY_SIZES } from "./lib/typography-scale";
import { DsBottomNav } from "./ui/ds-bottom-nav";
import { DsAppFooter } from "./ui/ds-app-footer";
import { DsAppHeader } from "./ui/ds-app-header";
import { DsCtaMainButton, DsCtaSecondaryButton } from "./ui/ds-cta-buttons";

const BODY_STANDARD_REM =
  BODY_SIZES.find((s) => s.id === "standard")?.rem ?? 1;

const BODY_SMALL_REM =
  BODY_SIZES.find((s) => s.id === "small")?.rem ?? 0.75;

const BODY_MICRO_REM =
  BODY_SIZES.find((s) => s.id === "micro")?.rem ?? 0.625;

const SUBTABS = [
  { id: "cta", label: "CTA" },
  { id: "header-footer", label: "Header and footer" },
  { id: "navigation", label: "Navigation" },
] as const;

type SubTabId = (typeof SUBTABS)[number]["id"];

export function ComponentsTab() {
  const baseId = useId();
  const [active, setActive] = useState<SubTabId>("cta");

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-3xl text-sm leading-6 text-zinc-600">
        <strong className="font-medium text-zinc-800">Components</strong> are
        built from tokens in <span className="font-mono text-zinc-500">color-palettes</span>{" "}
        and <span className="font-mono text-zinc-500">typography-scale</span>.
        Each subtab documents a category of UI.
      </p>

      <div
        role="tablist"
        aria-label="Component categories"
        className="flex gap-1 border-b border-zinc-200"
      >
        {SUBTABS.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-${tab.id}-subtab`}
              aria-selected={selected}
              aria-controls={`${baseId}-${tab.id}-subpanel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={
                selected
                  ? "-mb-px border-b-2 border-zinc-950 px-4 py-2.5 text-sm font-medium text-zinc-950"
                  : "border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {SUBTABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-${tab.id}-subpanel`}
          aria-labelledby={`${baseId}-${tab.id}-subtab`}
          hidden={active !== tab.id}
        >
          {tab.id === "cta" ? (
            <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                CTA buttons
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Main: brand 500 fill, Heading 5 (Bebas Neue), white label, height{" "}
                <span className="font-mono text-zinc-600">3.25rem</span>, square
                corners. Secondary: black fill, Heading 5, grey 100 label, same
                shape and height.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-6">
                <DsCtaMainButton>Main</DsCtaMainButton>
                <DsCtaSecondaryButton>Secondary</DsCtaSecondaryButton>
              </div>
            </section>
          ) : tab.id === "header-footer" ? (
            <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                Header and footer
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                App chrome (navigation bar, footer bar) documented here as we add patterns.
              </p>

              <div className="mt-8 border-t border-zinc-100 pt-8">
                <h3 className="text-base font-semibold text-zinc-900">Header</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Height <span className="font-mono text-zinc-600">3.75rem</span>,{" "}
                  <span className="font-mono text-zinc-600">pureWhite</span> fill,{" "}
                  <span className="font-mono text-zinc-600">grey[200]</span> hairline bottom
                  edge, inset <span className="font-mono text-zinc-600">1rem</span> horizontal (
                  <span className="font-mono text-zinc-600">px-4</span>). Three columns: streak
                  cluster with flame glyph (
                  <span className="font-mono text-zinc-600">brand[500]</span>) plus overlaid tally
                  in body micro (
                  <span className="font-mono text-zinc-600">{`${BODY_MICRO_REM}rem`}</span>)
                  semibold <span className="font-mono text-zinc-600">pureBlack</span>; centered
                  Narrative
                  <span className="font-mono text-zinc-600">Co</span> wordmark sized to Heading&nbsp;6
                  rem with semibold <span className="font-mono text-zinc-600">font-ds-body</span>,
                  Narrative in <span className="font-mono text-zinc-600">pureBlack</span> and{" "}
                  <span className="font-mono text-zinc-600">Co</span> tinted{" "}
                  <span className="font-mono text-zinc-600">brand[500]</span> (parity with NarrativeCo
                  previews); trailing notification + avatar triggers reuse{" "}
                  <span className="font-mono text-zinc-600">pureBlack</span> iconography on{" "}
                  <span className="font-mono text-zinc-600">2.75rem</span> square hit zones.
                </p>
                <div className="mt-6 overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 p-4">
                  <DsAppHeader />
                </div>
              </div>

              <div className="mt-8 border-t border-zinc-100 pt-8">
                <h3 className="text-base font-semibold text-zinc-900">Footer</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Height <span className="font-mono text-zinc-600">2rem</span>,{" "}
                  <span className="font-mono text-zinc-600">grey[200]</span>{" "}
                  background, horizontal padding <span className="font-mono text-zinc-600">1rem</span>{" "}
                  (<span className="font-mono text-zinc-600">px-4</span>), body small ({BODY_SMALL_REM}rem),
                  regular, <span className="font-mono text-zinc-600">grey[700]</span>{" "}
                  copy. Links: Terms and Conditions (start), Privacy Policy (end),{" "}
                  <span className="font-mono text-zinc-600">justify-between</span>.
                </p>
                <div className="mt-6 overflow-hidden rounded-md border border-zinc-100">
                  <DsAppFooter />
                </div>
              </div>
            </section>
          ) : tab.id === "navigation" ? (
            <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                Bottom navigation
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Height{" "}
                <span className="font-mono text-zinc-600">3.75rem</span>,{" "}
                <span className="font-mono text-zinc-600">pureWhite</span> chrome with{" "}
                <span className="font-mono text-zinc-600">pureBlack</span>{" "}
                <span className="font-mono text-zinc-600">0.25rem</span> top rule only (no lateral or bottom
                outer border),
                <span className="font-mono text-zinc-600">w-full</span> of its parent. Split
                into equal halves by a centered vertical{" "}
                <span className="font-mono text-zinc-600">pureBlack</span>{" "}
                <span className="font-mono text-zinc-600">0.25rem</span> divider.
                Left: home glyph + Feed in{" "}
                <span className="font-mono text-zinc-600">pureBlack</span>, body standard (
                <span className="font-mono text-zinc-600">{BODY_STANDARD_REM}rem</span>) semibold.
                Right segment: <span className="font-mono text-zinc-600">brand[50]</span> ground,
                book-open glyph in <span className="font-mono text-zinc-600">brand[500]</span>, Learn
                label body standard bold in{" "}
                <span className="font-mono text-zinc-600">brand[800]</span> (selected emphasis).
              </p>
              <div className="mt-6 max-w-xl border-t border-zinc-100 pt-6">
                <DsBottomNav />
              </div>
            </section>
          ) : null}
        </div>
      ))}
    </div>
  );
}
