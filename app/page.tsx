"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, FilterParams } from "@/types/card";
import { getAllCards, getAllSets } from "@/lib/api";
import CardItem from "@/components/CardItem";
import FilterBar from "@/components/FilterBar";
import { Search, X, LayoutGrid, List } from "lucide-react";

export default function Home() {
  const [cards, setCards]       = useState<Card[]>([]);
  const [sets, setSets]         = useState<{ set_id: string; set_name: string }[]>([]);
  const [filters, setFilters]   = useState<FilterParams>({});
  const [search, setSearch]     = useState("");
  const [view, setView]         = useState<"grid" | "list">("grid");
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Card | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [fetchedCards, allSets] = await Promise.all([
          getAllCards(),
          getAllSets(),
        ]);
        setCards(fetchedCards);
        setSets(allSets);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      if (search && !c.name?.toLowerCase().includes(search.toLowerCase()) &&
          !c.id?.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.color  && !c.color?.includes(filters.color))  return false;
      if (filters.type   && c.type?.toUpperCase() !== filters.type.toUpperCase()) return false;
      if (filters.rarity) {
        const normalizedRarity = c.rarity === "SP CARD" ? "SP" : c.rarity;
        if (normalizedRarity !== filters.rarity) return false;
      }
      if (filters.setId) {
        const normalizedFilter = filters.setId.replace(/-/g, "").toUpperCase();
        const setName = c.set?.name ?? "";
        const bracketMatch = setName.match(/\[([^\]]+)\]/);
        const normalizedSet = bracketMatch
          ? bracketMatch[1].replace(/-/g, "").toUpperCase()
          : setName.replace(/-/g, "").toUpperCase();
        if (!normalizedSet.includes(normalizedFilter)) return false;
      }
      return true;
    }).sort((a, b) => {
      const filterId = filters.setId?.replace(/-/g, "").toUpperCase() ?? "";
    
      const aPrefix = a.id?.split("-")[0].toUpperCase() ?? "";
      const bPrefix = b.id?.split("-")[0].toUpperCase() ?? "";
    
      const aMatches = aPrefix.includes(filterId) || filterId.includes(aPrefix);
      const bMatches = bPrefix.includes(filterId) || filterId.includes(bPrefix);
    
      // Push non-matching cards to the end
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
    
      // Sort by card number
      const numA = parseInt(a.id?.split("-")[1] ?? "0");
      const numB = parseInt(b.id?.split("-")[1] ?? "0");
      return numA - numB;
    });
  }, [cards, filters, search]);

  const hasFilters = search || Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black tracking-tight">
            OP<span className="text-red-500">TCG</span>
          </span>
          <div className="w-px h-5 bg-gray-200" />
          <span className="text-sm text-gray-500 font-medium">Card Browser</span>
        </div>

        {/* Search */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-gray-900 focus:bg-white transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-700" />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-md transition-all ${view === "grid" ? "bg-white shadow text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md transition-all ${view === "list" ? "bg-white shadow text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar sets={sets} filters={filters} onChange={setFilters} />

      {/* Results bar */}
      <div className="px-6 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {loading ? "Loading cards..." : (
            <>Showing <strong className="text-gray-900">{filtered.length}</strong> cards</>
          )}
        </span>
        {hasFilters && (
          <button
            onClick={() => { setFilters({}); setSearch(""); }}
            className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Cards */}
      <main className="px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white border border-gray-200 h-64 animate-pulse" />
            ))}
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((card, i) => (
              <CardItem key={`${card.id}-${i}`} card={card} onClick={setSelected} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-w-4xl">
            {filtered.map((card, i) => (
              <div
                key={`${card.id}-${i}`}
                onClick={() => setSelected(card)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-4 cursor-pointer hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <span className="font-mono text-xs text-gray-400 w-24 shrink-0">{card.id}</span>
                <span className="font-semibold text-sm text-gray-900 flex-1">{card.name}</span>
                <span className="text-xs text-gray-400">{card.type}</span>
                {card.power != null && <span className="text-xs text-gray-600">⚔️ {card.power}</span>}
                {card.cost  != null && <span className="text-xs text-gray-600">💎 {card.cost}</span>}
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">🃏</div>
            <div className="font-semibold text-lg">No cards found</div>
            <div className="text-sm mt-1">Try adjusting your filters</div>
          </div>
        )}
      </main>

      {/* Card Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-black text-xl text-gray-900">{selected.name}</div>
                <div className="text-sm text-gray-400 font-mono">{selected.id}</div>
              </div>
              <button onClick={() => setSelected(null)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            {/* Card image */}
            {selected.images?.large && (
              <img
                src={selected.images.large}
                alt={selected.name}
                className="w-full rounded-xl mb-4 object-contain max-h-64"
              />
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              {[
                ["Type",      selected.type],
                ["Rarity",    selected.rarity],
                ["Color",     selected.color],
                ["Cost",      selected.cost],
                ["Power",     selected.power],
                ["Counter",   selected.counter],
                ["Attribute", selected.attribute?.name],
                ["Family",    selected.family],
                ["Set",       selected.set?.name],
              ].filter(([, v]) => v != null && v !== "" && v !== "-").map(([label, value]) => (
                <div key={String(label)} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                  <div className="font-semibold text-gray-900">{String(value)}</div>
                </div>
              ))}
            </div>

            {/* Effect */}
            {selected.ability && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="text-xs text-gray-400 mb-1 font-semibold">Effect</div>
                <div className="text-sm text-gray-700 leading-relaxed">{selected.ability}</div>
              </div>
            )}

            {/* Trigger */}
            {selected.trigger && selected.trigger !== "" && (
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-xs text-yellow-600 mb-1 font-semibold">Trigger</div>
                <div className="text-sm text-gray-700 leading-relaxed">{selected.trigger}</div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}