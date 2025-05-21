import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core'

export const articleProgress = mysqlTable('article_progress', {
  userId: varchar('user_id', { length: 255 }).notNull(),
  articleSlug: varchar('article_slug', { length: 255 }).notNull(),
  completedAt: timestamp('completed_at').defaultNow(),
})
