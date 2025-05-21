import { createClient } from "next-sanity"
import InteractiveMenu from "./InteractiveMenuClient"
import { db } from '@/utils/db'
import { articleProgress } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { withTimeout } from '@/utils/with-timeout'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2023-01-01",
})

interface Article {
  chapter_id: string;
  slug: { current: string };
  title: string;
}

const parseChapterId = (id: string) =>
  id.split(".").map((num) => parseInt(num, 10))

async function getArticles() {
  try {
    const query = `*[_type == "articles"] {
      chapter_id,
      slug,
      title
    }`
    const data: Article[] = await client.fetch(query)
    return data.sort((a, b) => {
      const numA = parseChapterId(a.chapter_id)
      const numB = parseChapterId(b.chapter_id)
      for (let i = 0; i < Math.max(numA.length, numB.length); i++) {
        const partA = numA[i] || 0
        const partB = numB[i] || 0
        if (partA !== partB) return partA - partB
      }
      return 0
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}

interface TreeNode extends Article {
  children: TreeNode[]
}

function buildTree(articles: Article[]): TreeNode[] {
  const tree: TreeNode[] = []
  const map: Record<string, TreeNode> = {}

  articles.forEach((article) => {
    const node: TreeNode = { ...article, children: [] }
    map[article.chapter_id] = node

    const parts = article.chapter_id.split(".")
    if (parts.length === 1) {
      tree.push(node)
    } else {
      const parentId = parts.slice(0, parts.length - 1).join(".")
      if (map[parentId]) {
        map[parentId].children.push(node)
      } else {
        tree.push(node)
      }
    }
  })
  return tree
}

interface MenuProps {
  activeSlug?: string;
}

export default async function SanityArticlesMenuServer({ activeSlug }: MenuProps) {
  const articles = await getArticles()

  if (articles.length === 0) {
    return <p>No articles found.</p>
  }

  const { userId } = await auth()
  let completedSlugs = new Set<string>()
  let progressPercentage: number | null = null

  if (userId) {
    try {
      const rows = await withTimeout(
        db
          .select({ article_slug: articleProgress.articleSlug })
          .from(articleProgress)
          .where(eq(articleProgress.userId, userId)),
        1000
      )

      completedSlugs = new Set(rows.map(r => r.article_slug))
      const completedCount = articles.filter(a => completedSlugs.has(a.slug.current)).length
      progressPercentage = Math.round((completedCount / articles.length) * 100)
    } catch (err) {
      console.error("Failed to fetch user progress:", err)
      progressPercentage = null
    }
  }

  const activeArticle = articles.find(article => article.slug.current === activeSlug)
  const tree = buildTree(articles)

  return (
    <nav className="w-full border-gray-200 border bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-gray-200 border-b">
        <h2 className="text-[1.3rem] font-bold">Learn MRI</h2>
        {userId && progressPercentage !== null && (
          <span className="text-sm text-gray-600">{progressPercentage}% completed</span>
        )}
      </div>

      <ul className="flex flex-col">
        <InteractiveMenu
          tree={tree}
          activeArticle={activeArticle}
          activeSlug={activeSlug}
          completedSlugs={userId ? Array.from(completedSlugs) : []}
        />
      </ul>
    </nav>
  )
}
