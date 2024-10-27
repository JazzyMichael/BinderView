import { Metadata } from "next";
import { redirect } from "next/navigation";
import SetCards from "@/components/SetCards";
import { getCards } from "@/utilities/data";
import { getSetIdFromSlug } from "@/utilities/slugs";

type Props = {
  params: { slug: string };
};

export const revalidate = 172800; // 2 days
// export const dynamic = "force-static";
// export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const setID = getSetIdFromSlug(params.slug);
  const { cards } = await getCards(setID);
  const setName = cards[0]?.set?.name || "Full Set";

  return {
    title: `${setName} Card List - BinderView Pokemon Cards`,
    description: `BinderView is the best way to experience everything ${setName} has to offer.`,
  };
}

export default async function SetPage({ params }: Props) {
  const setID = getSetIdFromSlug(params.slug);
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
