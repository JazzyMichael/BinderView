import clsx from "clsx";
import Link from "next/link";

export default function BreadCrumbs({
  series,
  set,
  cardCountLabel,
  cardCount,
  totalPrice,
  activeViewId,
  onViewChange,
}: {
  series: string;
  set?: string;
  cardCountLabel: string;
  cardCount: number;
  totalPrice: string;
  activeViewId?: string;
  onViewChange?: Function;
}) {
  const tabs = [
    // { id: "sealed", name: "Sealed", href: "#" },
    { id: "fullscreen", name: "Screen", href: "#" },
    { id: "binder", name: "Binder", href: "#" },
  ];

  const seriesURL = series
    .replaceAll(" ", "")
    .replaceAll("&", "-")
    .toLowerCase();

  return (
    <nav
      className="hidden md:flex border-b border-gray-200 bg-white"
      aria-label="Breadcrumb"
    >
      <ol
        role="list"
        className="mx-auto flex w-full pl-1 sm:pl-2 lg:pl-3 text-sm"
      >
        {/* series name */}
        <li className="flex">
          <div className="flex items-center">
            <Link
              prefetch={false}
              href={`/series/${seriesURL}`}
              className="text-gray-500 hover:text-gray-800"
            >
              {series}
            </Link>
          </div>
        </li>

        {/* set name & release date */}
        {set && (
          <li className="flex">
            <div className="flex items-center">
              <svg
                className="h-full w-6 flex-shrink-0 text-gray-300"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <a
                href="#"
                className="ml-3 font-medium flex flex-col gap-1 space-between hover:text-gray-700"
                onClick={() => {
                  document
                    ?.getElementById(`series-${series.replaceAll(" ", "-")}`)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="text-gray-500">{set}</span>
              </a>
            </div>
          </li>
        )}

        {/* release date and cards */}
        <li className="flex">
          <svg
            className="h-full ml-2 w-6 flex-shrink-0 text-gray-300"
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>
          <div className="flex flex-col justify-between py-1 pl-4 items-start text-xs font-bold text-gray-500">
            <span>{cardCountLabel}</span>
            <span>
              {cardCount} cards, {totalPrice}
            </span>
          </div>
        </li>

        {/* tabs */}
        <li className="hidden lg:block ml-auto mr-0">
          <div className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                onClick={() => onViewChange && onViewChange(tab.id)}
                className={clsx(
                  tab.id === activeViewId
                    ? "cursor-default border-indigo-400 hover:border-indigo-500 text-indigo-500 hover:text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 hover:bg-indigo-50",
                  "w-36 border-b-2 p-3 text-center text-sm font-medium"
                )}
                aria-current={tab.id === activeViewId ? "page" : undefined}
              >
                {tab.name}
              </a>
            ))}
          </div>
        </li>
      </ol>
    </nav>
  );
}
