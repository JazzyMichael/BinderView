import SetCards from "@/components/SetCards";
import {
  getSets,
  formatSets,
  getRarities,
  getCards,
  seriesNameToSlug,
} from "@/utilities/data";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

type Series = {
  id: string;
  name: string;
  sets: any[];
  cards: number;
};

type Props = {
  params: { seriesID: string };
};

// export const revalidate = 3600 * 24; // invalidate every 24 hours
export const revalidate = 360000; // 100 hours
// export const dynamic = "force-static"; // statically render all dynamic paths
export const dynamicParams = true; // ensure dynamic isr is enabled

export function getStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seriesID } = params;

  const pretty = seriesID
    .split("-")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.substring(1, word.length)
    )
    .join(" ");

  const images = [];

  if (seriesID === "scarlet-violet") {
    images.push("/screenshots/scarlet-violet.jpg");
  }

  if (seriesID === "sword-shield") {
    images.push("/screenshots/sword-shield.jpg");
  }

  return {
    title: `${pretty} Pokemon Cards`,
    description:
      "THE ENTIRE SERIES/ERA/GENERATION AT ONCE on the BinderView Platform",
    openGraph: {
      images,
    },
  };
}

export default async function SeriesPage({ params }: Props) {
  const { english } = await getSets();
  const seriesData = formatSets(english.data);

  delete seriesData.Promos;
  delete seriesData.SubSets;

  const seriesList: Series[] = Object.entries(seriesData).map(
    ([series, sets]: [string, any[]]): Series => ({
      id: seriesNameToSlug(series),
      name: series,
      sets,
      cards: sets.reduce((prev, cur) => cur.total + prev, 0),
    })
  );

  const series = seriesList.find((x) => x.id === params.seriesID);

  if (!series) redirect("/series");

  const combinedSets = series.sets.flat();

  const sets = await Promise.all(combinedSets.map(({ id }) => getCards(id)));

  const combinedCards = sets.reduce((prev, cur) => [...prev, ...cur.cards], []);

  const combinedRarities = getRarities(combinedCards);

  const clone = { ...combinedRarities };
  delete clone.Common;
  delete clone.Uncommon;
  const initialRaritySelection = Object.keys(clone);

  return (
    <SetCards
      cards={combinedCards}
      sets={combinedSets}
      rarities={combinedRarities}
      initialRaritySelection={initialRaritySelection}
      seriesView={true}
    />
  );
}
