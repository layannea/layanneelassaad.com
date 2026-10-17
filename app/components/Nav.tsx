"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container site-header-inner">
        <Link href="/" className="site-brand">
          Layanne El Assaad
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <Link href="/#projects">Projects</Link>
          <Link href="/#contact">Contact</Link>
          <a href="https://github.com/layannea" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}