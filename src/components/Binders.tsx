"use client";

import useBinders from "@/hooks/useBinders";
import useSearchCards from "@/hooks/useSearchCards";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import ReorderGrid from "./ReorderGrid";
import { BinderView } from "./BinderView";
import SizeSlider from "./SizeSlider";
import { getSlugFromSetId } from "@/utilities/slugs";

export default function Binders() {
  const {
    binders,
    newBinderName,
    setNewBinderName,
    createBinder,
    deleteBinder,
    addCard,
    removeCard,
    reorderCards,
  } = useBinders();

  const { search, results, removeFromResults } = useSearchCards();

  const [selected, setSelected] = useState("");
  const [view, setView] = useState("Reorder");
  const [size, setSize] = useState(150);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start justify-around mx-auto p-4 font-geist-sans">
        <div className="flex-1 w-full max-w-2xl bg-white shadow-md rounded-lg overflow-hidden p-4 space-y-4">
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              createBinder(newBinderName);
            }}
            className="flex space-x-2"
          >
            <input
              disabled={Object.keys(binders).length > 4}
              type="text"
              value={newBinderName}
              onChange={(e) => setNewBinderName(e.target.value)}
              placeholder="New binder name"
              className="flex-grow p-2 rounded-lg border-2 border-slate-500"
            />
            <motion.button
              disabled={Object.keys(binders).length > 4}
              type="submit"
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 6 }}
              className="bg-slate-900 text-white flex gap-3 p-3 rounded-lg"
            >
              <PlusCircleIcon className="h-6 w-6" />
              Add
            </motion.button>
          </form>

          <motion.ul>
            {Object.entries(binders).map(([name, cards]: any) => (
              <motion.li
                key={name}
                className={clsx(
                  "p-2 my-2 text-center rounded-md cursor-pointer",
                  selected === name
                    ? "bg-slate-700 text-white"
                    : "bg-slate-200 text-slate-800"
                )}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => setSelected((x) => (x === name ? "" : name))}
              >
                {name}{" "}
                <span className="text-sm text-slate-500">
                  ({cards?.length ?? 0} cards)
                </span>
              </motion.li>
            ))}
          </motion.ul>

          {selected && (
            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  const temp = selected;
                  deleteBinder(temp);
                  setSelected("");
                }}
                className="py-1 px-2 m-1 rounded-md bg-red-300 hover:bg-red-500"
              >
                Delete
              </button>
              <p>
                &quot;{selected}&quot; binder with {binders[selected].length}{" "}
                cards
              </p>
            </div>
          )}
        </div>

        {selected && (
          <div className="flex-1 w-full max-w-2xl">
            <form
              onSubmit={(e) => {
                // Reduce search delay on "Enter" press
                e.preventDefault();
                search(e?.target[0]?.value ?? "", 10);
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                onChange={(e: any) => search(e?.currentTarget?.value ?? "")}
                placeholder="Add Cards"
                className={clsx(
                  "flex-grow text-center p-2 border-0",
                  results?.length ? "rounded-t-lg" : "rounded-lg"
                )}
              />
            </form>

            <div className="max-w-2xl max-h-[300px] overflow-auto m-auto">
              {results.map((x, i) => (
                <motion.div
                  key={x.id + "i" + i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    addCard(selected, x);
                    removeFromResults(x.id);
                  }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 border border-1 border-slate-400 flex gap-4 w-full"
                >
                  <Image
                    src={x.images.small}
                    alt={x.name}
                    height={120}
                    width={72}
                  />
                  <div className="flex flex-col items-start justify-around">
                    <p>{x.name}</p>
                    <p>
                      <Link href={`/${getSlugFromSetId(x.set.id)}`}>
                        {x.set.name}{" "}
                      </Link>
                      <span className="text-sm text-slate-900 mx-2">
                        {x.rarity}{" "}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({x.set.releaseDate.split("/")[0]})
                      </span>
                    </p>
                  </div>
                  <div className="flex ml-auto items-center gap-2 p-2 cursor-pointer">
                    Add
                    <PlusIcon className="h-5 w-5 mb-[2px]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selected && !!binders[selected].length && (
        <div className="flex flex-col w-full">
          <motion.button
            className="ml-auto mr-10 p-2 rounded-md border-2 border-slate-500 hover:bg-slate-100"
            onClick={() =>
              setView((val) => (val === "Reorder" ? "Binder" : "Reorder"))
            }
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Switch to {view === "Reorder" ? "Binder" : "Reorder Grid"}
          </motion.button>

          {view === "Reorder" && (
            <>
              <SizeSlider
                size={size}
                onChange={setSize}
                max={200}
                showLabel={false}
              />
              <ReorderGrid
                cards={binders[selected]}
                size={size}
                onReorder={(cards: any[]) => reorderCards(selected, cards)}
                onRemove={(i: number) => removeCard(selected, i)}
              />
            </>
          )}

          {view === "Binder" && (
            <BinderView
              cards={binders[selected]}
              includeReverse={false}
              includeSubset={false}
              subset={[]}
              collection={[]}
              collectionSelection={{ name: "wtf" }}
            />
          )}
        </div>
      )}
    </>
  );
}
