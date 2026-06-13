import { Bot } from "grammy";
import { findProjectByChatId, insertMessage } from "../db/queries.js";
import { registerCommands } from "./commands.js";

export function createBot(): Bot {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN ist nicht gesetzt.");

  const bot = new Bot(token);

  registerCommands(bot);

  // Handle text messages in groups
  bot.on("message:text", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return;

    const chatId = String(ctx.chat.id);
    const project = findProjectByChatId(chatId);
    if (!project) return;

    const senderId = String(ctx.from?.id ?? "unknown");
    const senderName =
      [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(" ") ||
      ctx.from?.username ||
      "Unbekannt";

    insertMessage({
      projectId: project.id,
      telegramUserId: senderId,
      senderName,
      type: "text",
      content: ctx.message.text,
    });

    await ctx.react("👍");
  });

  // Handle photos in groups
  bot.on("message:photo", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return;

    const chatId = String(ctx.chat.id);
    const project = findProjectByChatId(chatId);
    if (!project) return;

    const senderId = String(ctx.from?.id ?? "unknown");
    const senderName =
      [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(" ") ||
      ctx.from?.username ||
      "Unbekannt";

    // Use highest resolution photo
    const photos = ctx.message.photo;
    const bestPhoto = photos[photos.length - 1];
    const caption = ctx.message.caption;

    insertMessage({
      projectId: project.id,
      telegramUserId: senderId,
      senderName,
      type: "photo",
      content: caption,
      telegramFileId: bestPhoto.file_id,
    });

    await ctx.react("📸");
  });

  bot.catch((err) => {
    console.error("[Bot] Unbehandelter Fehler:", err);
  });

  return bot;
}
