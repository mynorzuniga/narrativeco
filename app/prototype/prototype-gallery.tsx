"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BRAND_PRIMARY_HEX, brandShades, grey, pureBlack, pureWhite } from "../lib/color-palettes";
import { BODY_SIZES, DISPLAY_LEVELS } from "../lib/typography-scale";
import { StyleFoundationsLogin } from "./style-foundations-login";
import { DsCtaMainButton, DsCtaSecondaryButton } from "../ui/ds-cta-buttons";

const HEADING_1 = DISPLAY_LEVELS[0];
const HEADING_3 = DISPLAY_LEVELS[2];
const BODY_STANDARD_REM =
  BODY_SIZES.find((s) => s.id === "standard")?.rem ?? 1;

const MOBILE_MAX = "767px";

/** Basename under `public/thumbnails/` — we try `.png`, `.jpg`, `.jpeg`, `.webp`. */
const THUMBNAILS_DIR = "/thumbnails";

const brand = brandShades(BRAND_PRIMARY_HEX);

const BODY_SMALL_REM =
  BODY_SIZES.find((s) => s.id === "small")?.rem ?? 0.75;

type PreviewSurface = "light" | "brand" | "dark";
type PreviewCtaVariant = "main" | "secondary";

const EXPERIENCES: ReadonlyArray<{
  id: string;
  title: string;
  thumbLabel: string;
  thumbBasename: string | null;
  description: string;
  surface: PreviewSurface;
  previewCta: PreviewCtaVariant;
}> = [
  {
    id: "style-foundations",
    title: "Style and foundations",
    thumbLabel: "Style and Foundations",
    thumbBasename: "1",
    description:
      "The UX/UI process anchors every prototype in our documented design system and the cues stakeholders used as inspiration. That keeps engineering-driven functionality and interaction patterns paired with typography, rhythm, and color that feel cohesive—so NarrativeCo reads as deliberate, not improvised.",
    surface: "light",
    previewCta: "secondary",
  },
  {
    id: "dashboard",
    title: "Home dashboard",
    thumbLabel: "Dashboard",
    thumbBasename: null,
    description:
      "The main shell for day-to-day activity—placeholder until navigation, summary modules, and quick actions are defined with product.",
    surface: "brand",
    previewCta: "secondary",
  },
  {
    id: "settings",
    title: "Account settings",
    thumbLabel: "Settings",
    thumbBasename: null,
    description:
      "Profile and preferences in one predictable surface—pending scope for fields, confirmations, and support links.",
    surface: "dark",
    previewCta: "main",
  },
  {
    id: "expansion-surfaces",
    title: "Expansion surfaces",
    thumbLabel: "Expansion",
    thumbBasename: null,
    description:
      "Placeholder for the next flows to preview—same white field and heavy rule as Style and foundations, ready when narratives are scripted.",
    surface: "light",
    previewCta: "secondary",
  },
];

/** Internal black dividers: 0.5rem; outer perimeter uses the wrapper border at 0.5rem black. */
function previewCellDividerClass(index: number) {
  const isRightColumn = index % 2 === 1;
  const isBottomRowMd = index >= 2;

  const parts = [
    "box-border border-solid border-black max-md:border-b-[0.5rem] max-md:last:border-b-0",
  ];
  if (!isRightColumn) {
    parts.push("md:border-r-[0.5rem]");
  }
  if (!isBottomRowMd) {
    parts.push("md:border-b-[0.5rem]");
  }
  return parts.join(" ");
}

function previewSurfaceTypography(surface: PreviewSurface) {
  switch (surface) {
    case "light":
      return { headingColor: pureBlack, bodyColor: grey[700] };
    case "brand":
      return { headingColor: pureWhite, bodyColor: brand[100] };
    case "dark":
      return { headingColor: pureWhite, bodyColor: grey[100] };
  }
}

/** Focus halo for unobtrusive thumbnail / title hit targets — contrast on each filled surface. */
function previewGhostFocusOutline(surface: PreviewSurface) {
  switch (surface) {
    case "light":
      return "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
    case "brand":
      return "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
    case "dark":
      return "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
  }
}

function previewSurfaceBg(surface: PreviewSurface) {
  switch (surface) {
    case "light":
      return pureWhite;
    case "brand":
      return brand[500];
    case "dark":
      return pureBlack;
  }
}

function useNarrowViewport() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX})`);
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return narrow;
}

function PlaceholderPanel({ label }: { label: string }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-[16rem] flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Placeholder
        </p>
        <p className="mt-2 font-ds-body text-sm font-medium text-zinc-800">
          {label}
        </p>
      </div>
    </div>
  );
}

/** Scaled copy of the first experience for the grid when no screenshot asset is available. */
function StyleFoundationsThumbLive({ square = false }: { square?: boolean }) {
  return (
    <div
      className={
        square
          ? "flex h-full w-full items-start justify-center overflow-hidden rounded-none border border-solid bg-white"
          : "flex h-full w-full items-start justify-center overflow-hidden rounded-md border border-solid border-zinc-200 bg-white"
      }
      style={square ? { borderColor: grey[400] } : undefined}
    >
      <div
        className="pointer-events-none w-[390px] shrink-0 scale-[0.2] select-none"
        style={{ transformOrigin: "top center" }}
      >
        <StyleFoundationsLogin />
      </div>
    </div>
  );
}

function thumbCandidates(basename: string) {
  const extensions = ["png", "jpg", "jpeg", "webp"] as const;
  return [
    `${THUMBNAILS_DIR}/${basename}`,
    ...extensions.map((ext) => `${THUMBNAILS_DIR}/${basename}.${ext}`),
  ];
}

/** Raster under `public/thumbnails/{basename}.{ext}`; tries common extensions then `fallback`. */
function ThumbnailRaster({
  basename,
  fallback,
  frameClassName = "rounded-md",
}: {
  basename: string;
  fallback: ReactNode;
  frameClassName?: string;
}) {
  const candidates = useMemo(() => thumbCandidates(basename), [basename]);
  const [index, setIndex] = useState(0);

  if (index >= candidates.length) {
    return (
      <div className={`relative block h-full min-h-0 w-full ${frameClassName}`.trim()}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden bg-zinc-100 ${frameClassName}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element -- multiple src fallbacks */}
      <img
        src={candidates[index]!}
        alt=""
        className="h-full w-full object-cover object-top"
        onError={() => setIndex((i) => i + 1)}
      />
    </div>
  );
}

function ExperienceThumbnail({
  thumbBasename,
  thumbLabel,
  frameClassName = "rounded-md",
}: {
  thumbBasename: string | null;
  thumbLabel: string;
  frameClassName?: string;
}) {
  if (thumbBasename != null) {
    return (
      <ThumbnailRaster
        key={thumbBasename}
        basename={thumbBasename}
        frameClassName={frameClassName}
        fallback={
          thumbBasename === "1" ? (
            <StyleFoundationsThumbLive square={frameClassName === "rounded-none"} />
          ) : (
            <div className={`flex h-full w-full flex-col items-center justify-center border border-dashed border-zinc-300 bg-white p-1 text-center ${frameClassName}`.trim()}>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500">
                Placeholder
              </span>
              <span className="mt-0.5 font-ds-body text-[10px] font-medium text-zinc-800">
                {thumbLabel}
              </span>
            </div>
          )
        }
      />
    );
  }

  return (
    <div className={`flex h-full w-full flex-col items-center justify-center border border-dashed border-zinc-300 bg-white p-1 text-center ${frameClassName}`.trim()}>
      <span className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500">
        Placeholder
      </span>
      <span className="mt-0.5 font-ds-body text-[10px] font-medium text-zinc-800">
        {thumbLabel}
      </span>
    </div>
  );
}

export function PrototypeGallery() {
  const narrow = useNarrowViewport();
  const dialogId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  const active = EXPERIENCES.find((e) => e.id === openId) ?? null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, close]);

  useEffect(() => {
    if (!openId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openId]);

  return (
    <div className="relative">
      <p className="absolute right-0 top-0 z-10 m-0 text-right">
        <Link
          href="/"
          className="font-ds-body text-sm font-medium text-zinc-600 underline-offset-4 hover:underline"
        >
          ← Design system
        </Link>
      </p>

      <div>
        <div className="max-md:pe-40">
          <h1
            className="font-ds-heading font-normal tracking-tight text-balance"
            style={{
              fontSize: `${HEADING_1.rem}rem`,
              lineHeight: 1.05,
              color: pureBlack,
            }}
          >
            Narrative
            <span style={{ color: brand[500] }}>Co</span>
          </h1>
          <div className="mt-2 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
            <p
              className="min-w-0 max-w-2xl font-ds-body font-normal"
              style={{
                fontSize: `${BODY_STANDARD_REM}rem`,
                lineHeight: 1.5,
                color: grey[700],
              }}
            >
              Our UX/UI process stays with NarrativeCo from framing through refinement,
              weaving interaction design, typography, color, and systems thinking into one thread.
              The aim is cohesive, highly usable experiences with a deliberate aesthetic layer—so the
              product can succeed on usability, credibility, brand presence, and the details people
              feel every day.
            </p>
            <aside
              className="min-w-0 flex-1 border-t border-solid pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0"
              style={{ borderColor: grey[200] }}
              aria-label="How to use interactive previews"
            >
              <p
                className="m-0 font-ds-body font-semibold"
                style={{
                  fontSize: `${BODY_SMALL_REM}rem`,
                  lineHeight: 1.4,
                  color: grey[800],
                }}
              >
                Using these previews
              </p>
              <ul
                className="m-0 mt-2 list-none space-y-1.5 p-0 font-ds-body font-normal"
                style={{
                  fontSize: `${BODY_SMALL_REM}rem`,
                  lineHeight: 1.5,
                  color: grey[700],
                }}
              >
                <li className="flex gap-2">
                  <span
                    className="shrink-0 font-semibold"
                    style={{ color: grey[600] }}
                    aria-hidden
                  >
                    —
                  </span>
                  <span className="min-w-0">
                    Use the thumbnail, the title and body, or{" "}
                    <span className="font-semibold" style={{ color: grey[800] }}>
                      Watch Preview
                    </span>
                    .
                  </span>
                </li>
                <li className="flex gap-2">
                  <span
                    className="shrink-0 font-semibold"
                    style={{ color: grey[600] }}
                    aria-hidden
                  >
                    —
                  </span>
                  <span className="min-w-0">
                    Phone-style frame on wide layouts; full viewport on narrow ones.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span
                    className="shrink-0 font-semibold"
                    style={{ color: grey[600] }}
                    aria-hidden
                  >
                    —
                  </span>
                  <span className="min-w-0">
                    <span className="font-semibold" style={{ color: grey[800] }}>
                      Escape
                    </span>{" "}
                    or{" "}
                    <span className="font-semibold" style={{ color: grey[800] }}>
                      Close
                    </span>{" "}
                    leaves the preview.
                  </span>
                </li>
              </ul>
            </aside>
          </div>
        </div>

        <div className="sr-only">
          <h2>Interactive previews</h2>
        </div>

        <div
          className="relative left-1/2 mt-10 w-screen max-w-[100vw] -translate-x-1/2"
          aria-label="Experience previews"
        >
          <div className="box-border border-[0.5rem] border-solid border-black">
            <ul className="m-0 grid list-none grid-cols-1 gap-0 p-0 md:grid-cols-2">
              {EXPERIENCES.map((exp, index) => {
                const typo = previewSurfaceTypography(exp.surface);
                const ghostFocus = previewGhostFocusOutline(exp.surface);
                const surfaceBg = previewSurfaceBg(exp.surface);

                const thumbTrayBg =
                  exp.surface === "brand"
                    ? "rgba(0,0,0,0.12)"
                  : exp.surface === "dark"
                    ? grey[900]
                    : grey[100];

                const CtaComponent =
                  exp.previewCta === "main" ? DsCtaMainButton : DsCtaSecondaryButton;
                const isOpen = openId === exp.id;
                const openPreview = () => setOpenId(exp.id);

                return (
                  <li
                    key={exp.id}
                    className={`min-w-0 ${previewCellDividerClass(index)}`}
                    style={{ backgroundColor: surfaceBg }}
                  >
                    <div className="flex w-full flex-col gap-6 p-6 md:flex-row md:items-start md:gap-8 md:p-8">
                      <button
                        type="button"
                        onClick={openPreview}
                        className={`mx-auto shrink-0 cursor-pointer border-0 bg-transparent p-0 ${ghostFocus} md:mx-0`}
                        aria-label={`Open preview: ${exp.title}`}
                        aria-haspopup="dialog"
                        aria-expanded={isOpen}
                        aria-controls={dialogId}
                      >
                        <div
                          className="relative aspect-[9/16] w-[8.75rem] sm:w-[9.5rem]"
                          style={{ backgroundColor: thumbTrayBg }}
                        >
                          <div className="absolute inset-1.5 overflow-hidden">
                            <ExperienceThumbnail
                              thumbBasename={exp.thumbBasename}
                              thumbLabel={exp.thumbLabel}
                              frameClassName="rounded-none"
                            />
                          </div>
                        </div>
                      </button>
                      <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <button
                          type="button"
                          onClick={openPreview}
                          className={`cursor-pointer border-0 bg-transparent p-0 text-left ${ghostFocus}`}
                          aria-haspopup="dialog"
                          aria-expanded={isOpen}
                          aria-controls={dialogId}
                        >
                          <h3
                            className="font-ds-heading font-normal tracking-tight text-balance"
                            style={{
                              fontSize: `${HEADING_3.rem}rem`,
                              lineHeight: 1.05,
                              color: typo.headingColor,
                            }}
                          >
                            {exp.title}
                          </h3>
                          <p
                            className="mt-3 font-ds-body font-normal text-pretty"
                            style={{
                              fontSize: `${BODY_STANDARD_REM}rem`,
                              lineHeight: 1.5,
                              color: typo.bodyColor,
                            }}
                          >
                            {exp.description}
                          </p>
                        </button>
                        <CtaComponent
                          className="w-full sm:w-auto sm:self-start"
                          onClick={openPreview}
                          aria-haspopup="dialog"
                          aria-expanded={isOpen}
                          aria-controls={dialogId}
                        >
                          Watch Preview
                        </CtaComponent>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {active ? (
        <div
          className={
            narrow
              ? "fixed inset-0 z-50 flex flex-col bg-zinc-50"
              : "fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-[2px]"
          }
          role="presentation"
          onClick={narrow ? undefined : close}
        >
          <div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-title`}
            className={
              narrow
                ? "flex min-h-0 flex-1 flex-col"
                : "flex aspect-[9/19.5] min-h-0 w-[min(390px,calc(100vw-2rem))] max-h-[min(92vh,920px)] shrink-0 flex-col overflow-hidden rounded-[2rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={
                narrow
                  ? "flex min-h-0 flex-1 flex-col bg-zinc-50"
                  : "flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[1.35rem] bg-zinc-50"
              }
            >
              <header
                className={`flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-3 ${
                  narrow ? "" : "rounded-t-[1.25rem]"
                }`}
              >
                <h2
                  id={`${dialogId}-title`}
                  className="font-ds-body truncate text-sm font-semibold text-zinc-900"
                >
                  {active.title}
                </h2>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 font-ds-body text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
                >
                  Close
                </button>
              </header>
              <div className="flex min-h-0 flex-1 flex-col overflow-x-clip overflow-y-auto">
                {active.id === "style-foundations" ? (
                  <StyleFoundationsLogin />
                ) : (
                  <PlaceholderPanel label={active.title} />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
