import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  telegramChatId: text().notNull().unique(),
  createdAt: text().notNull().default("CURRENT_TIMESTAMP"),
});

export const messages = sqliteTable("messages", {
  id: int().primaryKey({ autoIncrement: true }),
  projectId: int().notNull().references(() => projects.id),
  telegramUserId: text().notNull(),
  senderName: text().notNull(),
  // "text" | "photo"
  type: text().notNull(),
  content: text(),
  telegramFileId: text(),
  localFilePath: text(),
  createdAt: text().notNull().default("CURRENT_TIMESTAMP"),
});

export const reports = sqliteTable("reports", {
  id: int().primaryKey({ autoIncrement: true }),
  projectId: int().notNull().references(() => projects.id),
  reportDate: text().notNull(),
  sharepointPdfPath: text(),
  createdAt: text().notNull().default("CURRENT_TIMESTAMP"),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Report = typeof reports.$inferSelect;
