import Link from "next/link";
import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Anteena Eximp home">
      <Image
        src="/images/brand/anteena-eximp-logo.webp"
        alt=""
        width={54}
        height={42}
        className="brand__logo"
        priority
      />
      {compact ? null : (
        <span className="brand__wordmark">
          <strong>ANTEENA EXIMP</strong>
          <small>Import Export</small>
        </span>
      )}
    </Link>
  );
}
