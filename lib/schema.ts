import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const urlsTable = pgTable('url', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    shortUrl: varchar('short_url').notNull(),
    longUrl: text('long_url').notNull(),
    alias: varchar().notNull(),
    createdAt: timestamp().notNull().default(sql`now()`),
})