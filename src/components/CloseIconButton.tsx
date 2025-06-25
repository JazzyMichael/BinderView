"use client";

export default function CloseIconButton({ url }: { url?: string }) {
  return (
    <button
      onClick={() => {
        if (url) {
          window.history.replaceState(null, "", url);
        } else {
          window.history.back();
        }
      }}
      className="flex items-center m-auto p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      aria-label="Close"
    >
      {/* <XMarkIcon className="w-6 h-6 text-slate-500 m-auto" /> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
