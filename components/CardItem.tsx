import { Card } from "@/types/card";

const COLOR_STYLES: Record<string, { bg: string; border: string; dot: string }> = {
  Red:        { bg: "#fff1f1", border: "#fca5a5", dot: "#ef4444" },
  Green:      { bg: "#f0fdf4", border: "#86efac", dot: "#22c55e" },
  Blue:       { bg: "#eff6ff", border: "#93c5fd", dot: "#3b82f6" },
  Purple:     { bg: "#faf5ff", border: "#d8b4fe", dot: "#a855f7" },
  Black:      { bg: "#f9fafb", border: "#d1d5db", dot: "#374151" },
  Yellow:     { bg: "#fefce8", border: "#fde047", dot: "#eab308" },
  Multicolor: { bg: "#fff7ed", border: "#fdba74", dot: "#f97316" },
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
  const colors = card.color?.split("/") ?? ["Black"];
  const primaryColor = colors[0].trim();
  const colorStyle = COLOR_STYLES[primaryColor] ?? COLOR_STYLES.Black;
  const normalizedRarity = card.rarity === "SP CARD" ? "SP" : card.rarity;
  const rarityStyle = RARITY_STYLES[normalizedRarity] ?? RARITY_STYLES.C;

  return (
    <div
      onClick={() => onClick(card)}
      className="group cursor-pointer rounded-xl overflow-hidden bg-white border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: colorStyle.border }}
    >
      {/* Image area */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colorStyle.bg}, #f9fafb)` }}
      >
        {/* Color dots */}
        <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
          {colors.map((c) => (
            <div
              key={c}
              className="w-2.5 h-2.5 rounded-full ring-1 ring-white"
              style={{ background: COLOR_STYLES[c.trim()]?.dot ?? "#999" }}
            />
          ))}
        </div>

        {/* Rarity badge */}
        <div
          className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full z-10"
          style={{ color: rarityStyle.color, background: rarityStyle.bg }}
        >
          {rarityStyle.label}
        </div>

        {/* Card image */}
        {card.images?.small ? (
          <img
            src={card.images.small}
            alt={card.name}
            className="w-full object-cover"
          />
        ) : (
          <div
            className="w-16 h-16 my-10 rounded-lg flex items-center justify-center text-3xl border-2 border-dashed"
            style={{ borderColor: colorStyle.border, background: `${colorStyle.dot}15` }}
          >
            {TYPE_ICON[card.type] ?? "🃏"}
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="p-3">
        <div className="font-bold text-sm text-gray-900 truncate">{card.name}</div>
        <div className="text-xs text-gray-400 mt-0.5 mb-2">{card.type}</div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          {card.power != null && <span>⚔️ {card.power.toLocaleString()}</span>}
          {card.cost  != null && <span>💎 {card.cost}</span>}
          {card.counter && card.counter !== "-" && <span>🛡️ {card.counter}</span>}
        </div>
      </div>
    </div>
  );
}