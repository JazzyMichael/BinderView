import { Fragment, useState } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import PageLayout from "./BinderPageLayout";
import clsx from "clsx";

const sizes = [
  { cols: 2, rows: 2 },
  { cols: 3, rows: 3 },
  { cols: 4, rows: 3 },
];

const calculatePages = (selection: any, totalCards: number) => {
  const pageSize = selection.cols * selection.rows;
  const partialPage = totalCards % pageSize ? 1 : 0;
  return Math.floor(totalCards / pageSize) + partialPage;
};

export default function BinderLayoutSelect({
  onSelect = () => null,
  selected = { cols: 3, rows: 3 },
  totalCards,
}: {
  onSelect?: Function;
  selected?: { cols: number; rows: number };
  totalCards: number;
}) {
  const [hoverOption, setHoverOption] = useState<any>(null);

  return (
    <Popover className="relative">
      <PopoverButton className="inline-flex items-center gap-x-1 text-sm font-bold leading-6 text-gray-900">
        <span>Size</span>
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <PopoverPanel className="absolute left-1/2 z-10 mt-2 flex w-screen max-w-max -translate-x-1/2 px-2">
          {({ close }) => (
            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 lg:max-w-3xl">
              <div className="grid grid-cols-1 gap-x-2 gap-y-1 p-4 lg:grid-cols-3">
                {sizes.map((option, i) => (
                  <div
                    key={`${i}-${option.cols}x${option.rows}`}
                    onClick={() => {
                      onSelect(option);
                      close();
                    }}
                    onMouseEnter={() => setHoverOption(option)}
                    onMouseLeave={() => setHoverOption(null)}
                    className={clsx(
                      "cursor-pointer rounded-lg p-4 hover:bg-gray-100 flex justify-center items-center gap-8",
                      selected.cols === option.cols
                        ? "border-2 border-gray-200"
                        : "border-none"
                    )}
                  >
                    <PageLayout cols={option.cols} rows={option.rows} />

                    <div className="text-indigo-800 text-lg font-bold">
                      {option.cols} x {option.rows}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-8 py-6">
                <div className="flex items-center gap-x-3">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    Choose a size!
                  </h3>
                  <p className="rounded-full bg-indigo-600/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-600">
                    New
                  </p>
                  <p className="ml-auto text-lg">
                    {calculatePages(hoverOption ?? selected, totalCards)} Pages
                    {" - " + totalCards} Cards
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Cards are organized for each binder size
                </p>
              </div>
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
