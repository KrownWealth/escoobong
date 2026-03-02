import { NextResponse } from "next/server";

export interface Article {
  tag: string;
  title: string;
  image: string | null;
  href: string;
  date: string;
  source: "medium" | "substack";
  excerpt?: string;
}

function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match ? match[1] : null;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

async function fetchMediumArticles(username: string): Promise<Article[]> {
  try {
    const res = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}&count=10`,
      { next: { revalidate: 3600 } }, // ISR: re-fetch at most once per hour
    );
    if (!res.ok) throw new Error(`Medium RSS fetch failed: ${res.status}`);
    const data = await res.json();
    if (data.status !== "ok") throw new Error("rss2json returned error status");

    return (data.items ?? []).map(
      (item: any): Article => ({
        tag: item.categories?.[0] ?? "Engineering",
        title: item.title,
        image: item.thumbnail || extractFirstImage(item.content ?? "") || null,
        href: item.link,
        date: formatDate(item.pubDate),
        source: "medium",
        excerpt: stripHtml(item.description ?? "").slice(0, 120) + "…",
      }),
    );
  } catch (e) {
    console.error("[Articles API] Medium fetch error:", e);
    return [];
  }
}

async function fetchSubstackArticles(subdomain: string): Promise<Article[]> {
  try {
    const res = await fetch(
      `https://${subdomain}.substack.com/api/v1/posts?limit=10`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`Substack API fetch failed: ${res.status}`);
    const posts: any[] = await res.json();

    return posts.map(
      (post): Article => ({
        tag: post.section_name ?? "Essay",
        title: post.title,
        image: post.cover_image ?? post.social_image ?? null,
        href: post.canonical_url,
        date: formatDate(post.post_date),
        source: "substack",
        excerpt: post.subtitle ?? "",
      }),
    );
  } catch (e) {
    console.error("[Articles API] Substack fetch error:", e);
    return [];
  }
}

export async function GET() {
  const mediumUsername = process.env.MEDIUM_USERNAME ?? "escobyte";
  // Set SUBSTACK_SUBDOMAIN in .env.local to enable Substack (e.g. "escobyte")
  const substackSubdomain = process.env.SUBSTACK_SUBDOMAIN ?? "";

  const [mediumArticles, substackArticles] = await Promise.all([
    fetchMediumArticles(mediumUsername),
    substackSubdomain
      ? fetchSubstackArticles(substackSubdomain)
      : Promise.resolve([]),
  ]);

  // Merge, deduplicate by title, sort newest first
  const seen = new Set<string>();
  const all: Article[] = [...mediumArticles, ...substackArticles]
    .filter((a) => {
      if (seen.has(a.title)) return false;
      seen.add(a.title);
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json(all);
}
