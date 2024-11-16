import { useEffect, useState } from "react";
import BinderLayoutSelect from "./BinderLayoutSelect";
import { BinderTypes } from "@/utilities/constants";
import Image from "next/image";

export const BinderView = ({
  initialType = 3,
  cards,
  cardTotal,
  includeReverse,
  includeSubset,
  subset,
  collection,
  collectionSelection,
}: {
  initialType?: 2 | 3 | 4;
  cards: any[];
  cardTotal: number;
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
    cardTotal += subset.cards.length;
  }

  const { cols, rows, page } = BinderTypes[initialType];
  const [size, setSize] = useState({ cols, rows, page });
  const [pageCards, setPageCards] = useState<boolean[]>(
    new Array(page).fill(true)
  );
  const [renderedPages, setRenderedPages] = useState<boolean[]>([]);

  const refreshBinder = ({ cols, rows }: any) => {
    const page = cols * rows;
    setSize({ cols, rows, page });
    setPageCards(new Array(page).fill(true));
  };

  useEffect(() => {
    setRenderedPages(new Array(Math.ceil(c.length / page)).fill(true));
  }, [cards]);

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
        renderedPages.map((_, i) => (
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
                    size.page * i + i2 + 1 < c.length
                      ? ""
                      : "bg-gray-500 rounded"
                  }`}
                >
                  {!!c[`${size.page * i + i2}`] ? (
                    <>
                      {!collectionSelection ||
                        (collectionSelection?.name !== "In Collection" && (
                          <Image
                            height={256}
                            width={200}
                            src={c[`${size.page * i + i2}`].images.small}
                            alt={`${c[`${size.page * i + i2}`].name} Card`}
                            className={
                              c[`${size.page * i + i2}`].isReverse
                                ? "rounded brightness-150"
                                : "rounded"
                            }
                          />
                        ))}

                      {collectionSelection.name === "In Collection" && (
                        <Image
                          height={256}
                          width={200}
                          src={c[`${size.page * i + i2}`].images.small}
                          alt={`${c[`${size.page * i + i2}`].name} Card`}
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
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
