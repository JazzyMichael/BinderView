import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlassIcon, QueueListIcon } from "@heroicons/react/24/solid";
import LoadingAnimation from "@/components/LoadingAnimation";
import { getSlugFromSetId } from "@/utilities/slugs";
import { searchCards } from "@/utilities/data";
import { getPrice } from "@/utilities/formatting";
import { Metadata } from "next";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata(props: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { q: query } = await props.searchParams;

  return {
    title: query
      ? `'${query}' search results - BinderView`
      : "Search All Pokemon Cards - BinderView",
    description: `What are you lookin for? You can search for any card except ${query}... Just Kidding! BinderView has everything!`,
  };
}

export default async function SearchPage(props: {
  searchParams: SearchParams;
}) {
  const { q: query } = await props.searchParams;

  return (
    <main className="w-full h-screen overflow-y-auto text-center">
      <Link href="/sets" className="md:hidden flex gap-2 p-2">
        <QueueListIcon className="h-6 w-6" />
        Sets
      </Link>

      <form
        action="/search"
        method="GET"
        className="max-w-md px-4 mx-auto mt-12"
      >
        <div className="relative text-gray-500">
          <MagnifyingGlassIcon className="absolute top-0 bottom-0 w-6 h-6 my-auto left-3" />
          <input
            placeholder="Search"
            type="text"
            name="q"
            defaultValue={query}
            className="pl-16 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </form>

      <Suspense fallback={<LoadingAnimation />}>
        <SearchResults query={query} />
      </Suspense>
    </main>
  );
}

async function SearchResults({ query }) {
  if (!query) return <p></p>;

  const results = await searchCards(query);

  if (!results.length)
    return <p className="mt-10 text-gray-700">Nothing Found!</p>;

  return (
    <div className="block my-10 mx-2">
      <p className="mb-4 italic">
        {results.length} '{query}' cards
      </p>

      {results.map((card) => (
        <div
          key={card.id}
          className="inline-block text-center m-2 shadow-lg rounded-lg shadow-indigo-800 pt-2"
        >
          <p>{card.name}</p>

          <Link
            prefetch={false}
            href={`/${getSlugFromSetId(card.set.id)}`}
            className="underline text-sm"
          >
            {card.set.name}
          </Link>

          <p className="text-sm mb-1">
            <span className="mr-1">{card.rarity}</span>

            {card.tcgplayer?.url && (
              <a
                href={card.tcgplayer.url}
                target="_blank"
                className="underline"
              >
                ${getPrice(card)}
              </a>
            )}
          </p>

          <Image
            loading={"lazy"}
            src={card.images.small}
            alt={card.name}
            width={220}
            height={300}
            className="rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
