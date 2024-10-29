export default function SizeSlider({
  size,
  min = "100",
  max = "400",
  onChange,
}: {
  size: string | number;
  min?: string | number;
  max?: string | number;
  onChange?: Function;
}) {
  return (
    <div>
      <label
        htmlFor="size"
        className="text-sm font-medium leading-6 text-gray-900 block"
      >
        <p>Size</p>
        <p className="text-center text-indigo-900">{size}px</p>
      </label>

      <input
        type="range"
        id="size"
        name="size"
        min={min}
        max={max}
        step="4"
        value={size}
        className="accent-indigo-500 block"
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  );
}
