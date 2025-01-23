import {
  subsetIDs,
  BlackStarPromos,
  PopPromos,
  McDonaldsPromos,
  ExTrainerKitPromos,
  OtherPromos,
} from "./constants";
import { Card, Rarities } from "./types";

export const getPrice = (card: any, useFirstEdition = false) => {
  if (
    useFirstEdition &&
    card.tcgplayer?.prices &&
    card.tcgplayer?.prices["1stEditionHolofoil"]
  ) {
    return card.tcgplayer.prices["1stEditionHolofoil"].market;
  }

  if (card.tcgplayer?.prices?.unlimitedHolofoil) {
    return card.tcgplayer.prices.unlimitedHolofoil.market;
  }

  if (card.tcgplayer?.prices?.unlimited) {
    return card.tcgplayer.prices.unlimited.market;
  }

  if (card.tcgplayer?.prices?.holofoil) {
    return card.tcgplayer.prices.holofoil.market;
  }

  if (card.tcgplayer?.prices?.normal) {
    return card.tcgplayer?.prices?.normal.market;
  }

  if (card.tcgplayer?.prices?.reverseHolofoil) {
    return card.tcgplayer.prices.reverseHolofoil.market;
  }

  return 0;
};

export const formatPrice = (price: number) => {
  if (!price) return "-_-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export function formatSets(sets: any[]) {
  const seriesList: any = {
    Promos: {
      "Black Star Promos": [],
      "POP Series": [],
      "McDonalds Promos": [],
      "EX Trainer Kits": [],
      "Other Promos": [],
    },
    SubSets: {},
  };

  for (const set of sets) {
    let promoFlag = false;

    // @ts-ignore
    if (BlackStarPromos[set.id]) {
      set.name = set.name.replace("Scarlet & Violet", "SV");
      seriesList["Promos"]["Black Star Promos"].unshift(set);
      promoFlag = true;
    }
    // @ts-ignore
    if (PopPromos[set.id]) {
      seriesList["Promos"]["POP Series"].unshift(set);
      promoFlag = true;
    }

    // @ts-ignore
    if (McDonaldsPromos[set.id]) {
      seriesList["Promos"]["McDonalds Promos"].unshift(set);
      promoFlag = true;
    }

    // @ts-ignore
    if (ExTrainerKitPromos[set.id]) {
      seriesList["Promos"]["EX Trainer Kits"].unshift(set);
      promoFlag = true;
    }

    // @ts-ignore
    if (OtherPromos[set.id]) {
      seriesList["Promos"]["Other Promos"].unshift(set);
      promoFlag = true;
    }

    // @ts-ignore
    if (subsetIDs[set.id]) {
      // @ts-ignore
      seriesList["SubSets"][set.id] = subsetIDs[set.id];
      promoFlag = true;
    }

    if (!promoFlag) {
      if (!seriesList[set.series]) {
        seriesList[set.series] = [set];
      } else if (set.id !== "sve") {
        seriesList[set.series].unshift(set);
      }
    }
  }

  return seriesList;
}

export const sortSets = (type: "Oldest" | "Newest", items: any[]) => {
  return [...items].sort((a, b) => {
    const topOfList = type === "Newest" ? 1 : -1;

    if (a.releaseDate == b.releaseDate) {
      return a.name.length < b.name.length ? topOfList : -topOfList;
    }

    return a.releaseDate < b.releaseDate ? topOfList : -topOfList;
  });
};

export const getRarities = (cards: Card[] = []): Rarities => {
  return cards.reduce((acc, { rarity = "Energy" }) => {
    acc[rarity] = !acc[rarity] ? 1 : acc[rarity] + 1;
    return acc;
  }, {});
};

export const combineRarities = (obj1: any = {}, obj2: any = {}) => {
  Object.keys(obj1).forEach((key) => {
    if (obj2[key]) {
      obj1[key] += obj2[key];
      delete obj2[key];
    }
  });

  return { ...obj1, ...obj2 };
};
