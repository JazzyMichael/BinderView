import { Metadata } from "next";
import { redirect } from "next/navigation";
// import { subsetIDs } from "@/utilities/constants";
import SetCards from "@/components/SetCards";
import { getCards } from "@/utilities/data";
import { getSetIdFromSlug } from "@/utilities/slugs";

type Props = {
  params: { setID: string };
};

export const revalidate = 360000;
export const dynamic = "force-static"; // statically render all dynamic paths
export const dynamicParams = true; // ensure dynamic isr is enabled

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { setID } = params;

  const set = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v2/cards?q=set.id:${setID}&orderBy=number`,
    { next: { revalidate: 3600 * 24, tags: ["set", `${setID}`] } }
  ).then((x) => x.json());

  const setName = set?.data[0]?.set?.name || "Set Cards";

  return {
    title: `${setName} Card List`,
    description: `${setName} full set list with price data and filters.`,
  };
}

export default async function SetPage({ params }: Props) {
  // const { slug } = params
  // const setID = getIdFromSlug(slug) -> map
  //
  // const href = '/' + getSlugFromId(id) -> map

  const { setID: slug } = params;
  const setID = getSetIdFromSlug(slug);
  const { cards, subset, rarities } = await getCards(setID);

  if (!cards?.length) redirect("/");

  return (
    <SetCards
      cards={cards}
      set={cards[0].set}
      rarities={rarities}
      subset={subset}
    />
  );
}
