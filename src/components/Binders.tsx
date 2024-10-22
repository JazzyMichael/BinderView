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

export default function Binders() {
  const {
    binders,
    newBinderName,
    setNewBinderName,
    createBinder,
    deleteBinder,
    addCard,
    removeCard,
  } = useBinders();
  const [selected, setSelected] = useState("");
  const { setTerm, results } = useSearchCards();
  const [timer, setTimer] = useState<any>(null);

  const debounceSearch = (event: any) => {
    const term =
      event?.currentTarget?.value?.trim() +
      (event.key.length === 1 ? event.key : "");

    clearTimeout(timer);

    if (event.key === "Enter") {
      setTerm(term);
    } else {
      const t = setTimeout(() => setTerm(term), 1000);
      setTimer(t);
    }
  };

  return (
    <div className="mx-auto p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Binders</h2>
        </div>
        <div className="p-4 space-y-4">
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
              className="flex-grow p-2 rounded-lg border border-2 border-slate-500"
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

          <motion.ul className="space-y-2">
            {Object.entries(binders).map(([name, cards]: any) => (
              <motion.li
                key={name}
                className={clsx(
                  "p-2 rounded-md cursor-pointer",
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
        </div>
      </div>

      {selected && (
        <>
          <div className="max-w-2xl m-auto mt-5">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex space-x-2"
            >
              <input
                type="text"
                onKeyDown={debounceSearch}
                placeholder="Add Cards"
                className="flex-grow text-center p-2 rounded-t-lg border border-0 border-slate-500"
              />
            </form>
          </div>

          <div className=" max-w-2xl max-h-[360px] overflow-auto m-auto">
            {results &&
              results.map((x, i) => (
                <motion.div
                  key={x.id + "i" + i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addCard(selected, x)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 border border-1 border-slate-400 flex gap-4 w-full"
                >
                  <Image
                    src={x.images.small}
                    alt={x.name}
                    height={80}
                    width={64}
                  />
                  <div className="flex flex-col items-start justify-around">
                    <p>{x.name}</p>
                    <p>
                      <Link href={`/${x.set.id}`}>{x.set.name} </Link>
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

          <ReorderGrid
            cards={binders[selected]}
            onReorder={(cards: any[]) => console.log("reorder", cards)}
            onRemove={(i: number) => removeCard(selected, i)}
          />

          <button
            onClick={() => {
              const temp = selected;
              deleteBinder(temp);
              setSelected("");
            }}
            className="my-10"
          >
            Delete binder &quot;{selected}&quot; binder with{" "}
            {binders[selected].length} cards
          </button>
        </>
      )}
    </div>
  );
}
