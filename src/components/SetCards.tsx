"use client";

import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import {
  XMarkIcon,
  QueueListIcon,
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import useScrollDirection from "@/hooks/useScrollDirection";
import useLocalStorage from "@/hooks/useLocalStorage";
import useBinders from "@/hooks/useBinders";
import InfiniteScroll from "@/hooks/InfiniteScroll";
import BreadCrumbs from "./BreadCrumbs";
import SizeSlider from "./SizeSlider";
import ComboSelect from "./ComboSelect";
import SortSelect from "./SortSelect";
import FlyoutMenu from "./FlyoutMenu";
import { BinderView } from "./BinderView";
import { Card, Rarities, Set, Subset } from "@/utilities/types";
import { combineRarities, formatPrice, getPrice } from "@/utilities/formatting";

const cardReducer = (state: any, action: any) => {
  // console.log({ state, action });

  if (action.type === "initialize") {
    state = { ...state, ...action.value };

    const initialLabel = Object.keys(state.label)
      .filter((key) => state.label[key])
      .map(
        (txt) =>
          state.labelOptions.find(
            (option) => option.value.toLowerCase() == txt.toLowerCase()
          )?.value
      );

    state.labelInitial = initialLabel;
  }

  if (action.type === "filter") {
    const selection = action.value;

    const raritySelection = selection.reduce((prev: any, cur: any) => {
      prev[cur] = true;
      return prev;
    }, {});

    state.raritySelection = raritySelection;
  }

  if (action.type === "sort") {
    state.sortId = action.value ?? "price-high-low";
    localStorage.setItem("sortId", state.sortId);
  }

  if (action.type === "label") {
    const labelSelection = action.value.reduce((prev: any, cur: string) => {
      prev[cur.toLowerCase()] = true;
      return prev;
    }, {});

    state.label = labelSelection;
    localStorage.setItem("label", JSON.stringify(state.label));
  }

  if (action.type === "subset") {
    state.includeSubset = action.value;
    localStorage.setItem("includeSubset", `${state.includeSubset}`);
  }

  if (action.type === "reverse") {
    state.includeReverse = action.value;
    localStorage.setItem("includeReverse", `${state.includeReverse}`);
  }

  if (action.type === "size") {
    state.size = action.value;
    localStorage.setItem("size", `${state.size}`);
  }

  // ---------------------------------------

  const { cards, subset, includeSubset, rarities, raritySelection, sortId } =
    state;

  const filterOptions = Object.entries(
    combineRarities(rarities, includeSubset == "true" && subset?.rarities)
  ).map(([rarity, count]: any) => ({
    label: `${rarity} (${count})`,
    value: rarity,
  }));

  // ---------

  const totalCards = [...cards, ...(subset?.cards ?? [])];

  const totalCount = totalCards.length;

  const totalPrice = formatPrice(
    totalCards.reduce((prev, cur) => prev + getPrice(cur), 0)
  );

  // ---------

  const selectedCards = totalCards
    .filter((x) => {
      if (isNaN(parseInt(x.number)) && includeSubset !== "true") {
        return false;
      }

      return raritySelection && Object.keys(raritySelection)?.length
        ? raritySelection[x.rarity]
        : true;
    })
    .sort((a, b) => {
      if (sortId === "number-low-high") {
        if (isNaN(parseInt(a.number))) {
          // move cards with subset numbers to the back
          return 1;
        }
        return parseInt(a.number, 10) > parseInt(b.number, 10) ? 1 : -1;
      }

      if (sortId === "number-high-low") {
        if (isNaN(parseInt(a.number))) {
          // move cards with subset numbers to the front
          return -1;
        }
        return parseInt(a.number, 10) < parseInt(b.number, 10) ? 1 : -1;
      }

      if (sortId === "price-high-low") {
        const aPrice = getPrice(a);
        const bPrice = getPrice(b);

        // no price has a higher likelihood of high price,
        // move no price items to the front
        if (aPrice === 0) return -1;
        if (bPrice === 0) return 1;

        return aPrice < bPrice ? 1 : -1;
      }

      if (sortId === "price-low-high") {
        return getPrice(a) > getPrice(b) ? 1 : -1;
      }

      // fallback
      return 1;
    });

  const selectedCount = selectedCards.length;

  const selectedPrice = formatPrice(
    selectedCards.reduce((prev, cur) => prev + getPrice(cur), 0)
  );

  return {
    ...state,
    selectedCards,
    selectedCount,
    selectedPrice,
    totalCount,
    totalPrice,
    filterOptions,
  };
};

const formatDate = (date: string) => {
  const [year, month, day] = date.split("/");

  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${months[parseInt(month) - 1]} ${day}, ${year}`;
};

export default function SetCards({
  cards,
  rarities,
  initialRaritySelection = [],
  seriesView,
  sets = [],
  set,
  subset,
}: {
  cards: Card[];
  rarities: Rarities;
  initialRaritySelection?: string[];
  labels?: any;
  initialLabelSelection?: any;
  seriesView?: boolean;
  sets?: Set[];
  set?: Set;
  subset?: Subset;
}) {
  const { name, series, releaseDate, images } = set || sets[0];
  const router = useRouter();
  const scrollDirection = useScrollDirection();
  const [initialView, setInitialView] = useLocalStorage("fullscreen", "view");
  const { binders, newBinderName, setNewBinderName, createBinder, addCard } =
    useBinders();
  const [cardState, cardDispatch] = useReducer(cardReducer, undefined);
  const [view, setView] = useState(initialView);
  const [selectedCard, setSelectedCard] = useState(null);

  // infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [loadedCards, setLoadedCards] = useState([]);
  const loadMore = () => {
    if (loadedCards.length === cardState.selectedCards.length) {
      setHasMore(false);
    } else {
      setLoadedCards(
        cardState.selectedCards.slice(
          0,
          Math.min(cardState.selectedCards.length, loadedCards.length + 50)
        )
      );
    }
  };

  useEffect(() => {
    if (cardState?.selectedCards?.length) {
      setLoadedCards(
        cardState.selectedCards.slice(
          0,
          Math.min(cardState.selectedCards.length, 50)
        )
      );

      if (!hasMore) {
        setHasMore(true);
      }
    }
  }, [cardState]);

  useEffect(() => {
    const storage = {
      sortId: localStorage.getItem("sortId"),
      label:
        localStorage.getItem("label") &&
        JSON.parse(localStorage.getItem("label") ?? ""),
      includeSubset: localStorage.getItem("includeSubset"),
      includeReverse: localStorage.getItem("includeReverse"),
      size: localStorage.getItem("size"),
    };

    const size = storage.size ?? "196";
    const sortId = seriesView
      ? "price-high-low"
      : storage.sortId ?? "price-high-low";
    const includeSubset = storage.includeSubset ?? "true";
    const includeReverse = seriesView
      ? "false"
      : storage.includeReverse ?? "false";
    const label = storage.label ?? {
      number: false,
      name: false,
      price: true,
      save: false,
    };

    const value = {
      sortId: seriesView ? "price-high-low" : sortId,
      label: seriesView
        ? {
            number: false,
            name: false,
            price: true,
            save: false,
          }
        : label,
      includeSubset,
      includeReverse,
      size,
      cards,
      rarities,
      set,
      subset,
      labelOptions: [
        { label: "Name", value: "Name" },
        { label: "Price", value: "Price" },
        { label: "Number", value: "Number" },
        { label: "Save", value: "Save" },
      ],
    };

    cardDispatch({
      type: "initialize",
      value,
    });
  }, []);

  return (
    <>
      {cardState && (
        <header
          className={`h-20 z-40 md:h-40 w-full bg-slate-200 transition-all sticky md:flex-col justify-between items-center ${
            scrollDirection === "down" ? "-top-40" : "top-0"
          }`}
        >
          <BreadCrumbs
            series={series}
            set={set && name}
            cardCountLabel={
              set ? formatDate(releaseDate) : `${sets.length} sets`
            }
            cardCount={cardState.totalCount}
            totalPrice={cardState.totalPrice}
            activeViewId={view}
            onViewChange={(x: string) => {
              setView(x);
              setInitialView(x);
              setLoadedCards(
                cardState.selectedCards.slice(
                  0,
                  Math.min(cardState.selectedCards.length, 50)
                )
              );
              setHasMore(true);
            }}
          />

          <div className="flex grow -z-30 justify-between items-center p-2 md:mt-1">
            {/* Mobile sidenav toggle */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              type="button"
              className="p-4 text-slate-700 md:hidden"
              onClick={() => router.push("/sets")}
            >
              <QueueListIcon className="h-6 w-6" aria-hidden="true" />
            </motion.button>

            {set ? (
              <Image
                src={images.logo}
                alt="Set Logo"
                className="w-24 md:w-40 h-auto max-h-24 object-contain md:ml-2"
                height={72}
                width={96}
              />
            ) : (
              <div className="font-geist-sans text-center">
                <h3 className="text-sm">{series}</h3>
                <h2 className="text-md font-semibold">Full Era</h2>
              </div>
            )}

            {/* left side */}
            <div className="hidden md:flex flex-col p-2 justify-between">
              {seriesView &&
                cardState.label.price &&
                cardState.selectedCount < cardState.totalCount && (
                  <div className="text-sm flex gap-5 justify-between">
                    <div className="text-end">
                      <p>
                        {cardState.selectedCount}
                        <span className="text-xs"> cards</span>
                      </p>
                      <p className="text-xs font-semibold font-geist-sans">
                        {Math.round(
                          100 *
                            (parseInt(cardState.selectedCount) /
                              parseInt(cardState.totalCount))
                        )}
                        %
                      </p>
                    </div>

                    <div className="text-start">
                      <p>
                        {cardState.selectedPrice.substring(
                          0,
                          cardState.selectedPrice.length - 3
                        )}
                      </p>
                      <p className="text-xs font-semibold font-geist-sans">
                        {Math.round(
                          100 *
                            (parseFloat(cardState.selectedPrice.substring(1)) /
                              parseFloat(cardState.totalPrice.substring(1)))
                        )}
                        %
                      </p>
                    </div>
                  </div>
                )}

              {subset && (
                <div className="flex mt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="subset-checkbox"
                      type="checkbox"
                      checked={cardState.includeSubset == "true"}
                      onChange={() => {
                        cardDispatch({
                          type: "subset",
                          value:
                            cardState.includeSubset == "true"
                              ? "false"
                              : "true",
                        });
                      }}
                      className="accent-indigo-500"
                    />
                  </div>
                  <div className="ml-2 text-sm">
                    <label
                      htmlFor="subset-checkbox"
                      className="font-medium text-gray-900"
                    >
                      {subset.name}
                      <p
                        id="subset-checkbox-text"
                        className="text-xs font-normal text-gray-500"
                      >
                        {subset.cards.length} card subset
                      </p>
                    </label>
                  </div>
                </div>
              )}

              {view === "binder" && !seriesView && cardState.selectedCards && (
                <div className="flex mt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="reverse-checkbox"
                      type="checkbox"
                      checked={cardState.includeReverse == "true"}
                      onChange={() => {
                        cardDispatch({
                          type: "reverse",
                          value:
                            cardState.includeReverse == "true"
                              ? "false"
                              : "true",
                        });
                      }}
                      className="accent-indigo-500"
                    />
                  </div>
                  <div className="ml-2 text-sm">
                    <label
                      htmlFor="reverse-checkbox"
                      className="font-medium text-gray-900"
                    >
                      Reverse Holos
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* main right side */}
            <div className="hidden lg:flex gap-2">
              {view !== "binder" && (
                <SizeSlider
                  size={cardState.size}
                  onChange={(value: number) => {
                    cardDispatch({ type: "size", value });
                  }}
                />
              )}

              <ComboSelect
                label="Filter"
                options={cardState.filterOptions}
                initialSelection={initialRaritySelection}
                onChange={(selection: any[]) => {
                  cardDispatch({ type: "filter", value: selection });
                }}
              />

              {!seriesView && (
                <SortSelect
                  initial={cardState.sortId}
                  onChange={(selection: any) => {
                    cardDispatch({ type: "sort", value: selection?.id });
                  }}
                />
              )}

              {view !== "binder" && (
                <ComboSelect
                  label="Labels"
                  noSelectionLabel="None"
                  options={cardState.labelOptions}
                  initialSelection={cardState.labelInitial}
                  onChange={(selection: any[]) => {
                    cardDispatch({ type: "label", value: selection });
                  }}
                />
              )}
            </div>

            {/* mobile right side */}
            <div className="lg:hidden">
              <FlyoutMenu label={"Filter"}>
                <div className="flex flex-col gap-2 p-2">
                  {view !== "binder" && (
                    <SizeSlider
                      size={cardState.size}
                      max={300}
                      onChange={(value: number) => {
                        cardDispatch({ type: "size", value });
                      }}
                    />
                  )}

                  <ComboSelect
                    label="Filter"
                    options={cardState.filterOptions}
                    initialSelection={initialRaritySelection}
                    onChange={(selection: any[]) => {
                      cardDispatch({ type: "filter", value: selection });
                    }}
                  />

                  <SortSelect
                    initial={cardState.sortId}
                    onChange={(selection: any) => {
                      cardDispatch({ type: "sort", value: selection?.id });
                    }}
                  />

                  {view !== "binder" && (
                    <ComboSelect
                      label="Labels"
                      noSelectionLabel="None"
                      options={cardState.labelOptions}
                      initialSelection={cardState.labelInitial}
                      onChange={(selection: any[]) => {
                        cardDispatch({ type: "label", value: selection });
                      }}
                    />
                  )}
                </div>
              </FlyoutMenu>
            </div>
          </div>
        </header>
      )}

      {cardState?.selectedCards && (
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
          {/* binder view */}
          {view === "binder" && (
            <BinderView
              cards={loadedCards}
              cardTotal={cardState.selectedCards.length}
              includeReverse={cardState.includeReverse == "true" ? true : false}
              includeSubset={!!cardState.includeSubset}
              subset={subset}
              collection={[]}
              collectionSelection={{ name: "wtf" }}
            />
          )}

          {/* regular view */}
          {view !== "binder" && (
            <ul className="flex flex-wrap justify-center gap-4 my-6 font-geist-sans">
              {loadedCards.map((card: any) => (
                <li
                  key={`setcards-${card.id}`}
                  id={card.id}
                  className={clsx(
                    "pt-1 rounded-lg shadow-2xl flex flex-col justify-between items-center relative",
                    selectedCard === card.id
                      ? "w-[95%] lg:w-[60%] transition-width duration-500"
                      : "h-fit transition-width duration-200"
                  )}
                  style={
                    selectedCard !== card.id
                      ? {
                          width: `${cardState.size}px`,
                        }
                      : {}
                  }
                >
                  {selectedCard === card.id && (
                    <div
                      className="absolute right-2 p-2 cursor-pointer text-slate-700 hover:text-slate-500"
                      onClick={() => setSelectedCard(null)}
                    >
                      <XMarkIcon className="h-6" />
                    </div>
                  )}

                  {cardState?.label.save && selectedCard !== card.id && (
                    <div className="absolute top-0 right-0">
                      <Popover className="relative isolate z-30">
                        {({ open }) => (
                          <>
                            <PopoverButton className="inline-flex h-5 w-5 items-center justify-center rounded-full">
                              <PlusIcon
                                className={clsx(
                                  "h-full w-full transition-all",
                                  open ? "rotate-45" : "rotate-180"
                                )}
                              />
                            </PopoverButton>

                            <PopoverPanel className="absolute max-w-7xl rounded right-0 top-0 -z-10 bg-white shadow-lg ring-1 ring-gray-900/5">
                              <div className="w-40 flex flex-col justify-between gap-2">
                                <h6 className="text-center mt-1">
                                  Add to Binder
                                </h6>
                                <ul
                                  id="binder-popover-list"
                                  className="h-24 w-auto overflow-x-none overflow-y-auto "
                                >
                                  {Object.entries(binders).map(
                                    ([name, cards = []]: [string, any[]]) => (
                                      <li
                                        key={`flyout-${name}`}
                                        className="hover:bg-slate-300 cursor-pointer pl-1"
                                        onClick={() => addCard(name, card)}
                                      >
                                        {name}
                                        <span className="text-xs text-gray ml-1">
                                          ({cards.length})
                                        </span>
                                      </li>
                                    )
                                  )}
                                  {!Object.keys(binders).length && (
                                    <li className="text-center text-sm mt-6">
                                      Group cards together with Binders!
                                    </li>
                                  )}
                                </ul>
                                <div className="flex justify-between max-w-full m-1">
                                  <input
                                    placeholder="Create new binder"
                                    className="w-full text-sm"
                                    value={newBinderName}
                                    onChange={(e) =>
                                      setNewBinderName(e?.currentTarget?.value)
                                    }
                                    onKeyDown={({ key }) => {
                                      if (key === "Enter") {
                                        createBinder();
                                        if (typeof window !== "undefined") {
                                          document.getElementById(
                                            "binder-popover-list"
                                          ).scrollTop = 0;
                                        }
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      createBinder();
                                      if (typeof window !== "undefined") {
                                        document.getElementById(
                                          "binder-popover-list"
                                        ).scrollTop = 0;
                                      }
                                    }}
                                    className="bg-slate-900 rounded-lg text-white"
                                  >
                                    <PlusCircleIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </PopoverPanel>
                          </>
                        )}
                      </Popover>
                    </div>
                  )}

                  {(cardState.label.number ?? cardState.label.name) && (
                    <p
                      className="text-sm pb-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cardState.label.number && (
                        <span>{card.number + ". "}</span>
                      )}
                      {cardState.label.name && <span>{card.name}</span>}
                    </p>
                  )}

                  {cardState.label.price && (
                    <p className="text-md" onClick={(e) => e.stopPropagation()}>
                      {formatPrice(getPrice(card))}
                    </p>
                  )}

                  {card?.images?.small && (
                    <Image
                      src={
                        selectedCard === card.id ||
                        parseInt(cardState.size) > 300
                          ? card.images.large
                          : card.images.small
                      }
                      alt={card.name + " Card"}
                      draggable="false"
                      className="object-contain w-full rounded-md max-h-[512px]"
                      height={cardState.size}
                      width={cardState.size}
                      onClick={() => {
                        if (selectedCard !== card.id) {
                          setSelectedCard(card.id);
                        }
                      }}
                    />
                  )}

                  {selectedCard === card.id && (
                    <div
                      className="text-center py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="mb-2">
                        {card.rarity} - {card.set.name}
                      </p>
                      <Link
                        href={card.tcgplayer?.url ?? "#"}
                        target={card.tcgplayer?.url ? "_blank" : "_self"}
                        className="flex items-center justify-center gap-2 px-1 hover:text-slate-600 border-b-2 border-transparent hover:border-slate-600"
                      >
                        <p>TCG Player {formatPrice(getPrice(card))} </p>
                        <ArrowTopRightOnSquareIcon className="h-4 w-4 mb-1" />
                      </Link>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </InfiniteScroll>
      )}
    </>
  );
}
