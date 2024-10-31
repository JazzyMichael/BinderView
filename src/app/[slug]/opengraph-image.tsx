import { getCards, getPrice } from "@/utilities/data";
import { getSetIdFromSlug } from "@/utilities/slugs";
import { ImageResponse } from "next/og";

export const alt = "Full Card List";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 432000; // 5 days

export default async function Image({ params }: { params: { slug: string } }) {
  const setID = getSetIdFromSlug(params.slug);
  const { cards } = await getCards(setID);
  const { name } = cards[0].set;
  const { logo } = cards[0].set.images;

  // Top 20 Most Expensive Cards
  const arr = cards
    .sort((a, b) => {
      const aPrice = getPrice(a);
      const bPrice = getPrice(b);

      return aPrice < bPrice ? 1 : -1;
    })
    .slice(0, 20);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "#f5f5f5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            width: "100%",
            height: "100%",
          }}
        >
          {arr.map((card) => (
            <img
              key={card.id}
              src={card.images.small}
              alt={`${card.name} Pokemon Card`}
              style={{ height: "256px", width: "164px", objectFit: "contain" }}
            />
          ))}
        </div>

        <img
          src={logo}
          alt={`${name} Logo`}
          height={300}
          width={800}
          style={{
            background: "linear-gradient(0deg, white, white, transparent 100%)",
            boxShadow: "10px 96px 120px 20px rgb(40,40,40)",
            borderRadius: "8px",
            padding: "12px",
            position: "absolute",
            bottom: "10%",
          }}
        />
      </div>
    ),
    size
  );
}
