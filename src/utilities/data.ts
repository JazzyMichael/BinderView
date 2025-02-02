import { subsetIDs, BASE_URL, API_KEY } from "./constants";
import { getRarities } from "./formatting";
import { getSetIdFromSlug } from "./slugs";
import { Card, Rarities, Subset } from "./types";

export async function searchCards(term: string): Promise<Card[]> {
  const url =
    term.split(" ").length === 1
      ? `${BASE_URL}/v2/cards?q=name:*${term}*`
      : `${BASE_URL}/v2/cards?q=name:"${term}"`;

  const res = await fetch(url, {
    headers: { "X-Api-Key": API_KEY },
    next: { revalidate: 172800 },
  }).then((x) => x.json());

  return res?.data ?? [];
}

export async function getSets() {
  const englishSetsUrl = `${BASE_URL}/v2/sets?orderBy=releaseDate`;
  // const japaneseSetsUrl = "https://www.jpn-cards.com/set";

  const english = await fetch(englishSetsUrl, {
    next: { revalidate: 172800 }, // 2 days
    headers: { "X-Api-Key": API_KEY },
  }).then((res) => res.json());

  return { english };
}

export async function getSetCards(
  setID: string,
  page: number = 1
): Promise<any> {
  const res = await fetch(
    `${BASE_URL}/v2/cards?q=set.id:${setID}&orderBy=number&page=${page}`,
    {
      next: { revalidate: 172800 }, // 2 days
      headers: { "X-Api-Key": API_KEY },
    }
  ).then((x) => x.json());

  return res;
}

export async function getCardsBySlug(slug: string): Promise<{
  cards: Card[];
  subset: Subset;
  rarities: Rarities;
}> {
  const id = getSetIdFromSlug(slug);

  if (!id) {
    return { cards: null, subset: null, rarities: null };
  }

  const res = await getSetCards(id);

  const cards: Card[] = res?.data ?? [];

  // load second page
  if (res.totalCount > res.count) {
    const res2 = await getSetCards(id, 2);
    cards.concat(res2.data);
  }

  let subset: Subset;

  // load subset
  for (const subsetID of Object.keys(subsetIDs)) {
    if (subsetIDs[subsetID].mainSetID == id) {
      const { data } = await getSetCards(subsetID);

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
