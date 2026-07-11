import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ButtonLink({ href, children, variant = "primary", arrow = true }: { href: string; children: React.ReactNode; variant?: "primary" | "outline" | "gold"; arrow?: boolean }) {
  return <Link href={href} className={cn("button", `button--${variant}`)}>{children}{arrow ? <ArrowRight size={18} aria-hidden="true" /> : null}</Link>;
}
