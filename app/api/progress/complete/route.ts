import { auth } from '@clerk/nextjs/server'
import { db } from '@/utils/db'
import { sql } from 'drizzle-orm'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { slug } = await req.json()
  if (typeof slug !== 'string' || !slug.trim()) {
    return new Response('Invalid slug', { status: 400 })
  }

  try {
    await db.execute(
      sql`INSERT IGNORE INTO article_progress (user_id, article_slug) VALUES (${userId}, ${slug})`
    )
    return new Response('OK')
  } catch (err) {
    console.error('Database error:', err)
    return new Response('Database unavailable', { status: 503 })
  }
}
