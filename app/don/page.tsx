"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { ChevronLeft } from "lucide-react";

interface DonCard {
  card_name: string;
  card_text: string;
  rarity: string;
  card_image: string;
  optcg_don_name: string;
  inventory_price: number;
  market_price: number;
}

export default function DonCardsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [donCards, setDonCards] = useState<DonCard[]>([]);
  const [loading, setLoading] = useState(true);

  const isDark = mounted && theme === "dark";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchDonCards() {
      try {
        const res = await fetch("https://www.optcgapi.com/api/allDonCards/");
        const data = await res.json();
        setDonCards(data);
        console.log(`✅ Loaded ${data.length} DON!! cards`);
      } catch (err) {
        console.error("Error fetching DON!! cards:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDonCards();
  }, []);

  return (
    <div
      suppressHydrationWarning
      style={{
        minHeight: "100vh",
        background: isDark ? "#111827" : "#ffffff",
        transition: "background-color 0.3s",
        color: isDark ? "#f3f4f6" : "#111827",
        marginLeft: 70,
      }}
    >
      <Sidebar />

      {/* Header */}
      <header
        style={{
          background: colors.bg.secondary,
          borderBottom: `1px solid ${colors.border}`,
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: colors.text.primary,
            display: "flex",
            alignItems: "center",
            padding: 8,
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>
          DON<span style={{ color: "#ef4444" }}>!!</span> Cards
        </h1>
      </header>

      {/* Results bar */}
      <div
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 12,
          paddingBottom: 12,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <span style={{ fontSize: 14, color: colors.text.tertiary }}>
          {loading ? "Loading DON!! cards..." : (
            <>Showing <strong style={{ color: colors.text.primary }}>{donCards.length}</strong> DON!! cards</>
          )}
        </span>
      </div>

      {/* Cards Grid */}
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
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="skeleton-loader"
                style={{
                  borderRadius: 12,
                  background: colors.bg.tertiary,
                  border: `1px solid ${colors.border}`,
                  height: 256,
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
              marginTop: 16,
            }}
          >
            {donCards.map((card, i) => (
              <div
                key={i}
                style={{
                  cursor: "pointer",
                  borderRadius: 14,
                  overflow: "hidden",
                  background: colors.bg.secondary,
                  border: `1px solid ${colors.border}`,
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
                    background: `linear-gradient(135deg, ${isDark ? "#1f2937" : "#f3f4f6"}, ${colors.bg.tertiary})`,
                    minHeight: 200,
                  }}
                >
                  <img
                    src={card.card_image || "/don-back.png"}
                    alt={card.card_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.src = "/don-back.png";
                    }}
                  />
                </div>

                
                
              </div>
            ))}
          </div>
        )}

        {!loading && donCards.length === 0 && (
          <div
            style={{
              textAlign: "center",
              paddingTop: 96,
              paddingBottom: 96,
              color: colors.text.tertiary,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎴</div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 18,
                color: colors.text.primary,
              }}
            >
              No DON!! cards found
            </div>
          </div>
        )}
      </main>
    </div>
  );
}