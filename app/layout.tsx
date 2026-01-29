import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const BRAND_NAME = "Front Row";

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: "Providing a way to create instant waitlist pages with a form and a call to action.",
};

const themeScript = `
(function() {
  const stored = localStorage.getItem('theme');
  const dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <header className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between px-4 py-4 md:px-6">
            <span className="text-lg font-semibold text-[var(--foreground)]">{BRAND_NAME}</span>
            <ThemeToggle />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
