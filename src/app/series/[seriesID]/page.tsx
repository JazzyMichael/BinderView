import { getSets, getSetCards } from "@/utilities/data";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
// import SetCards from "@/components/SetCards";
import lazy from "next/dynamic";
import { seriesNameToSlug } from "@/utilities/slugs";
import { formatSets, getRarities } from "@/utilities/formatting";

const SetCards = lazy(() => import("@/components/SetCards"), {
  // ssr: false,
});

type Series = {
  id: string;
  name: string;
  sets: any[];
  cards: number;
};

type Props = {
  params: Promise<{ seriesID: string }>;
};

export const revalidate = 345600; // 4 days
export const dynamic = "force-static"; // statically render all dynamic paths
export const dynamicParams = true; // ensure dynamic isr is enabled

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seriesID } = await params;

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
    title: `${pretty} Full Era Pokemon Cards`,
    description:
      "THE ENTIRE SERIES/ERA/GENERATION AT ONCE on the BinderView Platform",
    openGraph: {
      images,
      title: `${pretty} Full Era Pokemon Cards`,
      description:
        "THE ENTIRE SERIES/ERA/GENERATION AT ONCE on the BinderView Platform",
    },
  };
}

export default async function SeriesPage({ params }: Props) {
  const { seriesID } = await params;
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

  const series = seriesList.find((x) => x.id === seriesID);

  if (!series) redirect("/series");

  const combinedSets = series.sets.flat();

  const sets = await Promise.all(combinedSets.map(({ id }) => getSetCards(id)));

  const combinedCards = sets.reduce(
    (prev, cur) => [
      ...prev,
      ...(cur?.cards ?? cur?.data ?? []),
      ...(cur?.subset?.cards ?? cur?.subset?.data ?? []),
    ],
    []
  );

  const combinedRarities = getRarities(combinedCards);

  const clone = { ...combinedRarities };

  delete clone.Common;
  delete clone.Uncommon;
  delete clone.Rare;

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
