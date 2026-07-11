import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Product } from "@/lib/cms/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-card__image" aria-label={`View ${product.name}`}>
        <Image src={product.image} alt={`${product.category} arranged for export`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
        <span>{product.category}</span>
      </Link>
      <div className="product-card__body">
        <div className="product-card__origin"><MapPin size={14} /> {product.origin}</div>
        <h2><Link href={`/products/${product.slug}`}>{product.name}</Link></h2>
        <p>{product.description}</p>
        <div className="product-card__grades">{product.grades.slice(0, 3).map((grade) => <span key={grade}>{grade}</span>)}</div>
        <div className="product-card__footer"><small>MOQ: {product.minimumOrder}</small><Link href={`/products/${product.slug}`}>View specifications <ArrowUpRight size={16} /></Link></div>
      </div>
    </article>
  );
}
