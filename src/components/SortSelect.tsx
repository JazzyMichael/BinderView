import { Fragment, useState } from "react";
import {
  Listbox,
  Transition,
  ListboxOptions,
  ListboxOption,
  ListboxButton,
  Label,
} from "@headlessui/react";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";

const options = [
  {
    id: "number-low-high",
    property: "number",
    label: "Number",
    icon: ArrowTrendingUpIcon,
  },
  {
    id: "number-high-low",
    property: "number",
    label: "Number",
    icon: ArrowTrendingDownIcon,
  },
  {
    id: "price-low-high",
    property: "price",
    label: "Price",
    icon: ArrowTrendingUpIcon,
  },
  {
    id: "price-high-low",
    property: "price",
    label: "Price",
    icon: ArrowTrendingDownIcon,
  },
];

export default function SortSelect({
  onChange,
  initial,
}: {
  onChange: any;
  initial?: string;
}) {
  const [selected, setSelected] = useState(
    options.find((o) => o.id === initial) || options[0]
  );

  return (
    <Listbox
      value={selected}
      onChange={(selection) => {
        setSelected(selection);
        if (onChange) onChange(selection);
      }}
    >
      {({ open }) => (
        <>
          <div className="relative w-32">
            <Label className="block text-sm font-medium leading-6 text-gray-900">
              Sort
            </Label>

            <ListboxButton className="relative mt-2 w-full cursor-pointer rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{selected.label}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <selected.icon className="h-5 w-5 text-gray-400" aria-hidden />
              </span>
            </ListboxButton>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <ListboxOption
                    key={option.id}
                    className={({ active }) =>
                      clsx(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-pointer select-none p-2"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={clsx(
                            selected ? "font-semibold" : "font-normal",
                            "flex justify-between truncate"
                          )}
                        >
                          {option.label}

                          <option.icon
                            className={clsx(
                              active
                                ? "text-white mr-0 rotate-0"
                                : "text-indigo-600 mr-3 rotate-6",
                              "h-5 w-5 transform transition-all duration-150"
                            )}
                            aria-hidden
                          />
                        </span>
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
