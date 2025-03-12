import { createClient } from "next-sanity";
import Link from "next/link";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // Set to false for fresh data
  apiVersion: "2023-01-01",
});

interface Article {
  chapter_id: string;
  content_id: string;
  title: string;
}

// Function to convert "1.1.10" into [1, 1, 10] for proper sorting
const parseChapterId = (id: string) => id.split('.').map(num => parseInt(num, 10));

async function getArticles() {
  try {
    const query = `*[_type == "articles" && chapter_id match "2*"] {
      chapter_id,
      content_id,
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

export default async function SanityArticlesMRIProcedures() {
  const articles = await getArticles();

  if (articles.length === 0) {
    return <p>No articles found.</p>; // Prevents crashing on failure
  }

  return (
    <nav className="w-full">
      <ul className="mt-4 flex flex-col gap-2 pl-4">
        {articles.map(article => {
          const depth = article.chapter_id.split('.').length; // Depth based on number of levels
          const indent = { marginLeft: `${(depth - 1) * 20}px` }; // 0px indent for level 1, 20px for level 2, etc.
          return (
            <li key={article.content_id} style={indent}>
              <Link href={`/item/${article.content_id}`} className="hover:underline">
                <span className="font-mono mr-2">{article.chapter_id}</span>
                {article.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
