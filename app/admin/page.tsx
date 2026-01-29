"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredCreds, setStoredCreds, type AdminCreds } from "./auth";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (getStoredCreds()) router.replace("/admin/list");
  }, [router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      setError("Password is required");
      return;
    }
    setLoading(true);
    try {
      const authHeader =
        trimmedEmail
          ? `Bearer ${trimmedEmail}:${trimmedPassword}`
          : `Bearer ${trimmedPassword}`;
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const creds: AdminCreds = {
          email: trimmedEmail,
          password: trimmedPassword,
        };
        setStoredCreds(creds);
        router.push("/admin/list");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[var(--foreground)] text-center mb-6">
          Admin Login
        </h1>
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
        >
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] mb-3"
            placeholder="admin@example.com"
            autoComplete="email"
            disabled={loading}
          />
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Enter admin password"
            autoComplete="current-password"
            disabled={loading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-[var(--primary)] px-4 py-2 font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Checking…" : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}
