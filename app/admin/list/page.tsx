"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getStoredCreds, clearStoredCreds, type AdminCreds } from "../auth";

type WaitlistEntry = {
  id: string;
  email: string;
  createdAt: string;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminListPage() {
  const router = useRouter();
  const [creds, setCreds] = useState<AdminCreds | null>(null);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const authHeader =
    creds
      ? {
          Authorization: creds.email
            ? `Bearer ${creds.email}:${creds.password}`
            : `Bearer ${creds.password}`,
        }
      : null;

  const logout = useCallback(() => {
    clearStoredCreds();
    router.replace("/admin");
  }, [router]);

  const fetchUsers = useCallback(async () => {
    if (!creds) return;
    const header = {
      Authorization: creds.email
        ? `Bearer ${creds.email}:${creds.password}`
        : `Bearer ${creds.password}`,
    };
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { headers: header });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEntries(data);
    } catch {
      setToast({ type: "error", message: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  }, [creds, logout]);

  useEffect(() => {
    const stored = getStoredCreds();
    if (!stored) {
      router.replace("/admin");
      return;
    }
    setCreds(stored);
  }, [router]);

  useEffect(() => {
    if (creds) fetchUsers();
  }, [creds, fetchUsers]);

  const filtered =
    search.trim()
      ? entries.filter((e) =>
          e.email.toLowerCase().includes(search.trim().toLowerCase())
        )
      : entries;

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this waitlist entry?") || !authHeader) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ id }),
      });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast("error", data.error ?? "Delete failed");
        return;
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
      showToast("success", "Entry removed");
    } catch {
      showToast("error", "Network error");
    } finally {
      setDeletingId(null);
    }
  }

  function exportCsv() {
    const header = "Email,Signup Date";
    const rows = filtered.map((e) => {
      const escaped =
        e.email.includes(",") || e.email.includes('"')
          ? `"${e.email.replace(/"/g, '""')}"`
          : e.email;
      return `${escaped},${formatDate(e.createdAt)}`;
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!creds) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <span className="animate-pulse text-[var(--muted-foreground)]">
          Loading…
        </span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Waitlist Admin
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              {loading
                ? "…"
                : `${entries.length} signup${entries.length === 1 ? "" : "s"}`}
              {creds.email && (
                <span className="ml-2">· {creds.email}</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Log out
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email…"
            className="flex-1 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <button
            type="button"
            onClick={exportCsv}
            disabled={loading || filtered.length === 0}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>

        {toast && (
          <div
            role="status"
            className={`mb-4 rounded-lg px-4 py-2 text-sm ${
              toast.type === "success"
                ? "bg-green-500/20 text-green-700 dark:text-green-400"
                : "bg-red-500/20 text-red-700 dark:text-red-400"
            }`}
          >
            {toast.message}
          </div>
        )}

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-[var(--muted-foreground)]">
              <span className="animate-pulse">Loading…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-[var(--muted-foreground)]">
              {entries.length === 0
                ? "No waitlist entries yet."
                : "No emails match your search."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background)]/50">
                    <th className="px-4 py-3 text-sm font-medium text-[var(--foreground)]">
                      Email
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-[var(--foreground)]">
                      Signup Date
                    </th>
                    <th className="w-20 px-4 py-3" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-[var(--border)] last:border-0"
                    >
                      <td className="px-4 py-3 text-[var(--foreground)]">
                        {entry.email}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)] text-sm">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          disabled={deletingId === entry.id}
                          className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                        >
                          {deletingId === entry.id ? "Removing…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
