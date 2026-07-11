"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Error</span></div>
        <h1>Something went wrong.</h1>
        <p>Please try again. If the issue continues, contact Anteena Eximp directly by email or WhatsApp.</p>
        <div className="button-row" style={{ marginTop: 28 }}>
          <button className="button button--primary" onClick={reset}>Try again</button>
          <Link href="/contact" className="button button--outline">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
