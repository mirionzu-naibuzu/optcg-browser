"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type {User as SupabaseUser} from "@supabase/supabase-js";
import { Menu, PanelLeft, User, LogIn, Bookmark, Palette, MessageSquare, LogOut } from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function Sidebar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { theme, setTheme } = useTheme();
  const [showAppearance, setShowAppearance] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const isDark = mounted && theme === "dark";

  const colors = {
    bg: {
      primary: isDark ? "#111827" : "#ffffff",
      secondary: isDark ? "#1f2937" : "#f9fafb",
    },
    text: {
      primary: isDark ? "#f3f4f6" : "#111827",
      secondary: isDark ? "#9ca3af" : "#6b7280",
    },
    border: isDark ? "#374151" : "#e5e7eb",
    hover: isDark ? "#374151" : "#f3f4f6",
  };

  const menuItems = [
    { icon: User, label: "Sign In", action: () => { setAuthMode("login"); setShowAuth(true); }, show: !user },
    { icon: Bookmark, label: "Binder", action: () => router.push("/") },
    { icon: Menu, label: "DON!!", action: () => router.push("/don"), show: true },
  ];

  const bottomItems = [
    { icon: Palette, label: "Appearance", action: () => setShowAppearance(prev => !prev) },
    { icon: MessageSquare, label: "Feedback", action: () => {} },
  ];

  const handleSignOutClick = () => {
    setShowSignOutConfirm(true);
  };

  const handleConfirmSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setExpanded(false);
    setShowSignOutConfirm(false);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        suppressHydrationWarning
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: expanded ? 280 : 70,
          background: colors.bg.secondary,
          borderRight: `1px solid ${colors.border}`,
          display: "flex",
          flexDirection: "column",
          zIndex: 40,
          transition: "width 0.3s ease",
          overflow: "hidden",
        }}
      >
        {/* Header with toggle button */}
        <div
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: expanded ? "space-between" : "center",
            padding: "16px 12px",
            borderBottom: `1px solid ${colors.border}`,
        }}
        >
        {expanded && (
            <div
            style={{
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: colors.text.primary,
            }}
            >
            OP<span style={{ color: "#ef4444" }}>TCG</span>
            </div>
        )}

        <button
            onClick={() => setExpanded(!expanded)}
            style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 5.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.text.primary,
            }}
        >
            <PanelLeft
            size={20}
            style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
            }}
            />
        </button>
        </div>

        {/* User Profile Section */}
        {user && (
          <div
            style={{
              padding: "16px 12px",
              borderBottom: `1px solid ${colors.border}`,
              display: "flex",
              flexDirection: "column",
              alignItems: expanded ? "flex-start" : "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: isDark ? "#f3f4f6" : "#111827",
                color: isDark ? "#111827" : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {user.email?.[0].toUpperCase()}
            </div>
            {expanded && (
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: colors.text.primary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.user_metadata?.full_name ?? user.email?.split("@")[0]}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: colors.text.secondary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.email}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: "12px 0", display: "flex", flexDirection: "column" }}>
          {menuItems.map((item) => {
            if (item.show === false) return null;
            
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                title={item.label}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: colors.text.primary,
                  transition: "all 0.2s",
                  justifyContent: expanded ? "flex-start" : "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                <Icon size={20} />
                {expanded && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div style={{ borderTop: `1px solid ${colors.border}`, padding: "12px 0", display: "flex", flexDirection: "column" }}>
          {/* Bottom Menu Items */}
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                title={item.label}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: colors.text.primary,
                  transition: "all 0.2s",
                  justifyContent: expanded ? "flex-start" : "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                <Icon size={20} />
                {expanded && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
              </button>
            );
          })}

          {/* Sign Out Button */}
          {user && (
            <button
              onClick={handleSignOutClick}
              title="Sign Out"
              style={{
                width: "100%",
                padding: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#ef4444",
                transition: "all 0.2s",
                justifyContent: expanded ? "flex-start" : "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(239, 68, 68, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              <LogOut size={20} />
              {expanded && <span style={{ fontSize: 14, fontWeight: 500 }}>Sign Out</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Auth Modal */}
      {showAuth && <AuthModal initialMode={authMode} onClose={() => setShowAuth(false)} />}

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowSignOutConfirm(false)}
        >
          <div
            style={{
              background: colors.bg.primary,
              borderRadius: 16,
              padding: 32,
              width: "100%",
              maxWidth: 320,
              boxShadow: isDark ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.2)",
              border: `1px solid ${colors.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 900, fontSize: 20, color: colors.text.primary, marginBottom: 8 }}>
                Sign Out?
              </div>
              <div style={{ fontSize: 14, color: colors.text.secondary }}>
                Are you sure you want to sign out of your account?
              </div>
            </div>
 
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowSignOutConfirm(false)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  fontSize: 14,
                  fontWeight: 600,
                  border: `1.5px solid ${colors.border}`,
                  background: "transparent",
                  color: colors.text.primary,
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  fontSize: 14,
                  fontWeight: 600,
                  border: "none",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}  

      {/* Overlay when sidebar is expanded on mobile */}
      {expanded && window.innerWidth < 768 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.3)",
            zIndex: 30,
          }}
          onClick={() => setExpanded(false)}
        />
      )}
      {showAppearance && (
  <div
    onClick={() => setShowAppearance(false)}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 50,
    }}
  >
    {/* Panel */}
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: expanded ? 260 : 90,
        bottom: 100,
        width: 320,
        background: colors.bg.primary,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: 16,
        boxShadow: isDark
          ? "0 20px 40px rgba(0,0,0,0.6)"
          : "0 20px 40px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 12, color: colors.text.primary }}>
        Appearance
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { name: "Light", value: "light" },
          { name: "Dark", value: "dark" },
          { name: "Bloom", value: "bloom" },
          { name: "Bloom Dark", value: "bloom-dark" },
          { name: "Luna Violet", value: "luna-violet" },
          { name: "Luna Dark", value: "luna-dark" },
        ].map((t) => {
          const isActive = theme === t.value;

          return (
            <div
              key={t.value}
              onClick={() => {
                setTheme(t.value);
              }}
              style={{
                borderRadius: 12,
                padding: 8,
                cursor: "pointer",
                border: isActive ? "2px solid #8b5cf6" : `1px solid ${colors.border}`,
                transition: "all 0.2s",
              }}
            >
              {/* Preview */}
              <div
                style={{
                  height: 60,
                  borderRadius: 10,
                  background: t.value.includes("dark") ? "#1f2937" : "#f3f4f6",
                  position: "relative",
                  padding: 8,
                }}
              >
                <div
                  style={{
                    height: 8,
                    width: "60%",
                    borderRadius: 4,
                    background: "#9ca3af",
                    marginBottom: 8,
                  }}
                />

                <div
                  style={{
                    height: 18,
                    width: 18,
                    borderRadius: 6,
                    background: "#6b7280",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    height: 8,
                    width: 40,
                    borderRadius: 10,
                    background:
                      t.value.includes("violet")
                        ? "#8b5cf6"
                        : t.value.includes("bloom")
                        ? "#ec4899"
                        : "#f97316",
                  }}
                />

                {/* Selected */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      background: "#8b5cf6",
                      borderRadius: "50%",
                      padding: 3,
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>

              <div
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 6,
                  color: colors.text.secondary,
                }}
              >
                {t.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}
    </>
  );
}