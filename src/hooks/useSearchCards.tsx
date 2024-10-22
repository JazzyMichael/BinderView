import { searchCards } from "@/utilities/data";
import { useEffect, useState } from "react";

export default function useSearchCards() {
  const [term, setTerm] = useState<string>("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed) {
      searchCards(trimmed).then(setResults);
    } else {
      setResults([]);
    }
  }, [term]);

  return { term, setTerm, results };
}
