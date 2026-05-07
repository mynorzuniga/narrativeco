import Link from "next/link";
import { DesignSystemTabs } from "./design-system-tabs";
import { BRAND_PRIMARY_HEX } from "./lib/color-palettes";

export default function Home() {
  return (
    <div className="min-h-full flex-1 bg-zinc-50 font-sans text-zinc-950">
      <div className="mx-auto w-full max-w-[100rem] px-6 py-12 md:px-10 md:py-16 lg:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            NarrativeCo
          </h1>
          <Link
            href="/prototype"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND_PRIMARY_HEX }}
          >
            Prototype
          </Link>
        </div>
        <div className="mt-10">
          <DesignSystemTabs />
        </div>
      </div>
    </div>
  );
}
