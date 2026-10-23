import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts, getPost, formatDate } from "../../data/posts";
import { Body } from "../../components/Prose";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="container page post">
      <header className="post-header">
        <p className="label post-date">{formatDate(post.date)}</p>
        <h1 className="project-title">{post.title}</h1>
      </header>
      <div className="post-body project-section">
        {post.body.map((paragraph, i) => (
          <Body key={i} text={paragraph} />
        ))}
      </div>
    </article>
  );
}
