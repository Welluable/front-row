import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-center bg-[var(--background)] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)_0%,transparent_100%)]">
      <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-4xl text-center">
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
    </main>
  );
}
