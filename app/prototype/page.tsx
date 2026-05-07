import type { Metadata } from "next";
import { PrototypeGallery } from "./prototype-gallery";

export const metadata: Metadata = {
  title: "NarrativeCo · Previews",
  description:
    "UX/UI process guiding cohesive, usable, aesthetic experiences—for product success across every touchpoint.",
};

export default function PrototypePage() {
  return (
    <div className="min-h-full flex-1 overflow-x-hidden bg-white font-sans text-zinc-950">
      <div className="mx-auto w-full max-w-[100rem] px-6 py-12 md:px-10 md:py-16 lg:px-12">
        <PrototypeGallery />
      </div>
    </div>
  );
}
