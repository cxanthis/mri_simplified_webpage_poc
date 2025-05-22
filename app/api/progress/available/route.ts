import { withTimeout } from '@/utils/with-timeout'
import { sendSlackAlert } from '@/utils/send-slack-alert'
import { db } from '@/utils/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    await withTimeout(db.execute(sql`SELECT 1`), 3000)
    return new Response('OK')
  } catch (err) {
    await sendSlackAlert('[DB ERROR] /api/progress/available failed to connect to database.')
    return new Response('Database unavailable', { status: 503 })
  }
}
