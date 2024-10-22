import { useState, useEffect } from "react";

export default function useLocalStorage(defaultValue: string, key: string) {
  const [value, setValue] = useState(() => {
    const stickyValue =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;

    return stickyValue ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}
