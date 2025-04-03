import { createClient } from "next-sanity";
import Link from "next/link";
import InteractiveMenu from "./InteractiveMenuClient"; // Direct import of client component

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

const parseChapterId = (id: string) =>
  id.split(".").map((num) => parseInt(num, 10));

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

interface TreeNode extends Article {
  children: TreeNode[];
}

function buildTree(articles: Article[]): TreeNode[] {
  const tree: TreeNode[] = [];
  const map: Record<string, TreeNode> = {};

  articles.forEach((article) => {
    const node: TreeNode = { ...article, children: [] };
    map[article.chapter_id] = node;

    const parts = article.chapter_id.split(".");
    if (parts.length === 1) {
      tree.push(node);
    } else {
      const parentId = parts.slice(0, parts.length - 1).join(".");
      if (map[parentId]) {
        map[parentId].children.push(node);
      } else {
        tree.push(node);
      }
    }
  });
  return tree;
}

interface MenuProps {
  activeSlug?: string;
}

export default async function SanityArticlesMenuServer({ activeSlug }: MenuProps) {
  const articles = await getArticles();

  if (articles.length === 0) {
    return <p>No articles found.</p>;
  }

  const activeArticle = articles.find(
    (article) => article.slug.current === activeSlug
  );

  const tree = buildTree(articles);

  // Example "progress" or "completed" percentage - you can replace this
  // with real data if you have it in your documents or compute it.
  const progressPercentage = 54;

  return (
    <nav className="w-full border-gray-200 border bg-white">
      {/* Header section for the menu (title, progress, etc.) */}
      <div className="flex items-center justify-between px-4 py-3 border-gray-200 border-b">
        <h2 className="text-[1.3rem] font-bold">Learn MRI</h2>
        <span className="text-sm text-gray-600">{progressPercentage}% completed</span>
      </div>

      <ul className="flex flex-col">
        <InteractiveMenu tree={tree} activeArticle={activeArticle} activeSlug={activeSlug} />
      </ul>
    </nav>
  );
}
