import type { Metadata } from "next";
import Link from "next/link";
import { posts, formatDate } from "../data/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on machine learning systems and agents.",
};

export default function BlogPage() {
  return (
    <section className="container page">
      <h1 className="page-title">Blog</h1>
      {posts.length === 0 ? (
        <p className="blog-empty">Nothing here yet.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="post-row">
                <span className="label post-date">{formatDate(post.date)}</span>
                <span className="post-title">{post.title}</span>
                <span className="post-summary">{post.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
