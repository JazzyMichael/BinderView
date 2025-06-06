import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCardsBySlug } from "@/utilities/data";
import lazy from "next/dynamic";

const SetCards = lazy(() => import("@/components/SetCards"), {
  // ssr: false,
});

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static pages for each route at runtime
// https://nextjs.org/docs/app/api-reference/functions/generate-static-params#all-paths-at-runtime

// export const revalidate = 432000; // 5 days
// export const dynamic = "force-static";
// export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { cards } = await getCardsBySlug(slug);
  const setName = (cards?.length && cards[0]?.set?.name) || "Full Set";

  return {
    title: `${setName} Card List (Full Set) - BinderView Pokemon Cards`,
    description: `BinderView is the best way to experience everything ${setName} has to offer.`,
    applicationName: "BinderView",
    openGraph: {
      type: "website",
      title: `${setName} Card List (Full Set) - BinderView Pokemon Cards`,
      description:
        "Vintage to Modern, and Everything in-between. The best place to view full Pokemon card lists.",
      siteName: "BinderView",
    },
  };
}

export default async function SetPage({ params }: Props) {
  const { slug } = await params;
  const { cards, subset, rarities } = await getCardsBySlug(slug);

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
