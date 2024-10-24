/*
  - Animation
    - "series", "era", "generation" text change animation, repeat every 3 seconds
      - enter from bottom, fade in and translateY up into the frame
      - exit at top, fade out and translateY up out of the frame
*/

import { formatSets, getSets, seriesNameToSlug } from "@/utilities/data";
import Link from "next/link";

type Series = {
  id: string;
  name: string;
  sets: number;
  cards: number;
};

export const revalidate = 360000;

export async function generateMetadata() {
  return {
    title: `Pokemon Cards in the entire SERIES/ERA/GENERATION`,
    description:
      "Expreience everything all at once on the BinderView Platform.",
    openGraph: {
      images: ["/scarlet-violet-screenshot.jpg"],
    },
  };
}

export default async function SeriesListPage() {
  const { english } = await getSets();
  const seriesData = formatSets(english.data);

  delete seriesData.Promos;
  delete seriesData.SubSets;

  const seriesList: Series[] =
    Object.entries(seriesData)
      .map(
        ([series, sets]: [string, any[]]): Series => ({
          id: seriesNameToSlug(series),
          name: series,
          sets: sets.length,
          cards: sets.reduce((prev, cur) => cur.total + prev, 0),
        })
      )
      .reverse() ?? [];

  return (
    <div className="flex flex-col gap-10 items-center font-[family-name:var(--font-geist-sans)]">
      <h1 className="my-10 text-lg">View a Full Series</h1>

      <ul className="mx-auto">
        {seriesList.map((series) => (
          <li key={`seriesList-${series.id}`}>
            <Link
              href={`/series/${series.id}`}
              className="p-3 block hover:bg-gray-200"
            >
              {series.name}, {series.sets} sets, {series.cards} cards
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
