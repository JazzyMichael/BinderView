"use client";

import { SyntheticEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  QueueListIcon,
} from "@heroicons/react/24/solid";
import useSearchCards from "@/hooks/useSearchCards";

// TODO: Make this shit a server a component

// import { Metadata } from "next";

// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: "Search All Pokemon Cards on Binder View",
//     description:
//       "What are you lookin for? Type it in here to find the cards you want, and play around with the sets menu to look at all the cards you can imagine.",
//   };
// }

export default function SearchPage() {
  const { term, search, results } = useSearchCards();

  const handleSearchSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    search(e?.target[0]?.value ?? "", 10);
  };

  return (
    <main className="w-full h-screen overflow-y-auto text-center">
      <Link href="/sets" className="md:hidden flex gap-2 p-2">
        <QueueListIcon className="h-6 w-6" />
        Sets
      </Link>

      <form
        onSubmit={handleSearchSubmit}
        className="max-w-md px-4 mx-auto mt-12"
      >
        <div className="relative mb-2">
          <MagnifyingGlassIcon className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3" />
          <input
            type="text"
            className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
          />
        </div>

        <button
          type="submit"
          className="inline-flex w-full justify-center items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Search
          <PaperAirplaneIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
        </button>
      </form>

      {results?.length && term ? (
        <div className="mt-4 mb-10 text-gray-700 italic">
          {results.length} results for &quot;{term}&quot;
        </div>
      ) : undefined}

      <div className="block m-2">
        {results.map((card: any) => (
          <div
            key={card.id}
            className="inline-block text-center m-2 shadow-lg shadow-indigo-800 pt-2"
          >
            <p>{card.name}</p>
            <Link href={card.set.id}>{card.set.name}</Link>
            <p>{card.set.series}</p>
            <Image
              src={card.images.small}
              alt={card.name}
              width={220}
              height={300}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
