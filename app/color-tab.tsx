"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BRAND_PRIMARY_HEX,
  brandShades,
  green,
  grey,
  pureBlack,
  pureWhite,
  red,
  SHADE_STEPS,
  type ShadeScale,
  yellow,
} from "./lib/color-palettes";

function Swatch({
  label,
  hex,
  subtleBorder,
}: {
  label: string;
  hex: string;
  /** Visible edge on very light fills */
  subtleBorder?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }, [hex]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-stretch gap-2">
      {copied ? (
        <span
          className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white shadow-md"
          role="status"
        >
          copied
        </span>
      ) : null}
      <span className="text-center text-[10px] font-medium tabular-nums tracking-wide text-zinc-500">
        {label}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy color ${hex}`}
        style={{ backgroundColor: hex }}
        className={`h-16 w-full min-w-[4.5rem] cursor-pointer rounded-lg shadow-sm transition-transform active:scale-[0.98] ${
          subtleBorder
            ? "ring-1 ring-inset ring-zinc-300"
            : "ring-1 ring-inset ring-black/5"
        }`}
      />
      <button
        type="button"
        onClick={copy}
        className="w-full cursor-pointer text-center font-mono text-[11px] font-medium tracking-tight text-zinc-700 underline-offset-2 hover:underline"
      >
        {hex}
      </button>
    </div>
  );
}

function PaletteSection({
  title,
  subtitle,
  scale,
}: {
  title: string;
  subtitle?: string;
  scale: ShadeScale;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-zinc-500">{subtitle}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(4.75rem,1fr))] gap-x-4 gap-y-6">
        {SHADE_STEPS.map((step) => (
          <Swatch
            key={step}
            label={String(step)}
            hex={scale[step]}
            subtleBorder={step <= 100}
          />
        ))}
      </div>
    </section>
  );
}

function BaseNeutralsSection() {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          White &amp; black
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Pure endpoints for layouts and typography on light surfaces.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:max-w-md">
        <Swatch label="White" hex={pureWhite} subtleBorder />
        <Swatch label="Black" hex={pureBlack} />
      </div>
    </section>
  );
}

export function ColorTab() {
  const brand = brandShades(BRAND_PRIMARY_HEX);

  return (
    <div className="flex flex-col gap-8">
      <PaletteSection title="Grey" scale={grey} />
      <PaletteSection title="Red" scale={red} />
      <PaletteSection title="Yellow" scale={yellow} />
      <PaletteSection title="Green" scale={green} />
      <PaletteSection
        title="Brand"
        subtitle={`Base ${BRAND_PRIMARY_HEX} at shade 500`}
        scale={brand}
      />
      <BaseNeutralsSection />
    </div>
  );
}
