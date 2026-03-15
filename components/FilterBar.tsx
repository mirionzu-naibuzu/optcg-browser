"use client";

import { FilterParams } from "@/types/card";

const COLORS   = ["Red", "Green", "Blue", "Purple", "Black", "Yellow"];
const TYPES = ["LEADER", "CHARACTER", "EVENT", "STAGE"];
const RARITIES = ["SEC", "SR", "R", "UC", "C", "SP", "TR", "P"];

const COLOR_DOT: Record<string, string> = {
  Red: "#ef4444", Green: "#22c55e", Blue: "#3b82f6",
  Purple: "#a855f7", Black: "#374151", Yellow: "#eab308",
};

interface Props {
  sets: { set_id: string; set_name: string }[];
  filters: FilterParams;
  onChange: (filters: FilterParams) => void;
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all whitespace-nowrap
        ${active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
        }`}
    >
      {label}
    </button>
  );
}

export default function FilterBar({ sets, filters, onChange }: Props) {
  const set = (key: keyof FilterParams, value: string) =>
    onChange({ ...filters, [key]: filters[key] === value ? undefined : value });

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 space-y-3">

      {/* Set filter */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide w-8 shrink-0">Set</span>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sets.map((s, i) => (
            <Chip
              key={s.set_id ?? i}
              label={s.set_id}
              active={filters.setId === s.set_id}
              onClick={() => set("setId", s.set_id)}
            />
          ))}
        </div>
      </div>

      {/* Color + Type + Rarity */}
      <div className="flex flex-wrap gap-6">

        {/* Color */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Color</span>
          <div className="flex gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                title={c}
                onClick={() => set("color", c)}
                className="w-6 h-6 rounded-full transition-all"
                style={{
                  background: COLOR_DOT[c],
                  outline: filters.color === c ? `3px solid ${COLOR_DOT[c]}` : "none",
                  outlineOffset: 2,
                  opacity: filters.color && filters.color !== c ? 0.4 : 1,
                }}
              />
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Type</span>
          <div className="flex gap-1.5">
            {TYPES.map((t) => (
              <Chip
                key={t}
                label={t}
                active={filters.type === t}
                onClick={() => set("type", t)}
              />
            ))}
          </div>
        </div>

        {/* Rarity */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Rarity</span>
          <div className="flex gap-1.5">
            {RARITIES.map((r) => (
              <Chip
                key={r}
                label={r}
                active={filters.rarity === r}
                onClick={() => set("rarity", r)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}