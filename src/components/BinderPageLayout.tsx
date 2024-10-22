import { BinderTypes } from "@/utilities/constants";
import clsx from "clsx";

export default function BinderPageLayout({
  cols,
  rows,
}: {
  cols: number;
  rows: number;
}) {
  const icons = new Array(cols * rows).fill(true);

  return (
    <div
      className={clsx(
        "grid gap-2 rounded-md bg-slate-400 p-2 w-fit",
        BinderTypes[cols].class
      )}
    >
      {icons.map((_, i) => (
        <div
          key={`${i}-${cols}x${rows}`}
          className="h-4 w-3 bg-slate-50 rounded-sm"
        ></div>
      ))}
    </div>
  );
}
