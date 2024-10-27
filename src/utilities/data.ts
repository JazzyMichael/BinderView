import {
  subsetIDs,
  BlackStarPromos,
  PopPromos,
  McDonaldsPromos,
  ExTrainerKitPromos,
  OtherPromos,
  BASE_URL,
  API_KEY,
} from "./constants";

export const searchCards = async (term: string) => {
  const url =
    term.split(" ").length === 1
      ? `${BASE_URL}/v2/cards?q=name:*${term}*`
      : `${BASE_URL}/v2/cards?q=name:"${term}"`;

  const { data } = await fetch(url, {
    headers: { "X-Api-Key": API_KEY },
  }).then((x) => x.json());

  return data;
};

export async function getSets() {
  const englishSetsUrl = `${BASE_URL}/v2/sets?orderBy=releaseDate`;
  // const japaneseSetsUrl = "https://www.jpn-cards.com/set";

  const [english, japanese = []] = await Promise.all([
    await fetch(englishSetsUrl, {
      next: { revalidate: 172800, tags: ["english-sets"] },
      headers: { "X-Api-Key": API_KEY },
    }).then((res) => res.json()),
    // await fetch(japaneseSetsUrl, {
    //   next: { revalidate: 3600 * 24, tags: ["japanese-sets"] },
    // }).then((res) => res.json()),
  ]);

  return { english, japanese };
}

export function formatSets(sets: any[]) {
  const seriesList: any = {
    Promos: {
      "Black Star Promos": [],
      POP: [],
      "McDonalds Promos": [],
      "EX Trainer Kits": [],
      Other: [],
    },
    SubSets: {},
  };

  for (const set of sets) {
    let promoFlag = false;

    // @ts-ignore
    if (BlackStarPromos[set.id]) {
      seriesList["Promos"]["Black Star Promos"].unshift(set);
      promoFlag = true;
    }
    // @ts-ignore
    if (PopPromos[set.id]) {
      seriesList["Promos"]["POP"].unshift(set);
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
      seriesList["Promos"]["Other"].unshift(set);
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

export const getRarities = (cards: any[] = []) => {
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

export async function getCards(id: string) {
  let cards: any[];
  let subset: any = null;

  const res = await fetch(
    `${BASE_URL}/v2/cards?q=set.id:${id}&orderBy=number`,
    {
      next: { revalidate: 172800, tags: ["set", `${id}`] },
      headers: { "X-Api-Key": API_KEY },
    }
  ).then((x) => x.json());

  cards = [...res.data];

  if (res.totalCount > res.count && res.page == 1) {
    console.log(`Page 2 for Set: ${id}, ${res.totalCount} total cards`);

    const pageTwo = await fetch(
      `${BASE_URL}/v2/cards?q=set.id:${id}&orderBy=number&page=2`,
      {
        next: { revalidate: 172800, tags: ["set", `${id}`] },
        headers: { "X-Api-Key": API_KEY },
      }
    ).then((x) => x.json());

    cards = [...res.data, ...pageTwo.data];
  }

  for (const subsetID of Object.keys(subsetIDs)) {
    if (subsetIDs[subsetID].mainSetID == id) {
      const { data } = await fetch(
        `${BASE_URL}/v2/cards?q=set.id:${subsetID}&orderBy=number`,
        {
          next: { revalidate: 172800, tags: ["set", `${id}`] },
          headers: { "X-Api-Key": API_KEY },
        }
      ).then((x) => x.json());

      subset = {
        id: subsetID,
        name: subsetIDs[subsetID].label,
        mainSetID: id,
        mainSetName: "",
        cards: data,
        rarities: getRarities(data),
      };
    }
  }

  return { cards, subset, rarities: getRarities(cards) };
}

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
  if (!price) return "n/a";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const seriesNameToSlug = (seriesName: string): string => {
  return seriesName.replaceAll(" ", "").replaceAll("&", "-").toLowerCase();
};
