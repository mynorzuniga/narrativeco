"use client";

import { useId, useState } from "react";
import { ColorTab } from "./color-tab";
import { ComponentsTab } from "./components-tab";
import { SizingTab } from "./sizing-tab";
import { TypographyTab } from "./typography-tab";

const TABS = [
  { id: "color", label: "Color" },
  { id: "sizing", label: "Sizing" },
  { id: "typography", label: "Typography" },
  { id: "components", label: "Components" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DesignSystemTabs() {
  const baseId = useId();
  const [active, setActive] = useState<TabId>("color");

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Design system sections"
        className="flex gap-1 border-b border-zinc-200"
      >
        {TABS.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-${tab.id}-tab`}
              aria-selected={selected}
              aria-controls={`${baseId}-${tab.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={
                selected
                  ? "-mb-px border-b-2 border-zinc-950 px-4 py-3 text-sm font-medium text-zinc-950"
                  : "border-b-2 border-transparent px-4 py-3 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-${tab.id}-panel`}
          aria-labelledby={`${baseId}-${tab.id}-tab`}
          hidden={active !== tab.id}
          className="pb-16"
        >
          {tab.id === "color" ? <ColorTab /> : null}
          {tab.id === "sizing" ? <SizingTab /> : null}
          {tab.id === "typography" ? <TypographyTab /> : null}
          {tab.id === "components" ? <ComponentsTab /> : null}
        </div>
      ))}
    </div>
  );
}
