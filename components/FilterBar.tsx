"use client";

import { useState, useEffect } from "react";
import { FilterParams } from "@/types/card";
import { useTheme } from "next-themes";

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

function Chip({ 
  label, 
  active, 
  onClick,
  isDark,
}: { 
  label: string
  active: boolean
  onClick: () => void
  isDark: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        border: `1px solid ${active 
          ? (isDark ? "#f3f4f6" : "#111827") 
          : (isDark ? "#374151" : "#e5e7eb")}`,
        transition: "all 0.2s",
        whiteSpace: "nowrap",
        background: active
          ? (isDark ? "#f3f4f6" : "#111827")
          : "transparent",
        color: active
          ? (isDark ? "#111827" : "#ffffff")
          : (isDark ? "#9ca3af" : "#6b7280"),
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

export default function FilterBar({ sets, filters, onChange }: Props) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  const colors = {
    bg: isDark ? "#111827" : "#ffffff",
    border: isDark ? "#374151" : "#e5e7eb",
    label: isDark ? "#9ca3af" : "#9ca3af",
    text: isDark ? "#f3f4f6" : "#111827",
  };

  const set = (key: keyof FilterParams, value: string) =>
    onChange({ ...filters, [key]: filters[key] === value ? undefined : value });

  return (
    <div 
      suppressHydrationWarning
      style={{
        background: colors.bg,
        borderBottom: `1px solid ${colors.border}`,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 12,
        paddingBottom: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "all 0.3s",
      }}
    >

      {/* Set filter */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: colors.label, textTransform: "uppercase", letterSpacing: "0.05em", width: 32, flexShrink: 0 }}>Set</span>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {sets.map((s, i) => (
            <Chip
              key={s.set_id ?? i}
              label={s.set_id}
              active={filters.setId === s.set_id}
              onClick={() => set("setId", s.set_id)}
              isDark={isDark}
            />
          ))}
        </div>
      </div>

      {/* Color + Type + Rarity */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>

        {/* Color */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: colors.label, textTransform: "uppercase", letterSpacing: "0.05em" }}>Color</span>
          <div style={{ display: "flex", gap: 6 }}>
            {COLORS.map((c) => (
              <button
                key={c}
                title={c}
                onClick={() => set("color", c)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: COLOR_DOT[c],
                  border: "none",
                  cursor: "pointer",
                  outline: filters.color === c ? `3px solid ${COLOR_DOT[c]}` : "none",
                  outlineOffset: 2,
                  opacity: filters.color && filters.color !== c ? 0.4 : 1,
                  transition: "all 0.2s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Type */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: colors.label, textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</span>
          <div style={{ display: "flex", gap: 6 }}>
            {TYPES.map((t) => (
              <Chip
                key={t}
                label={t}
                active={filters.type === t}
                onClick={() => set("type", t)}
                isDark={isDark}
              />
            ))}
          </div>
        </div>

        {/* Rarity */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: colors.label, textTransform: "uppercase", letterSpacing: "0.05em" }}>Rarity</span>
          <div style={{ display: "flex", gap: 6 }}>
            {RARITIES.map((r) => (
              <Chip
                key={r}
                label={r}
                active={filters.rarity === r}
                onClick={() => set("rarity", r)}
                isDark={isDark}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}