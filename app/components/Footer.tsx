import { site } from "../data/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <p className="label">
          {site.name} · {site.location}
        </p>
        <nav className="site-footer-links" aria-label="Social">
          <a href={site.github} target="_blank" rel="noreferrer" className="label">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" className="label">
            LinkedIn
          </a>
          <a href={`mailto:${site.email}`} className="label">
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
