"use client";

import { useState, useEffect } from "react";
import { Card } from "@/types/card";
import { useTheme } from "next-themes";

const COLOR_STYLES: Record<string, { bg: string; border: string; dot: string; darkBg: string }> = {
  Red:        { bg: "#fff1f1", border: "#fca5a5", dot: "#ef4444", darkBg: "#7f1d1d" },
  Green:      { bg: "#f0fdf4", border: "#86efac", dot: "#22c55e", darkBg: "#14532d" },
  Blue:       { bg: "#eff6ff", border: "#93c5fd", dot: "#3b82f6", darkBg: "#0c2340" },
  Purple:     { bg: "#faf5ff", border: "#d8b4fe", dot: "#a855f7", darkBg: "#3f0f5c" },
  Black:      { bg: "#f9fafb", border: "#d1d5db", dot: "#374151", darkBg: "#1f2937" },
  Yellow:     { bg: "#fefce8", border: "#fde047", dot: "#eab308", darkBg: "#54381e" },
  Multicolor: { bg: "#fff7ed", border: "#fdba74", dot: "#f97316", darkBg: "#5a2d0c" },
};

const RARITY_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  L:   { label: "L",   color: "#b45309", bg: "#fef3c7" },
  SEC: { label: "SEC", color: "#dc2626", bg: "#fee2e2" },
  SR:  { label: "SR",  color: "#7c3aed", bg: "#ede9fe" },
  R:   { label: "R",   color: "#1d4ed8", bg: "#dbeafe" },
  UC:  { label: "UC",  color: "#065f46", bg: "#d1fae5" },
  C:   { label: "C",   color: "#6b7280", bg: "#f3f4f6" },
  SP:  { label: "SP",  color: "#9d174d", bg: "#fce7f3" },
  TR:  { label: "TR",  color: "#0369a1", bg: "#e0f2fe" },
  P:   { label: "P",   color: "#92400e", bg: "#fef3c7" },
};

const TYPE_ICON: Record<string, string> = {
  LEADER:    "⚓",
  CHARACTER: "🃏",
  EVENT:     "⚡",
  STAGE:     "🏝️",
};

interface Props {
  card: Card;
  onClick: (card: Card) => void;
}

export default function CardItem({ card, onClick }: Props) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  const cardColors = card.color?.split("/") ?? ["Black"];
  const primaryColor = cardColors[0].trim();
  const colorStyle = COLOR_STYLES[primaryColor] ?? COLOR_STYLES.Black;
  const normalizedRarity = card.name?.includes("(SP)") ? "SP" : card.rarity === "SP" ? "SP" : card.rarity;
  const rarityStyle = RARITY_STYLES[normalizedRarity] ?? RARITY_STYLES.C;

  const bgGradient = isDark
    ? `linear-gradient(135deg, ${colorStyle.darkBg}, #1f2937)`
    : `linear-gradient(135deg, ${colorStyle.bg}, #f9fafb)`;

  const infoAreaBg = isDark ? "#1f2937" : "#ffffff";
  const textPrimary = isDark ? "#f3f4f6" : "#111827";
  const textSecondary = isDark ? "#9ca3af" : "#9ca3af";

  return (
    <div
      onClick={() => onClick(card)}
      style={{
        cursor: "pointer",
        borderRadius: 14,
        overflow: "hidden",
        background: infoAreaBg,
        border: `1px solid ${colorStyle.border}`,
        transition: "all 0.2s",
        transform: "translateY(0)",
      }}
      onMouseEnter={(e) => {
        const element = e.currentTarget as HTMLDivElement;
        element.style.transform = "translateY(-4px)";
        element.style.boxShadow = isDark 
          ? "0 20px 25px rgba(0,0,0,0.4)" 
          : "0 20px 25px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        const element = e.currentTarget as HTMLDivElement;
        element.style.transform = "translateY(0)";
        element.style.boxShadow = "none";
      }}
    >
      {/* Image area */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: bgGradient,
        }}
      >
        {/* Color dots */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 4, zIndex: 10 }}>
          {cardColors.map((c) => (
            <div
              key={c}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: COLOR_STYLES[c.trim()]?.dot ?? "#999",
                border: "1px solid white",
              }}
            />
          ))}
        </div>

        {/* Rarity badge */}
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: 12,
            fontWeight: 700,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 9999,
            zIndex: 10,
            color: rarityStyle.color,
            background: rarityStyle.bg,
          }}
        >
          {rarityStyle.label}
        </div>

        {/* Card image */}
        {card.images?.small ? (
          <img
            src={card.images.small}
            alt={card.name}
            style={{
              width: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              marginTop: 40,
              marginBottom: 40,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              border: `2px dashed ${colorStyle.border}`,
              background: `${colorStyle.dot}26`,
            }}
          >
            {TYPE_ICON[card.type] ?? "🃏"}
          </div>
        )}
      </div>

      {/* Info area */}
      {/* <div style={{ padding: 12 }}>
        <div style={{
          fontWeight: 700,
          fontSize: 14,
          color: textPrimary,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {card.name}
        </div>
        <div style={{
          fontSize: 12,
          color: textSecondary,
          marginTop: 4,
          marginBottom: 8,
        }}>
          {card.type}
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          color: textSecondary,
          gap: 4,
        }}>
          {card.power != null && <span>⚔️ {card.power.toLocaleString()}</span>}
          {card.cost  != null && <span>💎 {card.cost}</span>}
          {card.counter && card.counter !== "-" && <span>🛡️ {card.counter}</span>}
        </div>
      </div> */}
    </div>
  );
}