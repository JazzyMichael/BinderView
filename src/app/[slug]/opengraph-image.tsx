import { getCards, getPrice } from "@/utilities/data";
import { getSetIdFromSlug } from "@/utilities/slugs";
import { ImageResponse } from "next/og";

export const alt = "Full Card List";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600 * 24 * 7; // weekly

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const setID = getSetIdFromSlug(slug);
  const { cards } = await getCards(setID);
  const { name } = cards[0].set;
  const { logo } = cards[0].set.images;

  // Top 20 Most Expensive Cards
  const arr = cards
    .sort((a, b) => {
      const aPrice = getPrice(a);
      const bPrice = getPrice(b);

      if (aPrice === 0) return -1;
      if (bPrice === 0) return 1;

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
          justifyContent: "space-between",
          boxShadow: "inset 0px 2px 35px 12px rgba(199,199,199)",
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
              alt={card.name}
              style={{ height: "256px", width: "164px", objectFit: "contain" }}
            />
          ))}
        </div>

        <img
          src={logo}
          alt={name}
          height={300}
          width={800}
          style={{
            background:
              "linear-gradient(0deg, rgb(239,249,255), transparent 100%)",
            boxShadow: "10px 100px 96px 64px rgb(0,0,0)",
            borderRadius: "8px",
            padding: "12px",
            position: "absolute",
            bottom: "1px",
          }}
        />
      </div>
    ),
    size
  );
}
