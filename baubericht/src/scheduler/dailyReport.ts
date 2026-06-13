import type { Bot } from "grammy";
import { describeImageForFilename, describeImageForReport } from "../ai/imageAnalysis.js";
import { generateReportContent } from "../ai/reportGenerator.js";
import { getTodayMessages, getAllProjects, insertReport, hasReportForDate } from "../db/queries.js";
import { generatePdf } from "../pdf/pdfGenerator.js";
import {
  buildImageFilename,
  buildPdfFilename,
  downloadTelegramFile,
  getTmpPath,
  removeTmpFile,
} from "../storage/fileManager.js";
import {
  isSharePointConfigured,
  readIndexJson,
  updateIndexJson,
  uploadBuffer,
  uploadFile,
} from "../storage/sharepoint.js";

export async function runDailyReports(bot: Bot): Promise<void> {
  const today = getTodayDateString();
  console.log(`[Scheduler] Starte Tagesberichte für ${today}`);

  const allProjects = getAllProjects();

  for (const project of allProjects) {
    try {
      await processProjectReport(bot, project.id, project.name, project.telegramChatId, today);
    } catch (err) {
      console.error(`[Scheduler] Fehler bei Projekt "${project.name}":`, err);
      try {
        await bot.api.sendMessage(
          project.telegramChatId,
          `⚠️ Beim Erstellen des Bautagesberichts ist ein Fehler aufgetreten. Bitte manuell prüfen.`
        );
      } catch {
        // ignore send error
      }
    }
  }
}

async function processProjectReport(
  bot: Bot,
  projectId: number,
  projectName: string,
  chatId: string,
  date: string
): Promise<void> {
  if (hasReportForDate(projectId, date)) {
    console.log(`[Scheduler] Bericht für "${projectName}" am ${date} bereits erstellt.`);
    return;
  }

  const msgs = getTodayMessages(projectId, date);
  if (msgs.length === 0) {
    console.log(`[Scheduler] Keine Nachrichten für "${projectName}" am ${date}.`);
    return;
  }

  console.log(`[Scheduler] Verarbeite ${msgs.length} Nachrichten für "${projectName}"`);

  const photoMessages = msgs.filter((m) => m.type === "photo" && m.telegramFileId);
  const tmpFiles: string[] = [];
  const photoEntries: { localPath: string; filename: string; description: string }[] = [];
  const photoDescriptions: { fileName: string; description: string }[] = [];

  // Download and analyze photos
  for (let i = 0; i < photoMessages.length; i++) {
    const msg = photoMessages[i];
    try {
      const file = await bot.api.getFile(msg.telegramFileId!);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      const tmpPath = getTmpPath(`photo_${projectId}_${date}_${i}.jpg`);
      tmpFiles.push(tmpPath);

      await downloadTelegramFile(fileUrl, tmpPath);

      const [shortDesc, fullDesc] = await Promise.all([
        describeImageForFilename(tmpPath),
        describeImageForReport(tmpPath),
      ]);

      const filename = buildImageFilename(date, projectName, shortDesc, i);
      photoEntries.push({ localPath: tmpPath, filename, description: fullDesc });
      photoDescriptions.push({ fileName: filename, description: fullDesc });

      // Upload image to SharePoint
      if (isSharePointConfigured()) {
        const remotePath = `Bilder/${projectName}/${filename}`;
        await uploadFile(tmpPath, remotePath, "image/jpeg");
      }
    } catch (err) {
      console.error(`[Scheduler] Fehler beim Verarbeiten von Foto ${i + 1}:`, err);
    }
  }

  // Generate report content via Claude
  const reportContent = await generateReportContent(projectName, date, msgs, photoDescriptions);

  // Generate PDF
  const pdfBuffer = await generatePdf(reportContent, photoEntries);
  const pdfFilename = buildPdfFilename(date, projectName);

  // Upload PDF to SharePoint
  let sharepointPdfPath: string | undefined;
  if (isSharePointConfigured()) {
    const [year, month] = date.split("-");
    const remotePdfPath = `Berichte/${year}/${month}/${pdfFilename}`;
    sharepointPdfPath = await uploadBuffer(pdfBuffer, remotePdfPath, "application/pdf");

    // Update index.json
    const index = (await readIndexJson()) as {
      projects: Record<string, { reports: { date: string; path: string }[] }>;
    };
    if (!index.projects) index.projects = {};
    if (!index.projects[projectName]) index.projects[projectName] = { reports: [] };
    index.projects[projectName].reports.push({ date, path: sharepointPdfPath });
    await updateIndexJson(index);
  }

  // Save report record
  insertReport({ projectId, reportDate: date, sharepointPdfPath });

  // Notify Telegram group
  const sharePointNote = isSharePointConfigured()
    ? `\n📁 Abgelegt in SharePoint unter:\n\`Berichte/${date.slice(0, 4)}/${date.slice(5, 7)}/${pdfFilename}\``
    : "";
  await bot.api.sendMessage(
    chatId,
    `✅ Bautagesbericht vom ${formatDate(date)} wurde erstellt.${sharePointNote}\n\n` +
      `📊 Verarbeitet: ${msgs.filter((m) => m.type === "text").length} Textnachrichten, ${photoEntries.length} Fotos`
  );

  // Cleanup tmp files
  tmpFiles.forEach(removeTmpFile);

  console.log(`[Scheduler] Bericht für "${projectName}" erfolgreich erstellt.`);
}

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}
