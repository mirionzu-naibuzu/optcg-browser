"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useTheme } from "next-themes";

interface Props {
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ onClose, initialMode = "login" }: Props) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [suggestSignup, setSuggestSignup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const supabase = createClient();

  const isDark = mounted && theme === "dark";

  // Theme colors
  const colors = {
    bg: {
      primary: isDark ? "#111827" : "#ffffff",
      secondary: isDark ? "#1f2937" : "#f3f4f6",
      tertiary: isDark ? "#374151" : "#e5e7eb",
    },
    text: {
      primary: isDark ? "#f3f4f6" : "#111827",
      secondary: isDark ? "#9ca3af" : "#6b7280",
      tertiary: isDark ? "#6b7280" : "#9ca3af",
    },
    border: isDark ? "#374151" : "#e5e7eb",
    error: "#ef4444",
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuggestSignup(false);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) {
        setError(error.message);
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("This email is already registered.");
        setSuggestSignup(true);
      } else {
        setStep("verify");
      }

    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error) {
        onClose();
      } else if (error.message.includes("Email not confirmed")) {
        setError("Please confirm your email first. Check your inbox!");
      } else if (error.message.includes("Invalid login credentials")) {
        const { data } = await supabase.auth.signUp({
          email,
          password: crypto.randomUUID(),
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });

        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError("Incorrect password. Please try again.");
        } else {
          setError("No account found with this email.");
          setSuggestSignup(true);
        }
      } else {
        setError(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <div
      suppressHydrationWarning
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
      onClick={onClose}
    >
      <div
        style={{
          background: colors.bg.primary,
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 400,
          boxShadow: isDark
            ? "0 25px 50px rgba(0,0,0,0.5)"
            : "0 25px 50px rgba(0,0,0,0.2)",
          border: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 20, color: colors.text.primary }}>
              {step === "verify" ? "Verify your email" : mode === "login" ? "Welcome back" : "Create account"}
            </div>
            <div style={{ fontSize: 13, color: colors.text.secondary, marginTop: 2 }}>
              {step === "verify" ? "One last step!" : mode === "login" ? "Sign in to your account" : "Sign up for free"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X style={{ width: 20, height: 20, color: colors.text.secondary }} />
          </button>
        </div>

        {step === "verify" ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: colors.text.primary, marginBottom: 8 }}>
              Check your inbox!
            </div>
            <div style={{ fontSize: 13, color: colors.text.secondary, marginBottom: 24, lineHeight: 1.6 }}>
              We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account then come back to sign in.
            </div>
            <button
              onClick={() => { setStep("form"); setMode("login"); setError(""); }}
              style={{
                width: "100%",
                background: isDark ? "#ffffff" : "#111827",
                color: isDark ? "#111827" : "white",
                border: "none",
                borderRadius: 12,
                padding: "11px 0",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Go to Sign in
            </button>
          </div>
        ) : (
          <div>
            {/* Google — only on signup */}
            {mode === "signup" && (
              <>
                <button
                  onClick={handleGoogle}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    border: `1.5px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: "10px 0",
                    fontSize: 14,
                    fontWeight: 600,
                    color: colors.text.primary,
                    background: colors.bg.secondary,
                    cursor: "pointer",
                    marginBottom: 16,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark ? "#374151" : "#e5e7eb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.bg.secondary;
                  }}
                >
                  <img src="https://www.google.com/favicon.ico" style={{ width: 16, height: 16 }} />
                  Continue with Google
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1, height: 1, background: colors.border }} />
                  <span style={{ fontSize: 12, color: colors.text.secondary }}>or</span>
                  <div style={{ flex: 1, height: 1, background: colors.border }} />
                </div>
              </>
            )}

            {/* Inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: 14,
                  border: `1.5px solid ${colors.border}`,
                  borderRadius: 12,
                  outline: "none",
                  boxSizing: "border-box",
                  background: colors.bg.secondary,
                  color: colors.text.primary,
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = isDark ? "#9ca3af" : "#111827";
                  e.currentTarget.style.background = colors.bg.primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.background = colors.bg.secondary;
                }}
              />
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    paddingRight: 40,
                    fontSize: 14,
                    border: `1.5px solid ${colors.border}`,
                    borderRadius: 12,
                    outline: "none",
                    boxSizing: "border-box",
                    background: colors.bg.secondary,
                    color: colors.text.primary,
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = isDark ? "#9ca3af" : "#111827";
                    e.currentTarget.style.background = colors.bg.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.background = colors.bg.secondary;
                  }}
                />
                <button
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: colors.text.secondary,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && <div style={{ fontSize: 12, color: colors.error, marginBottom: 8 }}>{error}</div>}

            {/* Suggestions */}
            {suggestSignup && (
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {mode === "signup" ? (
                  <button
                    onClick={() => { setMode("login"); setError(""); setSuggestSignup(false); }}
                    style={{
                      flex: 1,
                      border: `1.5px solid ${colors.text.primary}`,
                      background: "transparent",
                      color: colors.text.primary,
                      borderRadius: 12,
                      padding: "9px 0",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.bg.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Sign in instead →
                  </button>
                ) : (
                  <button
                    onClick={() => { setMode("signup"); setEmail(""); setPassword(""); setError(""); setSuggestSignup(false); }}
                    style={{
                      flex: 1,
                      border: `1.5px solid ${colors.text.primary}`,
                      background: "transparent",
                      color: colors.text.primary,
                      borderRadius: 12,
                      padding: "9px 0",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.bg.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Create account
                  </button>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              style={{
                width: "100%",
                background: isDark ? "#ffffff" : "#111827",
                color: isDark ? "#111827" : "white",
                border: "none",
                borderRadius: 12,
                padding: "11px 0",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading || !email || !password ? "not-allowed" : "pointer",
                marginBottom: 16,
                opacity: loading || !email || !password ? 0.4 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Loading..." : mode === "login" ? "Sign in" : "Sign up"}
            </button>

            {/* Toggle */}
            <div style={{ textAlign: "center", fontSize: 13, color: colors.text.secondary }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuggestSignup(false); }}
                style={{
                  background: "none",
                  border: "none",
                  fontWeight: 700,
                  color: colors.text.primary,
                  cursor: "pointer",
                }}
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}