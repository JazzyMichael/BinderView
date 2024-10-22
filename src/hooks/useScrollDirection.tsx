"use client";

import { useEffect, useState } from "react";

export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("");
  const scrollEl: any = document?.getElementById("main-content");
  let lastScrollY: number = scrollEl?.scrollTop ?? 0;

  // useEffect(() => {
  //   scrollEl = document.getElementById("main-content");
  //   lastScrollY = scrollEl?.scrollTop ?? 0;
  // }, []);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = scrollEl?.scrollTop ?? 0;
      const direction = scrollY > lastScrollY ? "down" : "up";

      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 4 || scrollY - lastScrollY < -4)
      ) {
        setScrollDirection(direction);
      }

      lastScrollY = Math.max(scrollY, 0);
    };

    scrollEl?.addEventListener("scroll", updateScrollDirection);

    return () => {
      scrollEl?.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollDirection]);

  return scrollDirection;
}
