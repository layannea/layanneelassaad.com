import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, type Figure } from "../../data/projects";
import { Body } from "../../components/Prose";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

function FigureBlock({ figure }: { figure: Figure }) {
  return (
    <figure className="project-figure">
      {figure.label && <p className="label project-figure-label">{figure.label}</p>}
      {figure.kind === "video" ? (
        <video src={figure.src} controls playsInline preload="metadata" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={figure.src} alt={figure.alt} loading="lazy" />
      )}
      {figure.caption && <figcaption className="label">{figure.caption}</figcaption>}
    </figure>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  const pullAfter = project.pull ? Math.min(project.pullAfter ?? 1, project.sections.length - 1) : -1;

  return (
    <article className="container page">
      <header className="project-header">
        <h1 className="project-title">{project.title}</h1>
        <p className="lead project-lead">{project.lead}</p>
      </header>

      <div className="project-layout">
        <aside className="project-aside">
          <dl className="project-facts">
            <div>
              <dt className="label">Area</dt>
              <dd>{project.tag}</dd>
            </div>
            {project.collaborators && (
              <div>
                <dt className="label">With</dt>
                <dd>{project.collaborators}</dd>
              </div>
            )}
            <div>
              <dt className="label">Stack</dt>
              <dd>{project.stack.join(", ")}</dd>
            </div>
            {(project.github || project.site || project.paper) && (
              <div>
                <dt className="label">Links</dt>
                <dd className="project-links">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="project-link">
                      GitHub <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {project.paper && (
                    <a href={project.paper} target="_blank" rel="noreferrer" className="project-link">
                      Paper <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {project.site && (
                    <a href={project.site} target="_blank" rel="noreferrer" className="project-link">
                      {project.site.replace(/^https?:\/\//, "")} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </aside>

        <div className="project-body">
          {project.sections.map((section, i) => (
            <section key={section.heading} className="project-section">
              <h2 className="label project-section-title">{section.heading}</h2>
              {section.body.map((paragraph, j) => (
                <Body key={j} text={paragraph} />
              ))}
              {section.figure && <FigureBlock figure={section.figure} />}
              {section.after?.map((paragraph, j) => (
                <Body key={`a${j}`} text={paragraph} />
              ))}
              {section.note && <p className="project-note">{section.note}</p>}
              {i === pullAfter && project.pull && <p className="project-pull">{project.pull}</p>}
            </section>
          ))}
        </div>
      </div>

      <nav className="project-nav" aria-label="More projects">
        {prev ? (
          <Link href={`/projects/${prev.slug}`} className="project-nav-link">
            <span className="label">Previous</span>
            <span>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/projects/${next.slug}`} className="project-nav-link is-next">
            <span className="label">Next</span>
            <span>{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
