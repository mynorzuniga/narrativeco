"use client";

const ROOT_PX = 16;
const STEP_REM = 0.25;

const REM_STEPS = Array.from(
  { length: Math.round(5 / STEP_REM) },
  (_, i) => STEP_REM * (i + 1),
);

function formatRem(rem: number) {
  return parseFloat(rem.toFixed(2)).toString();
}

function toPx(rem: number) {
  return rem * ROOT_PX;
}

export function SizingTab() {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          Spacing scale
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Sizes use{" "}
          <strong className="font-medium text-zinc-800">rem</strong> with a root
          of{" "}
          <strong className="font-medium text-zinc-800">
            1rem = {ROOT_PX}px
          </strong>
          . The scale advances in{" "}
          <strong className="font-medium text-zinc-800">
            {STEP_REM}rem ({STEP_REM * ROOT_PX}px)
          </strong>{" "}
          steps from{" "}
          <strong className="font-medium text-zinc-800">{STEP_REM}rem</strong>{" "}
          through{" "}
          <strong className="font-medium text-zinc-800">5rem</strong>.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-3 font-semibold text-zinc-900">rem</th>
                <th className="px-4 py-3 font-semibold text-zinc-900">px</th>
                <th className="min-w-[12rem] px-4 py-3 font-semibold text-zinc-900">
                  Preview
                </th>
              </tr>
            </thead>
            <tbody>
              {REM_STEPS.map((rem) => (
                <tr
                  key={rem}
                  className="border-b border-zinc-100 last:border-b-0"
                >
                  <td className="px-4 py-2.5 font-mono tabular-nums text-zinc-800">
                    {formatRem(rem)}rem
                  </td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-zinc-600">
                    {toPx(rem)}px
                  </td>
                  <td className="px-4 py-2.5 align-middle">
                    <div
                      className="h-3 max-w-full rounded-sm bg-zinc-400"
                      style={{ width: `${rem}rem` }}
                      title={`${formatRem(rem)}rem`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
