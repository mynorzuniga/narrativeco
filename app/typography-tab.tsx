"use client";

import { createElement } from "react";
import {
  BODY_SIZES,
  BODY_WEIGHTS,
  DISPLAY_LEVELS,
} from "./lib/typography-scale";

const SAMPLE = "The quick brown fox jumps over the lazy dog.";

export function TypographyTab() {
  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-3xl text-sm leading-6 text-zinc-600">
        <strong className="font-medium text-zinc-800">Headings</strong> use
        Bebas Neue (loaded via Google Fonts).{" "}
        <strong className="font-medium text-zinc-800">Body and links</strong>{" "}
        use Helvetica Now Display with a sensible sans fallback. If Helvetica
        Now is installed on the system, it is used automatically; otherwise the
        next font in the stack applies.
      </p>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">
          Headings — Bebas Neue
        </h2>
        <p className="mt-1 text-sm text-zinc-500">Six typographic levels.</p>
        <div className="mt-6 flex flex-col gap-6 border-t border-zinc-100 pt-6">
          {DISPLAY_LEVELS.map(({ level, label, rem }) =>
            createElement(
              `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
              {
                key: level,
                className:
                  "font-ds-heading font-normal tracking-tight text-balance text-zinc-950",
                style: { fontSize: `${rem}rem`, lineHeight: 1.05 },
              },
              label,
            ),
          )}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">
          Body — Helvetica Now Display
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Standard (1rem), Small (0.75rem), and Micro (0.625rem), each in
          regular, semibold, and bold.
        </p>
        <div className="mt-6 flex flex-col gap-10 border-t border-zinc-100 pt-6">
          {BODY_SIZES.map(({ id, label, rem }) => (
            <div key={id}>
              <h3 className="text-sm font-semibold text-zinc-800">
                {label}{" "}
                <span className="font-mono font-normal text-zinc-500">
                  ({rem}rem)
                </span>
              </h3>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                {BODY_WEIGHTS.map(({ id: wId, label: wLabel, className }) => (
                  <div key={wId}>
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                      {wLabel}
                    </p>
                    <p
                      className={`font-ds-body text-zinc-900 ${className}`}
                      style={{ fontSize: `${rem}rem`, lineHeight: 1.5 }}
                    >
                      {SAMPLE}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">
          Links — Helvetica Now Display
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Same scale and weights as body, with underline.
        </p>
        <div className="mt-6 flex flex-col gap-10 border-t border-zinc-100 pt-6">
          {BODY_SIZES.map(({ id, label, rem }) => (
            <div key={`link-${id}`}>
              <h3 className="text-sm font-semibold text-zinc-800">
                {label}{" "}
                <span className="font-mono font-normal text-zinc-500">
                  ({rem}rem)
                </span>
              </h3>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                {BODY_WEIGHTS.map(({ id: wId, label: wLabel, className }) => (
                  <div key={`link-${id}-${wId}`}>
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                      {wLabel}
                    </p>
                    <p
                      className={`font-ds-body text-zinc-900 underline decoration-zinc-900 decoration-solid underline-offset-[0.2em] ${className}`}
                      style={{ fontSize: `${rem}rem`, lineHeight: 1.5 }}
                    >
                      {SAMPLE}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
