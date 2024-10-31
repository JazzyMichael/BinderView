import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCardsBySlug } from "@/utilities/data";
// import SetCards from "@/components/SetCards";
import lazy from "next/dynamic";

const SetCards = lazy(() => import("@/components/SetCards"), {
  ssr: false,
});

type Props = {
  params: { slug: string };
};

// Generate static pages for each route at runtime
// https://nextjs.org/docs/app/api-reference/functions/generate-static-params#all-paths-at-runtime

export const revalidate = 432000; // 5 days
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cards } = await getCardsBySlug(params.slug);
  const setName = cards[0]?.set?.name || "Full Set";

  return {
    title: `${setName} Card List - BinderView Pokemon Cards`,
    description: `BinderView is the best way to experience everything ${setName} has to offer.`,
  };
}

export default async function SetPage({ params }: Props) {
  const { cards, subset, rarities } = await getCardsBySlug(params.slug);

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
