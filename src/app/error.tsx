"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="system-page">
      <p className="eyebrow">Match interrupted</p>
      <h1>Something went wrong.</h1>
      <p>The portfolio is still here. Try returning to the opening point.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
