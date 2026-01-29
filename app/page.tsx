import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)_0%,transparent_50%)] opacity-30" />
        <div className="relative mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
            The future of{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
              your product
            </span>
          </h1>
          <p className="mx-auto mt-6 text-lg text-[var(--muted-foreground)] md:text-xl">
            Get early access. Join thousands of others who are already waiting.
          </p>
          <p className="mx-auto mt-8 text-[var(--foreground)]/90">
            We&apos;re building the next generation of tools that help you get more done with less friction—simple setup, powerful results, and a team that actually listens. Be the first to know when we launch.
          </p>
          <div className="mt-12">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-6 py-8 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">© {new Date().getFullYear()} Your Product</p>
      </footer>
    </main>
  );
}
