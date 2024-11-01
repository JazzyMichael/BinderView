import RandomSetButton from "@/components/RandomSetButton";
import { getSets } from "@/utilities/data";
import { getSlugFromSetId } from "@/utilities/slugs";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Set } from "@/utilities/types";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Binder View Pokemon Cards List",
    description:
      "From Vintage to Modern, and everything in-between, BinderView provides the best digital binder experience for viewing pokemon cards.",
    applicationName: "BinderView",
    openGraph: {
      images: ["/screenshots/landing-page-opengraph.jpg"],
      type: "website",
      url: "https://binderview.com",
      title: "Pokemon Cards List",
      description: "Sit back and enjoy the view. The Binder View.",
      siteName: "BinderView",
    },
  };
}

export default async function Home() {
  const { english } = await getSets();
  const sets = english?.data ?? [];

  return (
    <div className="font-[family-name:var(--font-geist-sans)] h-full overflow-auto">
      <Header sets={sets} />

      <BentoGrid />

      <Sets sets={sets.slice(sets.length - 10, sets.length).reverse()} />

      <FAQ />

      <Testimonial />

      <Footer />
    </div>
  );
}

function Header({ sets }: { sets: Set[] }) {
  return (
    <header className="w-full text-center p-6 sm:p-14 md:p-20 bg-gradient-to-br from-slate-800 to-indigo-900 font-[family-name:var(--font-geist-mono)]">
      <div className="flex gap-8 justify-center items-center">
        <Image
          src={"/icon-192.png"}
          alt={"Binderview Logo"}
          height={96}
          width={96}
          className="shadow-xl shadow-black rounded-full h-12 w-12 md:h-24 md:w-24"
        />

        <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-white font-[family-name:var(--font-geist-sans)]">
          BinderView
        </h2>
      </div>

      <p className="my-10 text-pretty text-lg text-gray-300 sm:text-xl/8">
        Vintage to Modern, and Everything In Between
      </p>

      <div className="flex flex-wrap gap-4 items-center justify-center flex-col sm:flex-row">
        <RandomSetButton sets={sets} />

        <Link
          className="rounded-full border-2 border-sky-400 text-sky-100 transition-colors flex items-center justify-center hover:bg-sky-400 hover:text-gray-900 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          href={`/${getSlugFromSetId(sets[sets.length - 1].id)}`}
        >
          Latest Set
        </Link>

        <Link
          prefetch={false}
          className="hidden md:flex rounded-full border-2 border-fuchsia-400 text-fuchsia-100 transition-colors items-center justify-center hover:bg-fuchsia-400 hover:text-gray-900 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          href={`/series/scarlet-violet`}
        >
          Full Era
        </Link>

        <Link
          className="md:hidden rounded-full border-2 border-fuchsia-400 text-fuchsia-100 transition-colors flex items-center justify-center hover:bg-fuchsia-400 hover:text-gray-900 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          href={`/sets`}
        >
          All Sets
        </Link>
      </div>
    </header>
  );
}

function BentoGrid() {
  return (
    <div className="bg-slate-100 py-20 sm:py-24 lg:py-40">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base/7 font-semibold text-indigo-600">
          Explore all the sets
        </h2>
        <p className="mt-2 max-w-xl text-pretty text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
          Sit back & enjoy the view.
        </p>
        <p className="mt-3 max-w-xl text-pretty text-3xl font-bold tracking-tight text-gray-700 sm:text-4xl">
          The Binder View.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <div className="relative lg:col-span-3">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
              <Image
                alt="Binder View Screenshot"
                src={"/screenshots/binder-view.jpg"}
                height={630}
                width={1200}
                className="h-80 object-cover object-top"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-indigo-600">
                  Helpful
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                  Binder View
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                  See how cards fit into your binder, and plan accordingly. You
                  never want to be 1 card off. Any size binder, Any collection
                  style.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
          </div>
          <div className="relative lg:col-span-3">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-tr-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
              <Image
                alt="Full Era View"
                src={"/screenshots/full-era.jpg"}
                className="h-80 object-cover object-left lg:object-right"
                height={630}
                width={1200}
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-indigo-600">
                  Cutting-Edge
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                  Full Era View
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                  Sometimes it&apos;s nice to see all the cards together in the
                  entire era. Use the same filtering and sorting tools for the
                  best possible analysis and digital collecting experience.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-tr-[2rem]" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-bl-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
              <Image
                alt="Side Menu Showcase"
                src={"/screenshots/side-menu.jpg"}
                className="h-80 object-cover object-left"
                height={630}
                width={1200}
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-indigo-600">
                  Speed
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                  Convenient Side Menu
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                  Quickly switch between sets with the Binder View menu. No more
                  going back and forth between pages to load different sets of
                  cards. Collapse the side menu to open up the view. This is the
                  most efficient way to explore all the cards.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-bl-[2rem]" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-white" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <Image
                alt="Digital Binders Overview"
                src={"/screenshots/binder-page.jpg"}
                className="h-80 object-cover object-left lg:object-right"
                height={630}
                width={1200}
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-indigo-600">
                  Collections
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                  Digital Binders
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                  Create a trade binder before an event, a wishlist of the
                  biggest hits, or just put all the eeveelutions together in one
                  place - our digital binders offer unlimited organization
                  capabilities for your digital collection!
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
              <Image
                alt="Control Labels and Size"
                src={"/screenshots/labels-size-control.jpg"}
                className="h-80 object-cover object-left lg:object-right"
                height={630}
                width={1200}
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-indigo-600">
                  Preferences
                </h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">
                  Control what you want to see!
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                  Choose to show the price, name, numbers, or just the images
                  for each card - PLUS change the size of the cards with the
                  size slider so they fit in the screen exactly how they look
                  best.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Sets({ sets }: { sets: Set[] }) {
  return (
    <div className="flex flex-wrap flex-col gap-4 w-full h-64 p-8 overflow-x-auto justify-center">
      {sets.map((set) => (
        <Link
          key={`landing-page-set-${set.id}`}
          href={`/${getSlugFromSetId(set.id)}`}
        >
          <Image
            src={set.images.logo}
            alt={`${set.name} Logo`}
            className="w-60 max-h-40 p-5"
            height={160}
            width={240}
          />
        </Link>
      ))}
    </div>
  );
}

const faqs: Array<{ question: string; answer: string }> = [
  {
    question: "How is BinderView different from other sites?",
    answer:
      "BinderView is the best website for viewing lists of pokemon cards because of the cutting-edge navigation, combining subsets and trainer galleries, viewing full series, community involvement, no premium memberships, and some other stuff.",
  },
  {
    question: "How can I see all of the Scarlet Violet cards together?",
    answer:
      "Instead of viewing each set individually, you can see a full list of all cards in the entire era from every set. Click the name of the era in the top left corner when viewing a set to get started! BinderView is the only platform that provides a full-era viewing experience - It is seriously a great way to look at Pokemon cards.",
  },
  {
    question: 'What is the "Binder View"?',
    answer:
      "The Binder View shows cards separated into binder pages to see how they fit in any size binder. This is used to track progress for completing sets, so you can see where each card goes in the binder and easily see which ones you need. You can use the binder view for entire eras and saved collections / digital binders.",
  },
  {
    question: "What are Digital Binders and how do I save cards?",
    answer:
      "You can group cards together into digital binders to organize your favorites without being limited to only organizing by set. Search for cards to add directly from the Binders page, or use the save icon when viewing cards in a set or series.",
  },
  {
    question: 'What is "Set Consolidation"?',
    answer:
      "Combining subsets and trainer galleries into each set. BinderView combines the cards from the main set and the trainer gallery into the same view with customization options to filter and sort however you want.",
  },
  {
    question: "Where does the data come from?",
    answer:
      "Prices are updated every few days and efficiently stored to ensure blazing fast loading times. Data sources can be seen in the card details when selecting a card in a set or series view. Sources include TCGPlayer, CardMarket, and Ebay.",
  },
];

function FAQ() {
  return (
    <div className="bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:py-64 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-6 text-base leading-7 text-gray-600">
            The world is full of questions. Here are some answers.
          </p>
        </div>
        <div className="mt-20">
          <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:gap-x-10">
            {faqs.map((faq, i) => (
              <div key={i}>
                <dt className="text-base font-semibold leading-7 text-gray-900 font-[family-name:var(--font-geist-mono)]">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

function Testimonial() {
  return (
    <div className="bg-slate-100 pb-16 pt-24 sm:pb-24 sm:pt-32 xl:pb-32">
      <div className="bg-gray-900 pb-20 sm:pb-24 xl:pb-0">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-8 gap-y-10 px-6 sm:gap-y-8 lg:px-8 lg:flex-row lg:items-stretch">
          <div className="-mt-8 w-full max-w-2xl md:-mb-8 md:w-96 md:max-w-[50%] md:flex-none">
            <div className="relative aspect-[2/1] h-[90%] max-h-[800px] md:-mx-8 lg:mx-0 lg:aspect-auto">
              <Image
                alt="AI depiction of Professor Oak"
                src={"/prof-oak-gpt.jpg"}
                className="absolute inset-0 h-full max-h-[800px] w-full rounded-2xl bg-gray-800 object-cover object-[top_30%_right_50%] shadow-2xl"
                width={1024}
                height={1792}
              />
            </div>
          </div>
          <div className="w-full max-w-2xl lg:max-w-none lg:flex-auto lg:px-8 lg:py-20">
            <figure className="relative isolate pt-6 sm:pt-12">
              <svg
                fill="none"
                viewBox="0 0 162 128"
                aria-hidden="true"
                className="absolute left-0 top-0 -z-10 h-32 stroke-white/20"
              >
                <path
                  d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
                  id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
                />
                <use x={86} href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" />
              </svg>
              <blockquote className="text-xl/8 font-semibold text-white sm:text-2xl/9">
                <p>
                  The perfect combination of elegance and utility. I recommend
                  this platform to trainers seeking a convenient way to explore
                  all the wild Pokemon cards. BinderView should be integrated
                  into every Pokedex!
                </p>
              </blockquote>
              <figcaption className="mt-8 text-base">
                <div className="font-semibold text-white">Professor Oak</div>
                <div className="mt-1 text-gray-400">
                  Founder, Pallet Town Research
                </div>
                <div className="mt-1 text-gray-400 text-sm">(AI Depiction)</div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center py-5 text-gray-900">
      <p className="text-sm">
        &copy; Binderview Inc, {new Date().getFullYear()}. All Rights Reserved.
      </p>
      <p className="text-xs">
        <Link href="/terms" className="hover:underline mr-1" prefetch={false}>
          Terms
        </Link>
        <Link href="/privacy" className="hover:underline ml-1" prefetch={false}>
          Privacy
        </Link>
      </p>
    </footer>
  );
}
