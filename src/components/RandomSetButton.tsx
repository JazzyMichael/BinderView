"use client";

import { getSlugFromSetId } from "@/utilities/slugs";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RandomSetButton({ sets }: { sets: any[] }) {
  const router = useRouter();
  const [label, setLabel] = useState("Random Set");

  const viewRandomSet = () => {
    const randomIdx = Math.floor(Math.random() * sets.length);
    console.log(sets[randomIdx]);
    setLabel(sets[randomIdx].name);
    const el = document?.getElementById(
      `series-${sets[randomIdx].series.replaceAll(" ", "-")}`
    );
    if (el) el.scrollIntoView();
    router.push(`/${getSlugFromSetId(sets[randomIdx].id)}`);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="min-w-fit rounded-full transition-colors flex gap-3 items-center justify-center bg-black text-sky-200 hover:bg-[#383838] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
      onClick={viewRandomSet}
    >
      <GlobeAltIcon className="h-5 w-5" />
      {label}
    </motion.button>
  );
}
