import clsx from "clsx";

export default function BinderPageLayout({
  cols,
  rows,
}: {
  cols: number;
  rows: number;
}) {
  const icons = new Array(cols * rows).fill(true);

  const BinderTypes = {
    2: "grid-cols-2 grid-rows-2",
    3: "grid-cols-3 grid-rows-3",
    4: "grid-cols-4 grid-rows-3",
  };

  return (
    <div
      className={clsx(
        "grid gap-2 rounded-md bg-slate-400 p-2 w-fit",
        BinderTypes[cols]
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
