// SanityArticlesMenuServer.tsx
import { createClient } from "next-sanity";
import Link from "next/link";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2023-01-01",
});

interface Article {
  chapter_id: string;
  slug: { current: string };
  title: string;
}

// Helper function to parse chapter_id for proper sorting
const parseChapterId = (id: string) => id.split('.').map(num => parseInt(num, 10));

async function getArticles() {
  try {
    const query = `*[_type == "articles"] {
      chapter_id,
      slug,
      title
    }`;
    const data: Article[] = await client.fetch(query);
    return data.sort((a, b) => {
      const numA = parseChapterId(a.chapter_id);
      const numB = parseChapterId(b.chapter_id);
      for (let i = 0; i < Math.max(numA.length, numB.length); i++) {
        const partA = numA[i] || 0;
        const partB = numB[i] || 0;
        if (partA !== partB) return partA - partB;
      }
      return 0;
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

interface MenuProps {
  activeSlug?: string;
}

export default async function SanityArticlesMenuServer({ activeSlug }: MenuProps) {
  const articles = await getArticles();

  if (articles.length === 0) {
    return <p>No articles found.</p>;
  }

  return (
    <nav className="w-full">
      <ul className="mt-4 flex flex-col gap-2 pl-4">
        {articles.map((article) => {
          const parts = article.chapter_id.split(".");
          const indent = { marginLeft: `${(parts.length - 1) * 20}px` };
          const isClickable = parts.length > 2;
          const isActive = activeSlug === article.slug.current;
          const activeClasses = isActive ? "bg-blue-200 font-bold" : "";

          return (
            <li key={article.slug.current} style={indent}>
              {isClickable ? (
                <Link
                  href={`/learn-mri/topic/${article.slug.current}`}
                  className={`hover:underline cursor-pointer ${activeClasses}`}
                >
                  <span className="font-mono mr-2">{article.chapter_id}</span>
                  {article.title}
                </Link>
              ) : (
                <span className={`font-bold ${activeClasses}`}>
                  <span className="font-mono mr-2">{article.chapter_id}</span>
                  {article.title}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
