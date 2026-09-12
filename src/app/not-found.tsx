import Link from "next/link";

export default function NotFound() {
  return (
    <main className="system-page">
      <p className="eyebrow">Out</p>
      <h1>This page missed the line.</h1>
      <p>The portfolio starts back at center court.</p>
      <Link href="/">Return home</Link>
    </main>
  );
}
