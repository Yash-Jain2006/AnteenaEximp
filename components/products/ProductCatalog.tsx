"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/lib/cms/types";
import { PRODUCT_CATEGORIES } from "@/lib/site";

export function ProductCatalog({ products, initialCategory = "All" }: { products: Product[]; initialCategory?: string }) {
  const categories = useMemo(() => Array.from(new Set([...PRODUCT_CATEGORIES, ...products.map((product) => product.category)])), [products]);
  const [category, setCategory] = useState(initialCategory || "All");
  const [query, setQuery] = useState("");
  const activeCategory = category === "All" || categories.includes(category) ? category : "All";
  const filtered = useMemo(() => products.filter((item) => (activeCategory === "All" || item.category === activeCategory) && `${item.name} ${item.category} ${item.origin}`.toLowerCase().includes(query.toLowerCase())), [activeCategory, products, query]);

  return (
    <div>
      <div className="catalog-toolbar">
        <div className="category-tabs" role="tablist" aria-label="Product categories">
          {["All", ...categories].map((item) => <button key={item} className={activeCategory === item ? "is-active" : undefined} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <label className="catalog-search"><Search size={17} /><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" /></label>
      </div>
      <div className="product-grid">{filtered.map((item) => <ProductCard key={item.id} product={item} />)}</div>
      {!filtered.length ? <div className="empty-state"><h2>No products found</h2><p>Try another category or search term.</p></div> : null}
    </div>
  );
}
