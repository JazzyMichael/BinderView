import { getSets } from "@/utilities/data";
import { formatSets } from "@/utilities/formatting";
import { seriesNameToSlug } from "@/utilities/slugs";
import Link from "next/link";

type Series = {
  id: string;
  name: string;
  sets: number;
  cards: number;
};

export const revalidate = 172800; // 2 days

export async function generateMetadata() {
  return {
    title: `Pokemon Cards in the entire SERIES/ERA/GENERATION`,
    description:
      "Expreience everything all at once on the BinderView Platform.",
    openGraph: {
      images: ["/screenshots/scarlet-violet.jpg"],
    },
  };
}

export default async function SeriesListPage() {
  const { english } = await getSets();
  const seriesData = formatSets(english.data);

  delete seriesData.Promos;
  delete seriesData.SubSets;

  const seriesList: Series[] = Object.entries(seriesData)
    .map(
      ([series, sets]: [string, any[]]): Series => ({
        id: seriesNameToSlug(series),
        name: series,
        sets: sets.length,
        cards: sets.reduce((prev, cur) => cur.total + prev, 0),
      })
    )
    .reverse();

  return (
    <div className="flex flex-col gap-10 items-center font-geist-sans">
      <h1 className="my-10 text-lg">View a Full Series</h1>

      <ul className="mx-auto">
        {seriesList.map((series) => (
          <li key={`seriesList-${series.id}`}>
            <Link
              prefetch={false}
              href={`/series/${series.id}`}
              className="p-3 block hover:bg-gray-100 rounded-md"
            >
              {series.name}: {series.sets} sets, {series.cards} cards
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
