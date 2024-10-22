"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function SeriesItem({
  name,
  sets,
  onClick,
  selectedSetID,
}: {
  name: string;
  sets: any[];
  onClick?: Function;
  selectedSetID: string;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <motion.button
        whileHover={{ scale: 0.95 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 500 }}
        className="backface-hidden group w-full flex items-center justify-between text-gray-600 py-2 px-4 rounded-lg  hover:bg-gray-200 active:bg-gray-200 active:text-gray-900 active:shadow-md duration-150"
        onClick={() => {
          setExpanded(!expanded);
          onClick();
        }}
        id={`series-${name.replaceAll(" ", "-")}`}
      >
        <div className="flex items-center gap-x-2">{name}</div>

        <div className="p-1">
          <ChevronDownIcon
            className={`w-5 h-5 duration-150 ${expanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </div>
      </motion.button>

      <ul
        className={clsx(
          "transition-all duration-300 overflow-hidden px-6 text-[0.9rem]",
          expanded ? "max-h-[800px]" : "max-h-0"
        )}
      >
        {sets.map((set) => (
          <li key={set.id}>
            <Link
              prefetch
              href={`/${set.id}`}
              className={clsx(
                "flex w-full py-2 px-4 border-l hover:border-indigo-600 opacity-80 hover:opacity-100",
                selectedSetID === set.id ? "border-indigo-600" : ""
              )}
            >
              <Image
                src={set.images.symbol}
                alt={set.name}
                width={24}
                height={24}
                className="inline-block mr-2 object-contain h-[24px] w-[24px]"
              />

              <div className="whitespace-nowrap text-nowrap w-fit">
                {set.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
