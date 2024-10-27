import { searchCards } from "@/utilities/data";
import { useState } from "react";

export default function useSearchCards() {
  const [term, setTerm] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [timer, setTimer] = useState<any>(null);

  const search = (term: string, delay: number = 750) => {
    clearTimeout(timer);

    setTerm(term.trim());

    if (!term.trim()) return setResults([]);

    const debounced = setTimeout(
      () => searchCards(term.trim()).then(setResults),
      delay
    );

    setTimer(debounced);
  };

  return { term, search, results };
}
