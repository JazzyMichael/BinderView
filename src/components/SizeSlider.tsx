export default function SizeSlider({
  size,
  min = 100,
  max = 400,
  onChange,
  showLabel = true,
}: {
  size: number;
  min?: number;
  max?: number;
  onChange?: Function;
  showLabel?: boolean;
}) {
  return (
    <div className="mx-auto">
      <label
        htmlFor="size"
        className="text-sm font-medium leading-6 text-gray-900 block"
      >
        {showLabel && <p>Size</p>}
        <p className="text-center text-indigo-900">{size}px</p>
      </label>

      <input
        type="range"
        id="size"
        name="size"
        step="4"
        min={min}
        max={max}
        value={size}
        className="accent-indigo-500 block"
        onChange={(e) => onChange && onChange(parseInt(`${e.target.value}`))}
      />
    </div>
  );
}
