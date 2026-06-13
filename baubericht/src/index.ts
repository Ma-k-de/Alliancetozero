import "dotenv/config";
import cron from "node-cron";
import { initDb } from "./db/client.js";
import { createBot } from "./bot/bot.js";
import { runDailyReports } from "./scheduler/dailyReport.js";

async function main() {
  console.log("[App] Starte Bautagesbericht-System...");

  initDb();
  console.log("[App] Datenbank initialisiert.");

  const bot = createBot();

  const reportHour = process.env.REPORT_HOUR ?? "21";
  const reportMinute = process.env.REPORT_MINUTE ?? "0";
  const cronExpression = `${reportMinute} ${reportHour} * * *`;

  cron.schedule(
    cronExpression,
    async () => {
      console.log(`[Cron] Starte automatische Tagesberichte...`);
      await runDailyReports(bot);
    },
    { timezone: process.env.TZ ?? "Europe/Berlin" }
  );

  console.log(`[App] Tagesberichte geplant für ${reportHour}:${reportMinute.padStart(2, "0")} Uhr (${process.env.TZ ?? "Europe/Berlin"})`);

  await bot.start({
    onStart: (info) => {
      console.log(`[Bot] Gestartet als @${info.username}`);
      console.log(`[App] System läuft. Warte auf Nachrichten...`);
    },
  });
}

main().catch((err) => {
  console.error("[App] Fataler Fehler:", err);
  process.exit(1);
});
