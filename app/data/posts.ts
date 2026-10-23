export type Post = {
  slug: string;
  title: string;
  date: string; // ISO, e.g. "2026-11-02"
  summary: string;
  body: string[]; // paragraphs; "- a\n- b" renders a list; **text** renders emphasis
};

export const posts: Post[] = [];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
