"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";
import {
  motion,
  useTransform,
  useMotionValue,
  useSpring,
  useAnimate,
  stagger,
} from "framer-motion";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import SeriesItem from "./SeriesItem";
import { getSlugFromSetId } from "@/utilities/slugs";

function formatDate(date: string) {
  const [year, month] = date.split("/");

  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${months[parseInt(month) - 1]} ${year}`;
}

const ToggleButton = ({
  sort,
  setSort,
  className = "",
}: {
  sort: string;
  setSort: Function;
  className?: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: "spring", stiffness: 300, damping: 10 }}
    className={clsx(
      "relative h-auto min-h-10 w-24 px-3 inline-flex justify-between items-center text-xs font-bold text-gray-900 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-50",
      className
    )}
    onClick={() =>
      setSort((x: string) => (x === "Newest" ? "Oldest" : "Newest"))
    }
  >
    <ArrowsUpDownIcon
      className={`w-4 h-4 duration-150 ${
        sort === "Oldest" ? "rotate-180" : ""
      }`}
    />

    <span>{sort}</span>
  </motion.button>
);

export default function Sidenav({
  fulldata,
  promos,
  oldestSort,
  newestSort,
  raw,
}: {
  fulldata: any;
  promos: any[];
  oldestSort: any[];
  newestSort: any[];
  raw?: any;
}) {
  if (raw) {
    console.log({ raw });
  }

  const selectedSetID =
    usePathname()
      ?.split("/")
      .reduce((a, v) => v) || "";

  const [expanded, setExpanded] = useState(true);
  const [searchRegex, setSearchRegex] = useState(new RegExp("", "i"));
  const [sort, setSort] = useState("Newest");
  const [showPromos, setShowPromos] = useState(false);
  const [scope, animate] = useAnimate();
  const [fadeAnimation, setFadeAnimation] = useState<any>();

  const setListAnimation = () => {
    if (fadeAnimation) {
      fadeAnimation.complete();
    }

    if (oldestSort?.length && newestSort?.length) {
      console.log("animation started");
      const animation = animate(
        ".collapsed-item",
        { opacity: 1 },
        { delay: stagger(0.05, { startDelay: 0 }) }
      );
      setFadeAnimation(animation);
      animation.then(() => console.log("animation completed"));
    } else {
      console.log("missing animation data");
    }
  };

  useEffect(() => {
    if (!expanded) {
      setListAnimation();
    }
  }, [sort, expanded]);

  const toggleExpand = () => {
    setExpanded((x) => !x);
  };

  const togglePromos = () => {
    setShowPromos((x) => !x);
  };

  function handleSearch(term: string) {
    setSearchRegex(new RegExp(term, "i"));
  }

  function handleSeriesItemClick(event: string) {
    if (event === "promos") {
      togglePromos();
    }
  }

  // tooltips for collapsed sidenav items
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleHoverMovement = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <nav
      className={clsx(
        "no-scrollbar transition-width duration-200",
        expanded ? (showPromos ? "w-96" : "w-72") : "w-24",
        "h-full hidden md:block flex-none overflow-y-auto bg-white"
      )}
    >
      {/* Static Icons */}
      <ul
        className={clsx(
          "bg-white w-full pr-6 flex justify-evenly items-center gap-y-1 border-b-2 border-indigo-200 sticky top-0 z-10 shadow",
          expanded ? "flex-row" : "flex-col"
        )}
      >
        <li>
          <Link href="/">
            <div className="py-4 px-6 rounded hover:text-slate-700 hover:bg-slate-200">
              <HomeIcon className="h-6 w-6 m-auto" />
            </div>
          </Link>
        </li>

        <li>
          <Link href="/binders">
            <div className="py-4 px-6 rounded hover:text-slate-700 hover:bg-slate-200">
              <BookOpenIcon className="h-6 w-6 m-auto" />
            </div>
          </Link>
        </li>

        <li>
          <Link href="/search">
            <div className="py-4 px-6 rounded hover:text-slate-700 hover:bg-slate-200">
              <MagnifyingGlassIcon className="h-6 w6 m-auto" />
            </div>
          </Link>
        </li>

        <div
          onMouseDown={toggleExpand}
          className={clsx(
            "h-full flex items-center text-indigo-800 bg-indigo-100 hover:bg-indigo-200 absolute z-50 rounded-l-2xl cursor-pointer -right-0 top-0",
            expanded ? "w-9 pl-2" : "w-6 pl-1"
          )}
        >
          <ChevronRightIcon
            className={expanded ? "rotate-180 h-5 w-5" : "rotate-0 h-5 w-5"}
          />
        </div>
      </ul>

      {/* Input & Sort Toggle */}
      <div className="my-2 mx-1 flex rounded-md shadow-sm h-10">
        {expanded && (
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
              placeholder="Search sets..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        )}

        <ToggleButton
          sort={sort}
          setSort={setSort}
          className={expanded ? "rounded-r-md" : "rounded-md"}
        />
      </div>

      {/* Promos */}
      {expanded &&
        showPromos &&
        promos &&
        Object.entries(promos).map(([series, sets]: any) => (
          <SeriesItem
            key={series}
            name={series}
            sets={sets}
            selectedSetID={selectedSetID}
            onClick={handleSeriesItemClick}
          />
        ))}

      {/* Expanded Set List */}
      {expanded &&
        Object.entries(fulldata)
          .filter(([series, sets]: any) => {
            if (!sets || series.Promos) {
              return false;
            }

            if (sets) {
              for (const set of sets) {
                if (searchRegex.test(set.name)) {
                  return true;
                }
              }
            }

            return false;
          })
          .sort(() => (sort === "Newest" ? -1 : 1))
          .map(([series, sets]: any) => (
            <SeriesItem
              onClick={handleSeriesItemClick}
              key={series}
              name={series}
              selectedSetID={selectedSetID}
              sets={sets
                .filter((set: any) => searchRegex.test(set.name))
                .sort(() => (sort === "Oldest" ? -1 : 1))}
            />
          ))}

      {/* Collapsed Set List */}
      {!expanded && (
        <TooltipProvider>
          <ul ref={scope} className="w-full px-3">
            {sort === "Newest" &&
              newestSort.map((item: any) => (
                <Tooltip
                  delayDuration={0}
                  disableHoverableContent={true}
                  key={item.id}
                >
                  <TooltipTrigger asChild>
                    <li
                      onMouseMove={handleHoverMovement}
                      className="collapsed-item opacity-0 group bg-transparent transition-all hover:bg-slate-700 rounded-lg my-1"
                    >
                      <Link
                        href={`/${getSlugFromSetId(item.id)}`}
                        className="flex gap-2 items-center"
                      >
                        <div className="w-[32px] h-[32px] relative py-6 m-auto transition-scale scale-100 group-hover:scale-110">
                          <Image
                            src={item.images.symbol}
                            alt={item.name + " symbol"}
                            fill
                            sizes="(max-width: 768px) 32px"
                            className="object-contain"
                          />
                        </div>

                        {expanded && item.name}
                      </Link>
                    </li>
                  </TooltipTrigger>

                  <TooltipContent side="right" className="z-50">
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 260,
                          damping: 10,
                        },
                      }}
                      exit={{ opacity: 0, y: 20, scale: 0.6 }}
                      style={{
                        translateX: translateX,
                        rotate: rotate,
                        whiteSpace: "nowrap",
                      }}
                      className="absolute -top-12 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-slate-800 shadow-xl px-4 py-2"
                    >
                      <div className="font-bold text-white text-base">
                        {item.name}
                      </div>
                      <div className="text-white text-xs">
                        {formatDate(item.releaseDate)}
                      </div>
                    </motion.div>
                  </TooltipContent>
                </Tooltip>
              ))}

            {sort === "Oldest" &&
              oldestSort.map((item: any) => (
                <Tooltip
                  delayDuration={0}
                  disableHoverableContent={true}
                  key={item.id}
                >
                  <TooltipTrigger asChild>
                    <li
                      onMouseMove={handleHoverMovement}
                      className="collapsed-item opacity-0 group bg-transparent transition-all hover:bg-slate-700 rounded-lg my-1"
                    >
                      <Link
                        href={`/${getSlugFromSetId(item.id)}`}
                        className="flex gap-2 items-center"
                      >
                        <div className="w-[32px] h-[32px] relative py-6 m-auto transition-scale scale-100 group-hover:scale-110">
                          <Image
                            src={item.images.symbol}
                            alt={item.name + " symbol"}
                            fill
                            sizes="(max-width: 768px) 32px"
                            className="object-contain"
                          />
                        </div>

                        {expanded && item.name}
                      </Link>
                    </li>
                  </TooltipTrigger>

                  <TooltipContent side="right" className="z-50">
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 260,
                          damping: 10,
                        },
                      }}
                      exit={{ opacity: 0, y: 20, scale: 0.6 }}
                      style={{
                        translateX: translateX,
                        rotate: rotate,
                        whiteSpace: "nowrap",
                      }}
                      className="absolute -top-12 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-slate-800 shadow-xl px-4 py-2"
                    >
                      <div className="font-bold text-white text-base">
                        {item.name}
                      </div>
                      <div className="text-white text-xs">
                        {formatDate(item.releaseDate)}
                      </div>
                    </motion.div>
                  </TooltipContent>
                </Tooltip>
              ))}
          </ul>
        </TooltipProvider>
      )}
    </nav>
  );
}
