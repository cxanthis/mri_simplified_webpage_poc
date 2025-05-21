import { auth } from '@clerk/nextjs/server'
import { db } from '@/utils/db'
import { articleProgress } from '@/utils/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) return new Response('Missing slug', { status: 400 })

  try {
    const rows = await db
      .select()
      .from(articleProgress)
      .where(
        and(
          eq(articleProgress.userId, userId),
          eq(articleProgress.articleSlug, slug)
        )
      )
      .limit(1)

    const alreadyCompleted = rows.length > 0
    return new Response(JSON.stringify({ completed: alreadyCompleted }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response('Database error', { status: 503 })
  }
}
