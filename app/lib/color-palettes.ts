export const SHADE_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export type ShadeStep = (typeof SHADE_STEPS)[number];

export type ShadeScale = Record<ShadeStep, string>;

/** Achromatic greys (R = G = B; no hue) */
export const grey: ShadeScale = {
  50: "#FAFAFA",
  100: "#F5F5F5",
  200: "#E5E5E5",
  300: "#D4D4D4",
  400: "#A3A3A3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717",
  950: "#0A0A0A",
};

export const red: ShadeScale = {
  50: "#FEF2F2",
  100: "#FEE2E2",
  200: "#FECACA",
  300: "#FCA5A5",
  400: "#F87171",
  500: "#EF4444",
  600: "#DC2626",
  700: "#B91C1C",
  800: "#991B1B",
  900: "#7F1D1D",
  950: "#450A0A",
};

export const yellow: ShadeScale = {
  50: "#FEFCE8",
  100: "#FEF9C3",
  200: "#FEF08A",
  300: "#FDE047",
  400: "#FACC15",
  500: "#EAB308",
  600: "#CA8A04",
  700: "#A16207",
  800: "#854D0E",
  900: "#713F12",
  950: "#422006",
};

export const green: ShadeScale = {
  50: "#F0FDF4",
  100: "#DCFCE7",
  200: "#BBF7D0",
  300: "#86EFAC",
  400: "#4ADE80",
  500: "#22C55E",
  600: "#16A34A",
  700: "#15803D",
  800: "#166534",
  900: "#14532D",
  950: "#052E16",
};

function parseHex(hex: string) {
  const h = hex.replace("#", "").trim();
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function toHex(r: number, g: number, b: number) {
  const clamp = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)));
  const c = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

function mixHex(a: string, b: string, t: number) {
  const A = parseHex(a);
  const B = parseHex(b);
  return toHex(
    A.r + (B.r - A.r) * t,
    A.g + (B.g - A.g) * t,
    A.b + (B.b - A.b) * t,
  );
}

const WHITE = "#FFFFFF";
const BLACK = "#000000";

/** 500 = exact brand; lighter = tint with white; darker = shade toward black */
const BRAND_TINT: Partial<Record<ShadeStep, number>> = {
  50: 0.06,
  100: 0.12,
  200: 0.26,
  300: 0.42,
  400: 0.58,
};

const BRAND_SHADE: Partial<Record<ShadeStep, number>> = {
  600: 0.14,
  700: 0.32,
  800: 0.52,
  900: 0.72,
  950: 0.86,
};

export function brandShades(brandHex: string): ShadeScale {
  const raw = brandHex.replace("#", "").trim();
  const base =
    `#${raw.slice(0, 6)}`.toUpperCase();
  const out = {} as ShadeScale;
  for (const step of SHADE_STEPS) {
    if (step === 500) {
      out[500] = base;
      continue;
    }
    const tint = BRAND_TINT[step];
    if (tint !== undefined) {
      out[step] = mixHex(WHITE, base, tint);
      continue;
    }
    const shade = BRAND_SHADE[step];
    if (shade !== undefined) {
      out[step] = mixHex(base, BLACK, shade);
    }
  }
  return out;
}

export const BRAND_PRIMARY_HEX = "#FD5202";

export const pureWhite = "#FFFFFF";
export const pureBlack = "#000000";
