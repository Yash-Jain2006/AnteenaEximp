import type { ReactNode } from "react";

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div className={className ? `reveal ${className}` : "reveal"} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
