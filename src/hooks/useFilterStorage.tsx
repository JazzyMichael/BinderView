import { useState, useEffect } from "react";

export default function useFilterStorage(rarities: any, series: string) {
  const [value, setValue] = useState(() => {
    const rarityFilterSeries = window.localStorage.getItem(
      "rarity-filter-series"
    );
    const rarityFilter = window.localStorage.getItem("rarity-filter");

    if (rarityFilterSeries !== series) {
      window.localStorage.removeItem("rarity-filter");
      return rarities;
    } else {
      return rarityFilter ? JSON.parse(rarityFilter) : rarities;
    }
  });

  useEffect(() => {
    window.localStorage.setItem("rarity-filter-series", series);
    window.localStorage.setItem("rarity-filter", JSON.stringify(value));
  }, [series, value]);

  return [value, setValue];
}
