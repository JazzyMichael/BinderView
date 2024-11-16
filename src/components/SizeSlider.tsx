import { useState } from "react";

export default function SizeSlider({
  size,
  min = 100,
  max = 400,
  onChange,
  showLabel = true,
  delay = 50,
}: {
  size: number;
  min?: number;
  max?: number;
  onChange?: Function;
  showLabel?: boolean;
  delay?: number;
}) {
  const [localSize, setLocalSize] = useState<number>(size);
  const [timer, setTimer] = useState<any>(null);

  const debounceChange = (val: number) => {
    setLocalSize(val);
    if (onChange) {
      clearTimeout(timer);
      setTimer(setTimeout(() => onChange(val), delay));
    }
  };

  return (
    <div className="mx-auto">
      <label
        htmlFor="size"
        className="text-sm font-medium leading-6 text-gray-900 block"
      >
        {showLabel && <p>Size</p>}
        <p className="text-center text-indigo-900">{localSize}px</p>
      </label>

      <input
        type="range"
        id="size"
        name="size"
        step="4"
        min={min}
        max={max}
        value={localSize}
        className="accent-indigo-500 block"
        onChange={(e) => debounceChange(parseInt(`${e.target.value}`))}
      />
    </div>
  );
}
