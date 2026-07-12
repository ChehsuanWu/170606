"use client";

export function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-slate-700">{label}</legend>
      <div className="flex max-h-40 flex-wrap gap-x-4 gap-y-1.5 overflow-y-auto rounded-md border border-slate-200 bg-white p-2.5">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-1.5 text-sm text-slate-600"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className="h-3.5 w-3.5 rounded border-slate-300"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
