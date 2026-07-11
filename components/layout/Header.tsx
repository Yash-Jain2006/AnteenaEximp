"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand/Logo";
import { NAV_ITEMS } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner container-wide">
        <BrandMark />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? "is-active" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="site-header__actions">
          <Link href="/admin/login" className="admin-link">
            <UserRound size={17} aria-hidden="true" /> Admin
          </Link>
          <Link href="/get-a-quote" className="button button--primary button--small">
            Get a Quote
          </Link>
          <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
          <Link href="/get-a-quote" onClick={() => setOpen(false)}>Get a Quote</Link>
          <Link href="/admin/login" onClick={() => setOpen(false)}>Admin Login</Link>
        </nav>
      ) : null}
    </header>
  );
}
