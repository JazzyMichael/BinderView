import { getCards } from "@/utilities/data";
import { getSetIdFromSlug } from "@/utilities/slugs";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Full Card List";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const setID = getSetIdFromSlug(params.slug);
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {name} Card List and Binder View
        <img src={logo} alt={name} height={300} width={800} />
      </div>
    ),
    size
  );
}
