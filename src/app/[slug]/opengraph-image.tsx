import { getCardsBySlug, getPrice } from "@/utilities/data";
import { ImageResponse } from "next/og";

export const alt = "Pokemon Card List";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 864000; // 10 days

export default async function Image({ params }: { params: { slug: string } }) {
  const { cards, subset } = await getCardsBySlug(params.slug);

  if (!cards?.length) {
    return new ImageResponse(
      (
        <img
          src={"https://binderview.com/screenshots/binder-page.jpg"}
          alt={`BinderView card list screenshot`}
          height={size.height}
          width={size.width}
        />
      ),
      size
    );
  }

  const { name } = cards[0].set;
  const { logo } = cards[0].set.images;

  // Top cards to show in preview
  const arr = (subset?.cards?.length ? [...subset.cards, ...cards] : cards)
    .sort((a, b) => (getPrice(a) < getPrice(b) ? 1 : -1))
    .slice(0, 21);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "#f1f5f9",
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
            borderRadius: "12px",
            padding: "12px",
            position: "absolute",
            bottom: "8%",
          }}
        />
      </div>
    ),
    size
  );
}
