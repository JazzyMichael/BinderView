"use client";

import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import BreadCrumbs from "./BreadCrumbs";
import SizeSlider from "./SizeSlider";
import ComboSelect from "./ComboSelect";
import SortSelect from "./SortSelect";
import FlyoutMenu from "./FlyoutMenu";
import { BinderView } from "./BinderView";
import { motion } from "framer-motion";
import { combineRarities } from "@/utilities/data";

const labelOptions = [
  { label: "Name", value: "Name" },
  { label: "Price", value: "Price" },
  { label: "Number", value: "Number" },
  { label: "Save", value: "Save" },
];

const formatPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format;

const getPrice = (card: any, useFirstEdition = false) => {
  if (
    useFirstEdition &&
    card.tcgplayer?.prices &&
    card.tcgplayer?.prices["1stEditionHolofoil"]
  ) {
    return card.tcgplayer.prices["1stEditionHolofoil"].market;
  }

  if (card.tcgplayer?.prices?.unlimitedHolofoil) {
    return card.tcgplayer.prices.unlimitedHolofoil.market;
  }

  if (card.tcgplayer?.prices?.unlimited) {
    return card.tcgplayer.prices.unlimited.market;
  }

  if (card.tcgplayer?.prices?.holofoil) {
    return card.tcgplayer.prices.holofoil.market;
  }

  if (card.tcgplayer?.prices?.normal) {
    return card.tcgplayer?.prices?.normal.market;
  }

  if (card.tcgplayer?.prices?.reverseHolofoil) {
    return card.tcgplayer.prices.reverseHolofoil.market;
  }

  return 0;
};

const cardReducer = (state: any, action: any) => {
  // console.log({ state, action });

  if (action.type === "initialize") {
    state = { ...state, ...action.value };

    const initialLabel = Object.keys(state.label)
      .filter((key) => state.label[key])
      .map(
        (txt) =>
          labelOptions.find(
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
    state.sortId = action.value ?? "number-low-high";
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

  if (action.type === "size") {
    state.size = action.value;
    localStorage.setItem("size", `${state.size}`);
  }

  // ---------------------------------------

  const { cards, subset, includeSubset, rarities, raritySelection, sortId } =
    state;

  const filterOptions = Object.entries(
    combineRarities(rarities, includeSubset && subset?.rarities)
  ).map(([rarity, count]: any) => ({
    label: `${rarity} (${count})`,
    value: rarity,
  }));

  // ---------

  const list =
    subset && includeSubset == "true"
      ? [...cards, ...subset.cards]
      : [...cards];

  const cardList = list
    .filter((x) => {
      return raritySelection && Object.keys(raritySelection)?.length
        ? raritySelection[x.rarity]
        : true;
    })
    .sort((a, b) => {
      if (sortId === "number-low-high") {
        return parseInt(a.number, 10) > parseInt(b.number, 10) ? 1 : -1;
      }

      if (sortId === "number-high-low") {
        return parseInt(a.number, 10) < parseInt(b.number, 10) ? 1 : -1;
      }

      if (sortId === "price-high-low") {
        const aPrice = getPrice(a);
        const bPrice = getPrice(b);

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

  return {
    ...state,
    cardList,
    filterOptions,
    labelOptions,
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
  set,
  sets = [],
  subset,
}: any) {
  const { name, series, releaseDate, images } = set || sets[0];
  const router = useRouter();
  const scrollDirection = useScrollDirection();
  const [initialView, setInitialView] = useLocalStorage("fullscreen", "view");
  const { binders, newBinderName, setNewBinderName, createBinder, addCard } =
    useBinders();
  const [cardState, cardDispatch] = useReducer(cardReducer, undefined);
  const [view, setView] = useState(initialView);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const storage = {
      sortId: localStorage.getItem("sortId"),
      label:
        localStorage.getItem("label") &&
        JSON.parse(localStorage.getItem("label") ?? ""),
      includeSubset: localStorage.getItem("includeSubset"),
      size: localStorage.getItem("size"),
    };

    const sortId = storage.sortId ?? "number-low-high";
    const label = storage.label ?? {
      number: false,
      name: false,
      price: true,
      save: false,
    };
    const includeSubset = "true";
    const size = storage.size ?? "196";

    cardDispatch({
      type: "initialize",
      value: {
        sortId,
        label,
        includeSubset,
        size,
        cards,
        rarities,
        set,
        subset,
      },
    });
  }, []);

  return (
    <>
      {cardState && (
        <header
          className={`h-20 z-40 md:h-40 w-full bg-slate-100 transition-all sticky md:flex-col justify-between items-center ${
            scrollDirection === "down" ? "-top-40" : "top-0"
          }`}
        >
          <BreadCrumbs
            series={series}
            set={set && name}
            cardCountLabel={
              set ? formatDate(releaseDate) : `${sets.length} sets`
            }
            cardCount={`${cardState.cards.length}`}
            activeViewId={view}
            onViewChange={(x: string) => {
              setView(x);
              setInitialView(x);
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
              <img
                src={images.logo}
                alt="Set Logo"
                className="w-24 md:w-40 h-auto max-h-24 object-contain md:ml-2"
              />
            ) : (
              <div>Full {series} Series</div>
            )}

            {/* left side */}
            <div className="hidden md:flex flex-col p-2 justify-between">
              {/* <p className="text-sm font-medium text-gray-700">{total} cards</p> */}

              {subset && cardState && (
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
            </div>

            {/* main right side */}
            <div className="hidden lg:flex gap-2">
              <SizeSlider
                size={cardState?.size}
                onChange={(size: string | number) => {
                  cardDispatch({ type: "size", value: size });
                }}
              />

              <ComboSelect
                label="Filter"
                options={cardState?.filterOptions}
                onChange={(selection: any[]) => {
                  cardDispatch({ type: "filter", value: selection });
                }}
              />

              <SortSelect
                initial={cardState?.sortId}
                onChange={(selection: any) => {
                  cardDispatch({ type: "sort", value: selection?.id });
                }}
              />

              <ComboSelect
                label="Labels"
                noSelectionLabel="None"
                options={cardState?.labelOptions}
                initialSelection={cardState?.labelInitial}
                onChange={(selection: any[]) => {
                  cardDispatch({ type: "label", value: selection });
                }}
              />
            </div>

            {/* mobile right side */}
            <div className="lg:hidden">
              <FlyoutMenu label={"Filter"}>
                <div className="flex flex-col gap-2 p-2">
                  <SizeSlider
                    size={cardState?.size}
                    onChange={(size: string | number) => {
                      cardDispatch({ type: "size", value: size });
                    }}
                  />

                  <ComboSelect
                    label="Filter"
                    options={cardState?.filterOptions}
                    onChange={(selection: any[]) => {
                      cardDispatch({ type: "filter", value: selection });
                    }}
                  />

                  <SortSelect
                    initial={cardState?.sortId}
                    onChange={(selection: any) => {
                      cardDispatch({ type: "sort", value: selection?.id });
                    }}
                  />

                  <ComboSelect
                    label="Labels"
                    noSelectionLabel="None"
                    options={cardState?.labelOptions}
                    initialSelection={cardState?.labelInitial}
                    onChange={(selection: any[]) => {
                      cardDispatch({ type: "label", value: selection });
                    }}
                  />
                </div>
              </FlyoutMenu>
            </div>
          </div>
        </header>
      )}

      {/* binder view */}
      {view === "binder" && cardState?.cardList && (
        <BinderView
          cards={cardState.cardList}
          includeReverse={false}
          includeSubset={!!cardState.includeSubset}
          subset={subset}
          collection={[]}
          collectionSelection={{ name: "wtf" }}
        />
      )}

      {/* regular view */}
      {view !== "binder" && cardState?.cardList && (
        <ul className="flex flex-wrap justify-center gap-4 my-6 font-[family-name:var(--font-geist-sans)]">
          {cardState.cardList.map((card: any, i: number) => (
            <li
              id={card.id}
              key={`setcards-${card.id}-${i}`}
              className={clsx(
                "glass p-1 rounded-md flex flex-col justify-between items-center relative",
                selectedCard === card.id
                  ? "transition-width duration-500"
                  : "transition-width duration-200"
              )}
              style={{
                width: selectedCard === card.id ? "95%" : `${cardState.size}px`,
              }}
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
                  <Popover className="relative isolate z-50">
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
                            <h6 className="text-center mt-1">Add to Binder</h6>
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
                  {cardState.label.number && <span>{card.number + ". "}</span>}
                  {cardState.label.name && <span>{card.name}</span>}
                </p>
              )}

              {cardState.label.price && (
                <p className="text-md" onClick={(e) => e.stopPropagation()}>
                  {formatPrice(getPrice(card))}
                </p>
              )}

              {card?.images?.small && (
                <img
                  src={card.images.small}
                  alt={card.name + " Card"}
                  draggable="false"
                  className="object-contain w-full rounded-md max-h-[500px]"
                  onClick={() => {
                    if (selectedCard !== card.id) {
                      setSelectedCard(card.id);
                    }
                  }}
                />
              )}

              {selectedCard === card.id && (
                <div
                  className="text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="my-2">{card.rarity}</p>
                  <Link
                    href={card.tcgplayer?.url}
                    target="_blank"
                    className="flex items-center justify-center gap-2 px-1 hover:text-slate-600 border-b-2 border-transparent hover:border-slate-600"
                  >
                    <p>TCG Player</p>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
