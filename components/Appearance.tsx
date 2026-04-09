"use client";

import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

const themes = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "Bloom", value: "bloom" },
  { name: "Bloom Dark", value: "bloom-dark" },
  { name: "Luna Violet", value: "luna-violet" },
  { name: "Luna Dark", value: "luna-dark" },
];

export default function AppearancePopover() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("luna-violet");
  const ref = useRef<HTMLDivElement>(null);

  // close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "white",
          cursor: "pointer",
        }}
      >
        Appearance
      </button>

      {/* Popover */}
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "110%",
            left: 0,
            width: 260,
            background: "#fff",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            border: "1px solid #e5e7eb",
            zIndex: 50,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 12 }}>
            Appearance
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {themes.map((theme) => {
              const active = selected === theme.value;

              return (
                <div
                  key={theme.value}
                  onClick={() => setSelected(theme.value)}
                  style={{
                    borderRadius: 12,
                    padding: 8,
                    cursor: "pointer",
                    border: active
                      ? "2px solid #8b5cf6"
                      : "1px solid #e5e7eb",
                    background: "#f9fafb",
                  }}
                >
                  {/* Preview */}
                  <div
                    style={{
                      height: 60,
                      borderRadius: 8,
                      background:
                        theme.value.includes("dark")
                          ? "#1f2937"
                          : "#f3f4f6",
                      position: "relative",
                      padding: 6,
                    }}
                  >
                    <div
                      style={{
                        height: 8,
                        width: "60%",
                        background: "#d1d5db",
                        borderRadius: 4,
                        marginBottom: 6,
                      }}
                    />

                    <div
                      style={{
                        height: 16,
                        width: 16,
                        background: "#9ca3af",
                        borderRadius: 6,
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        bottom: 6,
                        right: 6,
                        height: 8,
                        width: 40,
                        borderRadius: 10,
                        background:
                          theme.value.includes("violet")
                            ? "#8b5cf6"
                            : theme.value.includes("bloom")
                            ? "#fb7185"
                            : "#f97316",
                      }}
                    />

                    {/* Check */}
                    {active && (
                      <div
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          background: "#8b5cf6",
                          borderRadius: "50%",
                          padding: 2,
                        }}
                      >
                        <Check size={12} color="white" />
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                      fontSize: 12,
                      marginTop: 6,
                    }}
                  >
                    {theme.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}