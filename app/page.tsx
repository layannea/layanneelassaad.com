import Image from "next/image";
import ProjectList from "./components/ProjectList";
import { projects } from "./data/projects";
import { site } from "./data/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero container">
        <div className="hero-copy">
          <p className="label hero-meta">
            <span>{site.role}</span>
            <span>{site.location}</span>
          </p>
          <h1 className="hero-title">{site.name}</h1>
          <p className="lead hero-lead">{site.intro}</p>
          <p className="hero-now">
            {site.current.lead}{" "}
            <a href={site.current.url} target="_blank" rel="noreferrer" className="link">
              {site.current.name}
            </a>{" "}
            {site.current.text}{" "}
            <a href={`mailto:${site.email}`} className="link">
              {site.current.cta}
            </a>
            .
          </p>
        </div>
        <div className="hero-portrait">
          <Image
            src="/portrait.jpg"
            alt={`Portrait of ${site.name}`}
            fill
            sizes="(max-width: 760px) 100vw, 360px"
            priority
          />
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="container section">
        <div className="section-head">
          <h2>Projects</h2>
        </div>
        <ProjectList items={projects} />
      </section>

      {/* Contact */}
      <section id="contact" className="container section">
        <h2>Get in touch</h2>
        <div className="contact-links">
          <a href={`mailto:${site.email}`} className="contact-email">
            {site.email}
          </a>
          <a href={site.github} target="_blank" rel="noreferrer" className="link">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" className="link">
            LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}
