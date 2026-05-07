/** Heading display scale (rem) */
export const DISPLAY_LEVELS = [
  { level: 1, label: "Heading 1", rem: 4.5 },
  { level: 2, label: "Heading 2", rem: 3.5 },
  { level: 3, label: "Heading 3", rem: 3 },
  { level: 4, label: "Heading 4", rem: 2.5 },
  { level: 5, label: "Heading 5", rem: 2 },
  { level: 6, label: "Heading 6", rem: 1.5 },
] as const;

export const BODY_SIZES = [
  { id: "standard", label: "Standard", rem: 1 },
  { id: "small", label: "Small", rem: 0.75 },
  { id: "micro", label: "Micro", rem: 0.625 },
] as const;

export const BODY_WEIGHTS = [
  { id: "regular", label: "Regular", className: "font-normal" },
  { id: "semibold", label: "Semibold", className: "font-semibold" },
  { id: "bold", label: "Bold", className: "font-bold" },
] as const;
