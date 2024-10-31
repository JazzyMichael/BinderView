import { searchCards } from "@/utilities/data";
import { useState } from "react";

export default function useSearchCards() {
  const [term, setTerm] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<any>(null);

  const search = (term: string, delay: number = 750) => {
    clearTimeout(timer);

    setTerm(term.trim());

    if (!term.trim()) return setResults([]);

    setLoading(true);

    const debounced = setTimeout(
      () =>
        searchCards(term.trim())
          .then(setResults)
          .then(() => setLoading(false)),
      delay
    );

    setTimer(debounced);
  };

  return { term, search, results, loading };
}
