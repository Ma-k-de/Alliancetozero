import { and, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "./client.js";
import { messages, projects, reports } from "./schema.js";

export function findProjectByChatId(chatId: string) {
  return db.select().from(projects).where(eq(projects.telegramChatId, chatId)).get();
}

export function createProject(name: string, chatId: string) {
  return db.insert(projects).values({ name, telegramChatId: chatId }).returning().get();
}

export function insertMessage(data: {
  projectId: number;
  telegramUserId: string;
  senderName: string;
  type: "text" | "photo";
  content?: string;
  telegramFileId?: string;
  localFilePath?: string;
}) {
  return db.insert(messages).values(data).returning().get();
}

export function getTodayMessages(projectId: number, date: string) {
  const dayStart = `${date} 00:00:00`;
  const dayEnd = `${date} 23:59:59`;
  return db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.projectId, projectId),
        gte(messages.createdAt, dayStart),
        lt(messages.createdAt, dayEnd)
      )
    )
    .all();
}

export function getAllProjects() {
  return db.select().from(projects).all();
}

export function insertReport(data: {
  projectId: number;
  reportDate: string;
  sharepointPdfPath?: string;
}) {
  return db.insert(reports).values(data).returning().get();
}

export function hasReportForDate(projectId: number, date: string) {
  return db
    .select()
    .from(reports)
    .where(and(eq(reports.projectId, projectId), eq(reports.reportDate, date)))
    .get();
}

export function countTodayMessages(projectId: number, date: string) {
  const dayStart = `${date} 00:00:00`;
  const dayEnd = `${date} 23:59:59`;
  const result = db
    .select({ count: sql<number>`count(*)` })
    .from(messages)
    .where(
      and(
        eq(messages.projectId, projectId),
        gte(messages.createdAt, dayStart),
        lt(messages.createdAt, dayEnd)
      )
    )
    .get();
  return result?.count ?? 0;
}
