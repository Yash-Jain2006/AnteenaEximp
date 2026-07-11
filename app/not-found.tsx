import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Not found</span></div>
        <h1>Page not found.</h1>
        <p>The page you requested may have moved or may not exist.</p>
        <div className="button-row" style={{ marginTop: 28 }}>
          <Link href="/" className="button button--primary">Go home</Link>
          <Link href="/products" className="button button--outline">View products</Link>
        </div>
      </div>
    </section>
  );
}
