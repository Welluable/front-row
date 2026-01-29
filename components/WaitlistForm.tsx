"use client";

import { useState, useRef } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const loadedAt = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email.");
      setStatus("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          _hp: honeypot,
          _t: Date.now(),
          _loadedAt: loadedAt.current,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setMessage("You're on the list! We'll be in touch.");
      setStatus("success");
      setEmail("");
    } catch {
      setMessage("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="animate-fadeInZoom">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-br from-[var(--primary)]/20 via-[var(--secondary)]/10 to-transparent p-8 text-center shadow-2xl backdrop-blur-sm">
          {/* Animated glow effect */}
          <div className="absolute -inset-1 -z-10 animate-pulse rounded-2xl bg-gradient-to-r from-[var(--primary)]/30 to-[var(--secondary)]/30 blur-2xl"></div>
          
          {/* Success icon with animation */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-lg shadow-[var(--primary)]/50">
            <svg
              className="h-8 w-8 text-white animate-checkmark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          {/* Message with staggered animation */}
          <h3 className="mb-2 text-2xl font-bold text-[var(--foreground)] animate-slideUp" style={{ animationDelay: '0.1s' }}>
            You're on the list!
          </h3>
          <p className="text-base text-[var(--muted-foreground)] animate-slideUp" style={{ animationDelay: '0.2s' }}>
            We'll be in touch soon. Check your inbox for updates.
          </p>
          
          {/* Decorative sparkles with bounce animation */}
          <div className="mt-6 flex justify-center gap-2 opacity-0 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <span className="text-2xl animate-bounce" style={{ animationDelay: '0ms' }}>✨</span>
            <span className="text-2xl animate-bounce" style={{ animationDelay: '150ms' }}>🎉</span>
            <span className="text-2xl animate-bounce" style={{ animationDelay: '300ms' }}>✨</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      {/* Honeypot - hidden from users, bots fill it */}
      <div className="absolute -left-[9999px] top-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={status === "loading"}
          className="min-w-0 flex-1 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50"
          autoComplete="email"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Joining…" : "Join"}
        </button>
      </div>

      {message && status === "error" && (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
