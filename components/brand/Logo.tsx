import Link from "next/link";
import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Anteena Eximp home">
      <Image
        src="/images/brand/anteena-eximp-logo.webp"
        alt="Anteena Eximp import export company logo"
        width={54}
        height={42}
        className="brand__logo"
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
