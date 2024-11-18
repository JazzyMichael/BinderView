import { Fragment, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import {
  Listbox,
  Transition,
  ListboxOptions,
  ListboxOption,
  ListboxButton,
  Label,
} from "@headlessui/react";
import clsx from "clsx";

export default function ComboSelect({
  options = [],
  label = "",
  noSelectionLabel = "All",
  onChange,
  initialSelection = [],
}: {
  options: { label: string; value: any }[];
  label: string;
  noSelectionLabel?: string;
  onChange?: Function;
  initialSelection?: any[];
}) {
  const [selection, setSelection] = useState(initialSelection);

  return (
    <Listbox
      multiple
      value={selection}
      onChange={(x) => {
        setSelection(x);
        if (onChange) onChange(x);
      }}
    >
      {({ open }) => (
        <>
          <div className="relative w-32">
            <Label className="block text-sm font-medium leading-6 text-gray-900">
              {label}
            </Label>
            <ListboxButton className="relative mt-2 w-full cursor-pointer rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">
                {selection.length ? selection.join(", ") : noSelectionLabel}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions
                anchor={{ to: "bottom end", gap: "1px" }}
                className="absolute z-40 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {options.map((option, idx) => (
                  <ListboxOption
                    key={`${option.value}-${idx}`}
                    className={({ active }) =>
                      clsx(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-pointer select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={option.value}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={clsx(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {option.label}
                        </span>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
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
