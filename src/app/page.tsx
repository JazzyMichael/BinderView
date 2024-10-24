import RandomSetButton from "@/components/RandomSetButton";
import { getSets } from "@/utilities/data";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { english } = await getSets();
  const sets = english?.data ?? [];
  const latestSet = sets[sets.length - 1];

  return (
    <div className="font-[family-name:var(--font-geist-sans)] grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-2 gap-8">
      <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex items-center">
          <Image
            src={"/nnneon.svg"}
            alt="BinderView Logo"
            width={64}
            height={48}
          />

          <h1 className="text-3xl ml-2">
            Binder <span className="font-bold"> View</span>
          </h1>
        </div>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left">
          <li>Get started by choosing a set.</li>
          <li>Enjoy a new way of experiencing Pokemon cards.</li>
          <li>
            Add cards to binders to organize your favorites and track completion
            progress.
          </li>
          <li>
            With the Full Series View you can see analyze every card in a series
            at once.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <RandomSetButton sets={sets} />
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href={`/${latestSet.id}`}
          >
            Latest Set
          </Link>
          <Link
            className="md:hidden rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href={`/sets`}
          >
            All Sets
          </Link>
        </div>
      </div>

      <footer className="row-start-3 flex flex-col items-center mb-4">
        <p className="text-sm">
          Copyright &copy; Binderview.com {new Date().getFullYear()} All Rights
          Reserved.
        </p>
        <p className="text-xs">
          <Link href="/terms" className="hover:underline mr-1">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline ml-1">
            Privacy
          </Link>
        </p>
      </footer>
    </div>
  );
}
