import { useEffect, useState } from "react";
import BinderLayoutSelect from "./BinderLayoutSelect";
import { BinderTypes } from "@/utilities/constants";

export const BinderView = ({
  initialType = 3,
  cards,
  includeReverse,
  includeSubset,
  subset,
  collection,
  collectionSelection,
}: {
  initialType?: 2 | 3 | 4;
  cards: any[];
  includeReverse: boolean;
  includeSubset: boolean;
  subset: any;
  collection: any;
  collectionSelection: any;
}) => {
  const c = cards.reduce((acc, val) => {
    acc.push(val);
    if (includeReverse && val.tcgplayer?.prices?.reverseHolofoil) {
      acc.push({ ...val, isReverse: true });
    }
    return acc;
  }, []);

  if (includeSubset && subset?.cards) {
    subset.cards.forEach((card: any) => c.push(card));
  }

  const cardTotal = c?.length ?? 0;

  const { cols, rows, page } = BinderTypes[initialType];
  const [size, setSize] = useState({ cols, rows, page });
  const [pageCards, setPageCards] = useState<boolean[]>(
    new Array(page).fill(true)
  );
  const [totalPages, setTotalPages] = useState<boolean[]>([]);

  const refreshBinder = ({ cols, rows, pages }: any) => {
    const page = cols * rows;
    setSize({ cols, rows, page });
    setPageCards(new Array(page).fill(true));
    setTotalPages(new Array(pages).fill(true));
  };

  useEffect(() => {
    const partialPage = cardTotal % size.page ? 1 : 0;
    const pages = Math.floor(cardTotal / size.page) + partialPage;
    refreshBinder({ cols: 3, rows: 3, pages });
  }, []);

  return (
    <div className="text-center my-10">
      <div className="mb-4">
        <BinderLayoutSelect
          totalCards={cardTotal}
          selected={{ cols: size.cols, rows: size.rows }}
          onSelect={refreshBinder}
        ></BinderLayoutSelect>
      </div>

      {collectionSelection.name === "Not in Collection" ||
        (!c?.length && <div>Not available in binder view.</div>)}

      {collectionSelection?.name !== "Not in Collection" &&
        totalPages.map((_, i) => (
          <div key={i} className="inline-block">
            <div className="text-sm">Page {i + 1}</div>
            <div
              className="w-[400px] inline-grid mt-1 mb-3 mx-2 p-3 bg-gray-900 rounded"
              style={{
                gridTemplateColumns: `repeat(${size.cols}, 1fr)`,
                gridTemplateRows: `repeat(${size.rows}, 1fr)`,
                rowGap: "8px",
                columnGap: "8px",
              }}
            >
              {pageCards.map((_, i2) => (
                <div
                  key={`${i}-${i2}`}
                  className={` ${
                    size.page * i + i2 + 1 < c.length ? "" : "bg-gray-500"
                  }`}
                >
                  {!collectionSelection ||
                    (collectionSelection?.name !== "In Collection" && (
                      <img
                        src={c[`${size.page * i + i2}`]?.images?.small}
                        className={
                          c[`${size.page * i + i2}`]?.isReverse
                            ? "brightness-150 rounded"
                            : "rounded"
                        }
                      />
                    ))}

                  {collectionSelection.name === "In Collection" && (
                    <img
                      src={c[`${size.page * i + i2}`].images?.small}
                      className={
                        c[`${size.page * i + i2}`].isReverse
                          ? collection[
                              c[`${size.page * i + i2}`].id + "-reverse"
                            ]
                            ? `${
                                c[`${size.page * i + i2}`].isReverse
                                  ? "brightness-125 hue-rotate-30"
                                  : ""
                              }`
                            : "brightness-50"
                          : collection[c[`${size.page * i + i2}`].id]
                          ? `${
                              c[`${size.page * i + i2}`].isReverse
                                ? "brightness-125 hue-rotate-30"
                                : ""
                            }`
                          : "brightness-50"
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
