import type { Bot, Context } from "grammy";
import {
  countTodayMessages,
  createProject,
  findProjectByChatId,
  getTodayMessages,
} from "../db/queries.js";
import { runDailyReports, getTodayDateString } from "../scheduler/dailyReport.js";

export function registerCommands(bot: Bot): void {
  bot.command("start", handleStart);
  bot.command("hilfe", handleHilfe);
  bot.command("projekt", handleProjekt);
  bot.command("status", handleStatus);
  bot.command("bericht", handleBericht);
}

async function handleStart(ctx: Context) {
  const chatType = ctx.chat?.type;
  if (chatType === "private") {
    await ctx.reply(
      `👷 *Bautagesbericht-Bot*\n\n` +
        `Dieser Bot sammelt Nachrichten und Fotos aus Telegram-Gruppen und erstellt täglich um 21:00 Uhr automatisch Bautagesberichte.\n\n` +
        `*So geht's:*\n` +
        `1. Bot in eine Telegram-Gruppe einladen\n` +
        `2. Als Gruppenadmin: \`/projekt [Projektname]\` eingeben\n` +
        `3. Teammitglieder senden Texte und Fotos den ganzen Tag\n` +
        `4. Um 21:00 Uhr wird der Bericht automatisch erstellt\n\n` +
        `/hilfe für weitere Befehle`,
      { parse_mode: "Markdown" }
    );
  } else {
    const project = findProjectByChatId(String(ctx.chat!.id));
    if (project) {
      await ctx.reply(`✅ Diese Gruppe ist bereits als Projekt *"${project.name}"* registriert.`, {
        parse_mode: "Markdown",
      });
    } else {
      await ctx.reply(
        `👷 *Bautagesbericht-Bot aktiv!*\n\nDiese Gruppe ist noch keinem Projekt zugeordnet.\nAdmin: \`/projekt [Projektname]\` eingeben um zu starten.`,
        { parse_mode: "Markdown" }
      );
    }
  }
}

async function handleHilfe(ctx: Context) {
  await ctx.reply(
    `*Verfügbare Befehle:*\n\n` +
      `/start – Willkommensnachricht\n` +
      `/projekt [Name] – Gruppe als Projekt registrieren _(nur Admin)_\n` +
      `/status – Heutige gesammelte Inhalte anzeigen\n` +
      `/bericht – Bericht jetzt manuell erstellen _(nur Admin)_\n` +
      `/hilfe – Diese Hilfe anzeigen\n\n` +
      `📸 Einfach Texte und Fotos senden – der Bot speichert alles automatisch.\n` +
      `🕘 Täglich um 21:00 Uhr wird der Bautagesbericht erstellt.`,
    { parse_mode: "Markdown" }
  );
}

async function handleProjekt(ctx: Context) {
  if (!ctx.chat || ctx.chat.type === "private") {
    await ctx.reply("⚠️ Dieser Befehl funktioniert nur in Gruppen.");
    return;
  }

  // Check admin
  const userId = ctx.from?.id;
  if (!userId) return;
  const member = await ctx.getChatMember(userId);
  if (member.status !== "administrator" && member.status !== "creator") {
    await ctx.reply("⚠️ Nur Gruppenadmins können Projekte registrieren.");
    return;
  }

  const args = ctx.message?.text?.split(" ").slice(1).join(" ").trim();
  if (!args) {
    await ctx.reply("⚠️ Bitte Projektnamen angeben: `/projekt Baustelle_A1`", {
      parse_mode: "Markdown",
    });
    return;
  }

  const chatId = String(ctx.chat.id);
  const existing = findProjectByChatId(chatId);
  if (existing) {
    await ctx.reply(
      `ℹ️ Diese Gruppe ist bereits als Projekt *"${existing.name}"* registriert.`,
      { parse_mode: "Markdown" }
    );
    return;
  }

  createProject(args, chatId);
  await ctx.reply(
    `✅ Projekt *"${args}"* erfolgreich registriert!\n\nAb sofort werden alle Nachrichten und Fotos in dieser Gruppe gesammelt. Täglich um 21:00 Uhr wird der Bautagesbericht erstellt.`,
    { parse_mode: "Markdown" }
  );
}

async function handleStatus(ctx: Context) {
  if (!ctx.chat || ctx.chat.type === "private") {
    await ctx.reply("⚠️ Dieser Befehl funktioniert nur in Gruppen.");
    return;
  }

  const chatId = String(ctx.chat.id);
  const project = findProjectByChatId(chatId);
  if (!project) {
    await ctx.reply("⚠️ Diese Gruppe ist noch nicht registriert. Admin: `/projekt [Name]`", {
      parse_mode: "Markdown",
    });
    return;
  }

  const today = getTodayDateString();
  const msgs = getTodayMessages(project.id, today);
  const textCount = msgs.filter((m) => m.type === "text").length;
  const photoCount = msgs.filter((m) => m.type === "photo").length;

  await ctx.reply(
    `📋 *Status für "${project.name}"*\n` +
      `Datum: ${formatDate(today)}\n\n` +
      `💬 Textnachrichten: ${textCount}\n` +
      `📸 Fotos: ${photoCount}\n\n` +
      `${msgs.length === 0 ? "Noch keine Inhalte heute." : `Nächster automatischer Bericht: heute um 21:00 Uhr.`}`,
    { parse_mode: "Markdown" }
  );
}

async function handleBericht(ctx: Context) {
  if (!ctx.chat || ctx.chat.type === "private") {
    await ctx.reply("⚠️ Dieser Befehl funktioniert nur in Gruppen.");
    return;
  }

  // Check admin
  const userId = ctx.from?.id;
  if (!userId) return;
  const member = await ctx.getChatMember(userId);
  if (member.status !== "administrator" && member.status !== "creator") {
    await ctx.reply("⚠️ Nur Gruppenadmins können den Bericht manuell starten.");
    return;
  }

  const chatId = String(ctx.chat.id);
  const project = findProjectByChatId(chatId);
  if (!project) {
    await ctx.reply("⚠️ Diese Gruppe ist noch nicht registriert.");
    return;
  }

  const today = getTodayDateString();
  const count = countTodayMessages(project.id, today);
  if (count === 0) {
    await ctx.reply("ℹ️ Heute wurden noch keine Inhalte gesammelt.");
    return;
  }

  await ctx.reply(`⏳ Erstelle Bautagesbericht für "${project.name}"...`);

  // We need the bot instance – passed via closure in registerCommands
  // runDailyReports handles all projects; here we just trigger and let it handle notifications
  try {
    await runDailyReports(ctx.api as unknown as Parameters<typeof runDailyReports>[0]);
  } catch (err) {
    console.error("[Command /bericht] Fehler:", err);
    await ctx.reply("❌ Beim Erstellen des Berichts ist ein Fehler aufgetreten.");
  }
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}
