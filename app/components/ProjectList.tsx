import Link from "next/link";
import type { Project } from "../data/projects";

export default function ProjectList({ items }: { items: Project[] }) {
  return (
    <ul className="work-list">
      {items.map((p) => (
        <li key={p.slug}>
          <Link href={`/projects/${p.slug}`} className="work-row">
            <div className="work-main">
              <h3 className="work-title">{p.title}</h3>
              <p className="work-summary">{p.summary}</p>
            </div>
            <span className="label work-tag">{p.tag}</span>
            <span className="work-arrow" aria-hidden="true">
              &rarr;
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
