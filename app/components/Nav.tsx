"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "../data/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "-1px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} className="site-header-sentinel" aria-hidden="true" />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container site-header-inner">
          <Link href="/" className="site-brand">
            {site.name}
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <Link href="/#projects" className="label">
              Projects
            </Link>
            <a href={site.github} target="_blank" rel="noreferrer" className="label">
              GitHub
            </a>
            <a href={`mailto:${site.email}`} className="label">
              Email
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
