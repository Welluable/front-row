import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-center bg-[var(--background)] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)_0%,transparent_100%)]">
      <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl mb-16">
            Your purpose, cause, or belief -{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
              Why does your company exist
            </span>{" "}
            beyond making money?
          </h1>
          <p className="mx-auto max-w-2xl mt-6 text-lg text-[var(--muted-foreground)] md:text-xl">
            Your unique value proposition - How do you deliver on your why? What makes you different?
          </p>
          <p className="mx-auto max-w-3xl mt-8 text-[var(--foreground)]/90">
            Your product/service - What do you actually make/offer? Be specific and tangible. Be the first to know when we launch.
          </p>
          <div className="mt-12">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </main>
  );
}
