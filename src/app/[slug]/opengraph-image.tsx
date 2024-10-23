import { getCards } from "@/utilities/data";
import { getSetIdFromSlug } from "@/utilities/slugs";
import { ImageResponse } from "next/og";

export const alt = "Full Card List";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const setID = getSetIdFromSlug(slug);
  const { cards } = await getCards(setID);
  const { name } = cards[0].set;
  const { logo } = cards[0].set.images;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          boxShadow: "inset 0px 2px 35px 12px rgba(199,199,199)",
        }}
      >
        Full Card List, Digital Binders, and All The Data
        <img
          src={logo}
          alt={name}
          height={300}
          width={800}
          style={{
            boxShadow: "10px 10px 35px 0px rgb(0,0,0)",
            borderRadius: "8px",
            padding: "8px",
          }}
        />
      </div>
    ),
    size
  );
}
