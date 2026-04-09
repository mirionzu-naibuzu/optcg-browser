//WITH A MENU BUTTON

// "use client";

// import { useEffect, useRef, useState, useMemo } from "react";
// import { Card, FilterParams } from "@/types/card";
// import { getAllCards, getAllSets } from "@/lib/api";
// import CardItem from "@/components/CardItem";
// import FilterBar from "@/components/FilterBar";
// import { Search, X, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
// import { createClient } from "@/lib/supabase";
// import AuthModal from "@/components/AuthModal";
// import type { User } from "@supabase/supabase-js";
// import { useTheme } from "next-themes";

// export default function Home() {
//   const [cards, setCards]         = useState<Card[]>([]);
//   const [sets, setSets]           = useState<{ set_id: string; set_name: string }[]>([]);
//   const [filters, setFilters]     = useState<FilterParams>({});
//   const [search, setSearch]       = useState("");
//   const [view, setView]           = useState<"grid" | "list">("grid");
//   const [loading, setLoading]     = useState(true);
//   const [selectedIndex, setSelectedIndex] = useState<number>(-1);
//   const [showScrollTop, setShowScrollTop] = useState(false);
//   const [user, setUser]           = useState<User | null>(null);
//   const [showAuth, setShowAuth]   = useState(false);
//   const [authMode, setAuthMode]   = useState<"login" | "signup">("login");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   const isDark = mounted && theme === "dark";

//   // Centralized color palette - always defined to prevent hydration issues
//   const colors = {
//     bg: {
//       primary: isDark ? "#111827" : "#ffffff",
//       secondary: isDark ? "#1f2937" : "#f9fafb",
//       tertiary: isDark ? "#374151" : "#f3f4f6",
//     },
//     text: {
//       primary: isDark ? "#f3f4f6" : "#111827",
//       secondary: isDark ? "#d1d5db" : "#4b5563",
//       tertiary: isDark ? "#9ca3af" : "#6b7280",
//     },
//     border: isDark ? "#374151" : "#e5e7eb",
//     accent: "#ef4444",
//   };

//   // Handle hydration mismatch with theme
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     async function load() {
//       try {
//         const [fetchedCards, allSets] = await Promise.all([
//           getAllCards(),
//           getAllSets(),
//         ]);
//         setCards(fetchedCards);
//         setSets(allSets);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   useEffect(() => {
//     const supabase = createClient();
//     supabase.auth.getUser().then(({ data }) => setUser(data.user));
//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//     });
//     return () => listener.subscription.unsubscribe();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setShowScrollTop(window.scrollY > 400);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const filtered = useMemo(() => {
//     return cards.filter((c) => {
//       if (search && !c.name?.toLowerCase().includes(search.toLowerCase()) &&
//           !c.id?.toLowerCase().includes(search.toLowerCase())) return false;
//       if (filters.color  && !c.color?.includes(filters.color))  return false;
//       if (filters.type   && c.type?.toUpperCase() !== filters.type.toUpperCase()) return false;
//       if (filters.rarity) {
//         const normalizedRarity = c.rarity === "SP CARD" ? "SP" : c.rarity;
//         if (normalizedRarity !== filters.rarity) return false;
//       }
//       if (filters.setId) {
//         const normalizedFilter = filters.setId.replace(/-/g, "").toUpperCase();
//         const setName = c.set?.name ?? "";
//         const bracketMatch = setName.match(/\[([^\]]+)\]/);
//         const normalizedSet = bracketMatch
//           ? bracketMatch[1].replace(/-/g, "").toUpperCase()
//           : setName.replace(/-/g, "").toUpperCase();
//         if (!normalizedSet.includes(normalizedFilter)) return false;
//       }
//       return true;
//     }).sort((a, b) => {
//       const filterId = filters.setId?.replace(/-/g, "").toUpperCase() ?? "";
//       const aPrefix = a.id?.split("-")[0].toUpperCase() ?? "";
//       const bPrefix = b.id?.split("-")[0].toUpperCase() ?? "";
//       const aMatches = aPrefix.includes(filterId) || filterId.includes(aPrefix);
//       const bMatches = bPrefix.includes(filterId) || filterId.includes(bPrefix);
//       if (aMatches && !bMatches) return -1;
//       if (!aMatches && bMatches) return 1;
//       const numA = parseInt(a.id?.split("-")[1] ?? "0");
//       const numB = parseInt(b.id?.split("-")[1] ?? "0");
//       return numA - numB;
//     });
//   }, [cards, filters, search]);

//   const selected = selectedIndex >= 0 ? filtered[selectedIndex] : null;
//   const filteredRef = useRef(filtered);
//   filteredRef.current = filtered;

//   useEffect(() => {
//     const handleKey = (e: KeyboardEvent) => {
//       if (selectedIndex < 0) return;
//       e.preventDefault();
//       if (e.key === "ArrowRight" && selectedIndex < filteredRef.current.length - 1)
//         setSelectedIndex(prev => prev + 1);
//       if (e.key === "ArrowLeft" && selectedIndex > 0)
//         setSelectedIndex(prev => prev - 1);
//       if (e.key === "Escape")
//         setSelectedIndex(-1);
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [selectedIndex]);

//   const hasFilters = search || Object.values(filters).some(Boolean);

//   return (
//     <div 
//       suppressHydrationWarning
//       style={{ 
//         minHeight: "100vh", 
//         background: isDark ? "#111827" : "#ffffff", 
//         transition: "background-color 0.3s",
//         color: isDark ? "#f3f4f6" : "#111827",
//       }}
//     >

//       {/* Header */}
//       <header style={{
//         background: colors.bg.secondary,
//         borderBottom: `1px solid ${colors.border}`,
//         padding: "12px 24px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         position: "sticky",
//         top: 0,
//         zIndex: 50,
//         transition: "all 0.3s",
//       }}>

//         {/* Logo */}
//         <div style={{ display: "flex", alignItems: "center", gap: 12, width: 192 }}>
//           <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.03em", color: colors.text.primary }}>
//             OP<span style={{ color: "#ef4444" }}>TCG</span>
//           </span>
//           <div style={{ width: 1, height: 20, background: colors.border }} />
//           <span style={{ fontSize: 14, color: colors.text.tertiary, fontWeight: 500 }}>Card Browser</span>
//         </div>

//         {/* Search + View toggle — centered */}
//         <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "center", paddingRight: 32 }}>
//           <div style={{ position: "relative", width: 320 }}>
//             <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: colors.text.tertiary }} />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search card"
//               style={{
//                 width: "100%",
//                 paddingLeft: 36,
//                 paddingRight: 16,
//                 paddingTop: 8,
//                 paddingBottom: 8,
//                 fontSize: 14,
//                 border: `1px solid ${colors.border}`,
//                 borderRadius: 8,
//                 background: colors.bg.primary,
//                 color: colors.text.primary,
//                 outline: "none",
//                 transition: "all 0.2s",
//               }}
//               onFocus={(e) => {
//                 e.currentTarget.style.borderColor = colors.text.primary;
//                 e.currentTarget.style.boxShadow = `0 0 0 3px ${isDark ? "rgba(243,244,246,0.1)" : "rgba(17,24,39,0.1)"}`;
//               }}
//               onBlur={(e) => {
//                 e.currentTarget.style.borderColor = colors.border;
//                 e.currentTarget.style.boxShadow = "none";
//               }}
//             />
//             {search && (
//               <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
//                 <X style={{ width: 14, height: 14, color: colors.text.tertiary }} />
//               </button>
//             )}
//           </div>
//           <div style={{ display: "flex", gap: 4, background: colors.tertiary, padding: 4, borderRadius: 8, flexShrink: 0 }}>
//             <button
//               onClick={() => setView("grid")}
//               style={{
//                 padding: 6,
//                 borderRadius: 6,
//                 background: view === "grid" ? colors.bg.primary : "transparent",
//                 border: "none",
//                 cursor: "pointer",
//                 color: view === "grid" ? colors.text.primary : colors.text.tertiary,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 transition: "all 0.2s",
//               }}
//             >
//               <LayoutGrid style={{ width: 16, height: 16 }} />
//             </button>
//             <button
//               onClick={() => setView("list")}
//               style={{
//                 padding: 6,
//                 borderRadius: 6,
//                 background: view === "list" ? colors.bg.primary : "transparent",
//                 border: "none",
//                 cursor: "pointer",
//                 color: view === "list" ? colors.text.primary : colors.text.tertiary,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 transition: "all 0.2s",
//               }}
//             >
//               <List style={{ width: 16, height: 16 }} />
//             </button>
//           </div>
//           {mounted && (
//             <button
//               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//               style={{
//                 padding: 6,
//                 borderRadius: 6,
//                 border: "none",
//                 background: "transparent",
//                 cursor: "pointer",
//                 fontSize: 18,
//                 transition: "all 0.2s",
//               }}
//             >
//               {theme === "dark" ? "☀️" : "🌙"}
//             </button>
//           )}
//         </div>

//         {/* Profile */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
//           <div style={{ position: "relative" }}>
//             {user ? (
//               <button
//                 onClick={() => setShowDropdown(!showDropdown)}
//                 style={{
//                   width: 36,
//                   height: 36,
//                   borderRadius: "50%",
//                   background: isDark ? "#f3f4f6" : "#111827",
//                   color: isDark ? "#111827" : "white",
//                   fontSize: 14,
//                   fontWeight: 700,
//                   border: "none",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   transition: "all 0.2s",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.opacity = "0.8";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.opacity = "1";
//                 }}
//               >
//                 {user.email?.[0].toUpperCase()}
//               </button>
//             ) : (
//               <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <button
//                   onClick={() => { setAuthMode("login"); setShowAuth(true); }}
//                   style={{
//                     paddingLeft: 16,
//                     paddingRight: 16,
//                     paddingTop: 8,
//                     paddingBottom: 8,
//                     fontSize: 14,
//                     fontWeight: 600,
//                     color: colors.text.primary,
//                     background: "transparent",
//                     border: "none",
//                     cursor: "pointer",
//                     transition: "all 0.2s",
//                   }}
//                 >
//                   Sign in
//                 </button>
//                 <button
//                   onClick={() => { setAuthMode("signup"); setShowAuth(true); }}
//                   style={{
//                     paddingLeft: 16,
//                     paddingRight: 16,
//                     paddingTop: 8,
//                     paddingBottom: 8,
//                     background: isDark ? "#f3f4f6" : "#111827",
//                     color: isDark ? "#111827" : "white",
//                     fontSize: 14,
//                     fontWeight: 600,
//                     borderRadius: 8,
//                     border: "none",
//                     cursor: "pointer",
//                     transition: "all 0.2s",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.opacity = "0.8";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.opacity = "1";
//                   }}
//                 >
//                   Sign up
//                 </button>
//               </div>
//             )}

//             {/* Dropdown */}
//             {showDropdown && user && (
//               <div
//                 style={{
//                   position: "fixed",
//                   top: 56,
//                   right: 16,
//                   zIndex: 100,
//                   background: colors.bg.primary,
//                   borderRadius: 12,
//                   boxShadow: isDark
//                     ? "0 20px 25px rgba(0,0,0,0.4)"
//                     : "0 20px 25px rgba(0,0,0,0.1)",
//                   border: `1px solid ${colors.border}`,
//                   width: 256,
//                   overflow: "hidden",
//                 }}
//               >
//                 <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: 12 }}>
//                   <div style={{ width: 40, height: 40, borderRadius: "50%", background: colors.tertiary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                     <span style={{ fontSize: 18, fontWeight: 700, color: colors.text.secondary }}>{user.email?.[0].toUpperCase()}</span>
//                   </div>
//                   <div style={{ overflow: "hidden" }}>
//                     <div style={{ fontWeight: 700, fontSize: 14, color: colors.text.primary, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
//                       {user.user_metadata?.full_name ?? user.email?.split("@")[0]}
//                     </div>
//                     <div style={{ fontSize: 12, color: colors.text.tertiary, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{user.email}</div>
//                   </div>
//                 </div>

//                 {[
//                   { label: "Profile"},
//                   { label: "Binder"},
//                   { label: "Settings"},
//                 ].map((item) => (
//                   <button
//                     key={item.label}
//                     style={{
//                       width: "100%",
//                       paddingLeft: 16,
//                       paddingRight: 16,
//                       paddingTop: 12,
//                       paddingBottom: 12,
//                       fontSize: 14,
//                       color: colors.text.primary,
//                       fontWeight: 500,
//                       textAlign: "left",
//                       background: "transparent",
//                       border: "none",
//                       cursor: "pointer",
//                       transition: "all 0.2s",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.background = colors.tertiary;
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.background = "transparent";
//                     }}
//                     onClick={() => setShowDropdown(false)}
//                   >
//                     {item.label}
//                   </button>
//                 ))}

//                 <div style={{ borderTop: `1px solid ${colors.border}` }}>
//                   <button
//                     onClick={async () => {
//                       const supabase = createClient();
//                       await supabase.auth.signOut();
//                       setShowDropdown(false);
//                     }}
//                     style={{
//                       width: "100%",
//                       paddingLeft: 16,
//                       paddingRight: 16,
//                       paddingTop: 12,
//                       paddingBottom: 12,
//                       fontSize: 14,
//                       color: colors.accent,
//                       fontWeight: 600,
//                       textAlign: "left",
//                       background: "transparent",
//                       border: "none",
//                       cursor: "pointer",
//                       transition: "all 0.2s",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.background = isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.05)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.background = "transparent";
//                     }}
//                   >
//                     Sign out
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Filter Bar */}
//       <FilterBar sets={sets} filters={filters} onChange={setFilters} />

//       {/* Results bar */}
//       <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${colors.border}` }}>
//         <span style={{ fontSize: 14, color: colors.text.tertiary }}>
//           {loading ? "Loading cards..." : (
//             <>Showing <strong style={{ color: colors.text.primary }}>{filtered.length}</strong> cards</>
//           )}
//         </span>
//         {hasFilters && (
//           <button
//             onClick={() => { setFilters({}); setSearch(""); }}
//             style={{
//               fontSize: 12,
//               color: colors.accent,
//               fontWeight: 600,
//               background: "transparent",
//               border: "none",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: 4,
//               transition: "all 0.2s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.opacity = "0.7";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.opacity = "1";
//             }}
//           >
//             <X style={{ width: 12, height: 12 }} /> Clear filters
//           </button>
//         )}
//       </div>

//       {/* Cards */}
//       <main style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 64 }}>
//         <style>{`
//           @keyframes pulse {
//             0%, 100% { opacity: 1; }
//             50% { opacity: 0.5; }
//           }
//           .skeleton-loader {
//             animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//           }
//         `}</style>
//         {loading ? (
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16, marginTop: 16 }}>
//             {Array.from({ length: 18 }).map((_, i) => (
//               <div key={i} className="skeleton-loader" style={{ borderRadius: 12, background: colors.tertiary, border: `1px solid ${colors.border}`, height: 256 }} />
//             ))}
//           </div>
//         ) : view === "grid" ? (
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16, marginTop: 16 }}>
//             {filtered.map((card, i) => (
//               <CardItem key={`${card.id}-${i}`} card={card} onClick={() => setSelectedIndex(i)} />
//             ))}
//           </div>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 896, marginTop: 16 }}>
//             {filtered.map((card, i) => (
//               <div
//                 key={`${card.id}-${i}`}
//                 onClick={() => setSelectedIndex(i)}
//                 style={{
//                   background: colors.bg.secondary,
//                   border: `1px solid ${colors.border}`,
//                   borderRadius: 12,
//                   paddingLeft: 16,
//                   paddingRight: 16,
//                   paddingTop: 12,
//                   paddingBottom: 12,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 16,
//                   cursor: "pointer",
//                   transition: "all 0.2s",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.borderColor = colors.text.primary;
//                   e.currentTarget.style.boxShadow = `0 1px 3px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`;
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.borderColor = colors.border;
//                   e.currentTarget.style.boxShadow = "none";
//                 }}
//               >
//                 <span style={{ fontFamily: "monospace", fontSize: 12, color: colors.text.tertiary, width: 96, flexShrink: 0 }}>{card.id}</span>
//                 <span style={{ fontWeight: 600, fontSize: 14, color: colors.text.primary, flex: 1 }}>{card.name}</span>
//                 <span style={{ fontSize: 12, color: colors.text.tertiary }}>{card.type}</span>
//                 {card.power != null && <span style={{ fontSize: 12, color: colors.text.secondary }}>⚔️ {card.power}</span>}
//                 {card.cost  != null && <span style={{ fontSize: 12, color: colors.text.secondary }}>💎 {card.cost}</span>}
//               </div>
//             ))}
//           </div>
//         )}

//         {!loading && filtered.length === 0 && (
//           <div style={{ textAlign: "center", paddingTop: 96, paddingBottom: 96, color: colors.text.tertiary }}>
//             <div style={{ fontSize: 48, marginBottom: 16 }}>🃏</div>
//             <div style={{ fontWeight: 600, fontSize: 18, color: colors.text.primary }}>No cards found</div>
//             <div style={{ fontSize: 14, marginTop: 4 }}>Try adjusting your filters</div>
//           </div>
//         )}
//       </main>

//       {/* Card Detail Modal */}
//       {selected && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.5)",
//             zIndex: 50,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: 16,
//           }}
//           onClick={() => setSelectedIndex(-1)}
//         >
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>

//             <button
//               onClick={() => setSelectedIndex(selectedIndex - 1)}
//               disabled={selectedIndex <= 0}
//               style={{
//                 flexShrink: 0,
//                 width: 44,
//                 height: 44,
//                 borderRadius: "50%",
//                 background: colors.bg.primary,
//                 boxShadow: isDark ? "0 20px 25px rgba(0,0,0,0.4)" : "0 10px 15px rgba(0,0,0,0.1)",
//                 border: `1px solid ${colors.border}`,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: colors.text.primary,
//                 cursor: selectedIndex > 0 ? "pointer" : "not-allowed",
//                 opacity: selectedIndex <= 0 ? 0.3 : 1,
//                 transition: "all 0.2s",
//               }}
//             >
//               <ChevronLeft style={{ width: 20, height: 20 }} />
//             </button>

//             <div style={{
//               background: colors.bg.primary,
//               borderRadius: 16,
//               paddingLeft: 24,
//               paddingRight: 24,
//               paddingTop: 24,
//               paddingBottom: 24,
//               flex: 1,
//               maxWidth: 448,
//               boxShadow: isDark ? "0 20px 25px rgba(0,0,0,0.4)" : "0 20px 25px rgba(0,0,0,0.1)",
//               maxHeight: "90vh",
//               overflow: "auto",
//               border: `1px solid ${colors.border}`,
//             }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
//                 <div>
//                   <div style={{ fontWeight: 900, fontSize: 20, color: colors.text.primary }}>{selected.name}</div>
//                   <div style={{ fontSize: 12, color: colors.text.tertiary, fontFamily: "monospace" }}>{selected.id}</div>
//                 </div>
//                 <button onClick={() => setSelectedIndex(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
//                   <X style={{ width: 20, height: 20, color: colors.text.tertiary }} />
//                 </button>
//               </div>

//               {selected.images?.large && (
//                 <img
//                   src={selected.images.large}
//                   alt={selected.name}
//                   style={{
//                     width: "100%",
//                     borderRadius: 12,
//                     marginBottom: 16,
//                     objectFit: "contain",
//                     maxHeight: 256,
//                     background: colors.tertiary,
//                   }}
//                 />
//               )}

//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14, marginBottom: 12 }}>
//                 {[
//                   ["Type",      selected.type],
//                   ["Rarity",    selected.rarity],
//                   ["Color",     selected.color],
//                   ["Cost",      selected.cost],
//                   ["Power",     selected.power],
//                   ["Counter",   selected.counter],
//                   ["Attribute", selected.attribute?.name],
//                   ["Family",    selected.family],
//                   ["Set",       selected.set?.name],
//                 ].filter(([, v]) => v != null && v !== "" && v !== "-").map(([label, value]) => (
//                   <div key={String(label)} style={{ background: colors.tertiary, borderRadius: 8, paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12 }}>
//                     <div style={{ fontSize: 12, color: colors.text.tertiary, marginBottom: 4 }}>{label}</div>
//                     <div style={{ fontWeight: 600, color: colors.text.primary }}>{String(value)}</div>
//                   </div>
//                 ))}
//               </div>

//               {selected.ability && (
//                 <div style={{ background: colors.tertiary, borderRadius: 8, paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12, marginBottom: 12 }}>
//                   <div style={{ fontSize: 12, color: colors.text.tertiary, marginBottom: 4, fontWeight: 600 }}>Effect</div>
//                   <div style={{ fontSize: 14, color: colors.text.primary, lineHeight: 1.6 }}>{selected.ability}</div>
//                 </div>
//               )}

//               {selected.trigger && selected.trigger !== "" && (
//                 <div style={{ background: isDark ? "rgba(217,119,6,0.1)" : "rgba(251,191,36,0.1)", borderRadius: 8, paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12 }}>
//                   <div style={{ fontSize: 12, color: isDark ? "#fbbf24" : "#d97706", marginBottom: 4, fontWeight: 600 }}>Trigger</div>
//                   <div style={{ fontSize: 14, color: colors.text.primary, lineHeight: 1.6 }}>{selected.trigger}</div>
//                 </div>
//               )}

//               <div style={{ textAlign: "center", fontSize: 12, color: colors.text.tertiary, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
//                 {selectedIndex + 1} / {filtered.length}
//               </div>
//             </div>

//             <button
//               onClick={() => setSelectedIndex(selectedIndex + 1)}
//               disabled={selectedIndex >= filtered.length - 1}
//               style={{
//                 flexShrink: 0,
//                 width: 44,
//                 height: 44,
//                 borderRadius: "50%",
//                 background: colors.bg.primary,
//                 boxShadow: isDark ? "0 20px 25px rgba(0,0,0,0.4)" : "0 10px 15px rgba(0,0,0,0.1)",
//                 border: `1px solid ${colors.border}`,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: colors.text.primary,
//                 cursor: selectedIndex < filtered.length - 1 ? "pointer" : "not-allowed",
//                 opacity: selectedIndex >= filtered.length - 1 ? 0.3 : 1,
//                 transition: "all 0.2s",
//               }}
//             >
//               <ChevronRight style={{ width: 20, height: 20 }} />
//             </button>

//           </div>
//         </div>
//       )}

//       {/* Auth Modal */}
//       {showAuth && <AuthModal initialMode={authMode} onClose={() => setShowAuth(false)} />}

//       {/* Scroll to top */}
//       {showScrollTop && (
//         <button
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           style={{
//             position: "fixed",
//             bottom: 32,
//             left: "50%",
//             transform: "translateX(-50%)",
//             width: 56,
//             height: 56,
//             borderRadius: "50%",
//             background: isDark ? "#4b5563" : "#374151",
//             color: "white",
//             border: "none",
//             cursor: "pointer",
//             fontSize: 22,
//             fontWeight: 700,
//             boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.3)",
//             zIndex: 999,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             transition: "all 0.2s",
//           }}
//         >
//           ↑
//         </button>
//       )}

//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Card, FilterParams } from "@/types/card";
import { getAllCards, getAllSets } from "@/lib/api";
import CardItem from "@/components/CardItem";
import FilterBar from "@/components/FilterBar";
import Sidebar from "@/components/Sidebar";
import { Search, X, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";

export default function Home() {
  const [cards, setCards]         = useState<Card[]>([]);
  const [sets, setSets]           = useState<{ set_id: string; set_name: string }[]>([]);
  const [filters, setFilters]     = useState<FilterParams>({});
  const [search, setSearch]       = useState("");
  const [view, setView]           = useState<"grid" | "list">("grid");
  const [loading, setLoading]     = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDark = mounted && theme === "dark";

  // Centralized color palette - always defined to prevent hydration issues
  const colors = {
    bg: {
      primary: isDark ? "#111827" : "#ffffff",
      secondary: isDark ? "#1f2937" : "#f9fafb",
      tertiary: isDark ? "#374151" : "#ffffff",
    },
    text: {
      primary: isDark ? "#f3f4f6" : "#111827",
      secondary: isDark ? "#d1d5db" : "#4b5563",
      tertiary: isDark ? "#9ca3af" : "#6b7280",
    },
    border: isDark ? "#374151" : "#e5e7eb",
    accent: "#ef4444",
  };

  // Handle hydration mismatch with theme
  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      if (search && !c.name?.toLowerCase().includes(search.toLowerCase()) &&
          !c.id?.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.color  && !c.color?.includes(filters.color))  return false;
      if (filters.type   && c.type?.toUpperCase() !== filters.type.toUpperCase()) return false;
      if (filters.rarity) {
        // Normalize all rarity values: "SP CARD" → "SP", "P CARD" → "P", etc.
        const normalizedRarity = c.rarity?.replace(/\s+CARD\s*$/i, "").trim() || c.rarity;
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
    
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
    
      const numA = parseInt(a.id?.split("-")[1] ?? "0");
      const numB = parseInt(b.id?.split("-")[1] ?? "0");
    
      return numA - numB;
    });
  }, [cards, filters, search]);

  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : null;
  const filteredRef = useRef(filtered);
  filteredRef.current = filtered;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex < 0) return;
      e.preventDefault();
      if (e.key === "ArrowRight" && selectedIndex < filteredRef.current.length - 1)
        setSelectedIndex(prev => prev + 1);
      if (e.key === "ArrowLeft" && selectedIndex > 0)
        setSelectedIndex(prev => prev - 1);
      if (e.key === "Escape")
        setSelectedIndex(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex]);

  const hasFilters = search || Object.values(filters).some(Boolean);

  return (
    <div 
      suppressHydrationWarning
      style={{ 
        minHeight: "100vh", 
        background: isDark ? "#111827" : "#ffffff", 
        transition: "background-color 0.3s",
        color: isDark ? "#f3f4f6" : "#111827",
        marginLeft: 70, // Account for sidebar width when collapsed
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <header style={{
        background: colors.bg.secondary,
        borderBottom: `1px solid ${colors.border}`,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        top: 0,
        zIndex: 20,
        transition: "all 0.3s",
      }}>

        {/* Search + View toggle — centered */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "center", maxWidth: 800 }}>
          <div style={{ position: "relative", width: 320 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: colors.text.tertiary }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search card"
              style={{
                width: "100%",
                paddingLeft: 36,
                paddingRight: 16,
                paddingTop: 8,
                paddingBottom: 8,
                fontSize: 14,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                background: colors.bg.primary,
                color: colors.text.primary,
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.text.primary;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${isDark ? "rgba(243,244,246,0.1)" : "rgba(17,24,39,0.1)"}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X style={{ width: 14, height: 14, color: colors.text.tertiary }} />
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: 4, background: colors.bg.tertiary, padding: 4, borderRadius: 8, flexShrink: 0 }}>
            <button
              onClick={() => setView("grid")}
              style={{
                padding: 6,
                borderRadius: 6,
                background: view === "grid" ? colors.bg.primary : "transparent",
                border: "none",
                cursor: "pointer",
                color: view === "grid" ? colors.text.primary : colors.text.tertiary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <LayoutGrid style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => setView("list")}
              style={{
                padding: 6,
                borderRadius: 6,
                background: view === "list" ? colors.bg.primary : "transparent",
                border: "none",
                cursor: "pointer",
                color: view === "list" ? colors.text.primary : colors.text.tertiary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <List style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar sets={sets} filters={filters} onChange={setFilters} />

      {/* Results bar */}
      <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${colors.border}` }}>
        <span style={{ fontSize: 14, color: colors.text.tertiary }}>
          {loading ? "Loading cards..." : (
            <>Showing <strong style={{ color: colors.text.primary }}>{filtered.length}</strong> cards</>
          )}
        </span>
        {hasFilters && (
          <button
            onClick={() => { setFilters({}); setSearch(""); }}
            style={{
              fontSize: 12,
              color: colors.accent,
              fontWeight: 600,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <X style={{ width: 12, height: 12 }} /> Clear filters
          </button>
        )}
      </div>

      {/* Cards */}
      <main style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 64 }}>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .skeleton-loader {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginTop: 16 }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="skeleton-loader" style={{ borderRadius: 12, background: colors.bg.tertiary, border: `1px solid ${colors.border}`, height: 256 }} />
            ))}
          </div>
        ) : view === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginTop: 16 }}>
            {filtered.map((card, i) => (
              <CardItem key={`${card.id}-${i}`} card={card} onClick={() => setSelectedIndex(i)} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 896, marginTop: 16 }}>
            {filtered.map((card, i) => (
              <div
                key={`${card.id}-${i}`}
                onClick={() => setSelectedIndex(i)}
                style={{
                  background: colors.bg.secondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 12,
                  paddingBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.text.primary;
                  e.currentTarget.style.boxShadow = `0 1px 3px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ fontFamily: "monospace", fontSize: 12, color: colors.text.tertiary, width: 96, flexShrink: 0 }}>{card.id}</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: colors.text.primary, flex: 1 }}>{card.name}</span>
                <span style={{ fontSize: 12, color: colors.text.tertiary }}>{card.type}</span>
                {card.power != null && <span style={{ fontSize: 12, color: colors.text.secondary }}>⚔️ {card.power}</span>}
                {card.cost  != null && <span style={{ fontSize: 12, color: colors.text.secondary }}>💎 {card.cost}</span>}
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 96, paddingBottom: 96, color: colors.text.tertiary }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🃏</div>
            <div style={{ fontWeight: 600, fontSize: 18, color: colors.text.primary }}>No cards found</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>Try adjusting your filters</div>
          </div>
        )}
      </main>

      {/* Card Detail Modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.5)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setSelectedIndex(-1)}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>

            <button
              onClick={() => setSelectedIndex(selectedIndex - 1)}
              disabled={selectedIndex <= 0}
              style={{
                flexShrink: 0,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: colors.bg.primary,
                boxShadow: isDark ? "0 20px 25px rgba(0,0,0,0.4)" : "0 10px 15px rgba(0,0,0,0.1)",
                border: `1px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.text.primary,
                cursor: selectedIndex > 0 ? "pointer" : "not-allowed",
                opacity: selectedIndex <= 0 ? 0.3 : 1,
                transition: "all 0.2s",
              }}
            >
              <ChevronLeft style={{ width: 20, height: 20 }} />
            </button>

            <div style={{
              background: colors.bg.primary,
              borderRadius: 16,
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 24,
              paddingBottom: 24,
              flex: 1,
              maxWidth: 448,
              boxShadow: isDark ? "0 20px 25px rgba(0,0,0,0.4)" : "0 20px 25px rgba(0,0,0,0.1)",
              maxHeight: "90vh",
              overflow: "auto",
              border: `1px solid ${colors.border}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 20, color: colors.text.primary }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: colors.text.tertiary, fontFamily: "monospace" }}>{selected.id}</div>
                </div>
                <button onClick={() => setSelectedIndex(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <X style={{ width: 20, height: 20, color: colors.text.tertiary }} />
                </button>
              </div>

              {selected.images?.large && (
                <img
                  src={selected.images.large}
                  alt={selected.name}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    marginBottom: 16,
                    objectFit: "contain",
                    maxHeight: 256,
                    background: colors.bg.tertiary,
                  }}
                />
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14, marginBottom: 12 }}>
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
                  <div key={String(label)} style={{ background: colors.bg.tertiary, borderRadius: 8, paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12 }}>
                    <div style={{ fontSize: 12, color: colors.text.tertiary, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 600, color: colors.text.primary }}>{String(value)}</div>
                  </div>
                ))}
              </div>

              {selected.ability && (
                <div style={{ background: colors.bg.tertiary, borderRadius: 8, paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: colors.text.tertiary, marginBottom: 4, fontWeight: 600 }}>Effect</div>
                  <div style={{ fontSize: 14, color: colors.text.primary, lineHeight: 1.6 }}>{selected.ability}</div>
                </div>
              )}

              {selected.trigger && selected.trigger !== "" && (
                <div style={{ background: isDark ? "rgba(217,119,6,0.1)" : "rgba(251,191,36,0.1)", borderRadius: 8, paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12 }}>
                  <div style={{ fontSize: 12, color: isDark ? "#fbbf24" : "#d97706", marginBottom: 4, fontWeight: 600 }}>Trigger</div>
                  <div style={{ fontSize: 14, color: colors.text.primary, lineHeight: 1.6 }}>{selected.trigger}</div>
                </div>
              )}

              <div style={{ textAlign: "center", fontSize: 12, color: colors.text.tertiary, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
                {selectedIndex + 1} / {filtered.length}
              </div>
            </div>

            <button
              onClick={() => setSelectedIndex(selectedIndex + 1)}
              disabled={selectedIndex >= filtered.length - 1}
              style={{
                flexShrink: 0,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: colors.bg.primary,
                boxShadow: isDark ? "0 20px 25px rgba(0,0,0,0.4)" : "0 10px 15px rgba(0,0,0,0.1)",
                border: `1px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.text.primary,
                cursor: selectedIndex < filtered.length - 1 ? "pointer" : "not-allowed",
                opacity: selectedIndex >= filtered.length - 1 ? 0.3 : 1,
                transition: "all 0.2s",
              }}
            >
              <ChevronRight style={{ width: 20, height: 20 }} />
            </button>

          </div>
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: 32,
            left: "calc(50% + 40px)",
            transform: "translateX(-50%)",
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: isDark ? "#4b5563" : "#374151",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: 22,
            fontWeight: 700,
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.3)",
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          ↑
        </button>
      )}

    </div>
  );
}