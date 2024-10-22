import { Fragment } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";

export default function FlyoutMenu({ children }: any) {
  return (
    <Popover className="relative isolate z-50 p-2">
      <PopoverButton className="inline-flex items-center justify-center gap-x-1 text-sm font-bold leading-6 text-slate-700 p-4 rounded-full hover:bg-slate-200">
        {/* {label} */}
        <AdjustmentsHorizontalIcon className="h-6 w-6" aria-hidden="true" />
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <PopoverPanel className="absolute max-w-7xl rounded right-0 top-0 px-4 py-6 -z-10 bg-white shadow-lg ring-1 ring-gray-900/5">
          {children}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
