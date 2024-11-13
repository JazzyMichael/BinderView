import Link from "next/link";
import { getSets, formatSets } from "@/utilities/data";
import { Metadata } from "next";
import { getSlugFromSetId } from "@/utilities/slugs";
import Image from "next/image";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Set } from "@/utilities/types";

export const revalidate = 86400; // every day

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cards List of Every Set on Binder View",
    description:
      "Choose a Set or an entire Series of Cards to view the full card list",
  };
}

export default async function Sets() {
  const { english } = await getSets();
  const seriesData = formatSets(english.data);

  delete seriesData.Promos;
  delete seriesData.SubSets;

  return (
    <>
      <h1 className="text-xl text-center font-geist-sans py-4 mb-2 bg-slate-100">
        Sets
      </h1>

      <TabGroup>
        <TabList className="flex gap-2 overflow-x-auto whitespace-nowrap snap-mandatory snap-x pt-2 pb-4 px-3">
          {Object.keys(seriesData)
            .reverse()
            .map((key) => (
              <Tab
                key={`sets-tab-${key}`}
                className="snap-center data-[selected]:bg-indigo-400 data-[selected]:text-white data-[hover]:underline rounded-xl py-2 px-4"
              >
                {key}
              </Tab>
            ))}
        </TabList>
        <TabPanels>
          {Object.values(seriesData)
            .reverse()
            .map((sets: Set[], i: number) => (
              <TabPanel key={`sets-tab-panel-${i}`}>
                <ul>
                  {sets.map((set: any) => (
                    <li key={set.id} className="px-6 hover:bg-slate-500">
                      <Link
                        href={`/${getSlugFromSetId(set.id)}`}
                        prefetch={false}
                      >
                        <Image
                          src={set.images.logo}
                          alt={`${set.images.logo} Set Logo`}
                          className="m-auto p-10"
                          height={135}
                          width={336}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </TabPanel>
            ))}
        </TabPanels>
      </TabGroup>
    </>
  );
}
