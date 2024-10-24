"use client";

import { getSlugFromSetId } from "@/utilities/slugs";
import { motion } from "framer-motion";
import Image from "next/image";
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
      className="min-w-fit rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
      onClick={viewRandomSet}
    >
      <Image
        src="https://nextjs.org/icons/vercel.svg"
        alt="Vercel logomark"
        width={20}
        height={20}
      />
      {label}
    </motion.button>
  );
}
