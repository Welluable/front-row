export type AdminCreds = { email: string; password: string };

const STORAGE_KEY = "adminCreds";

export function getStoredCreds(): AdminCreds | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "password" in parsed &&
      typeof (parsed as AdminCreds).password === "string"
    ) {
      const { email, password } = parsed as AdminCreds;
      return { email: email ?? "", password };
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredCreds(creds: AdminCreds): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
}

export function clearStoredCreds(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
