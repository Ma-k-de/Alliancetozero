import Anthropic from "@anthropic-ai/sdk";
import type { Message } from "../db/schema.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ReportContent {
  datum: string;
  projekt: string;
  taetigkeiten: string;
  personal: string;
  materialien: string;
  maschinen: string;
  besonderheiten: string;
  wetter: string;
}

export async function generateReportContent(
  projectName: string,
  date: string,
  msgs: Message[],
  photoDescriptions: { fileName: string; description: string }[]
): Promise<ReportContent> {
  const textMessages = msgs
    .filter((m) => m.type === "text" && m.content)
    .map((m) => `[${m.senderName} ${m.createdAt.slice(11, 16)}]: ${m.content}`)
    .join("\n");

  const photoList = photoDescriptions
    .map((p) => `- Foto "${p.fileName}": ${p.description}`)
    .join("\n");

  const prompt = `Du bist ein Assistent für Bauleitungen auf deutschen Baustellen.
Erstelle einen strukturierten Bautagesbericht auf Basis folgender Eingaben.

Projekt: ${projectName}
Datum: ${date}

Nachrichten vom Tag:
${textMessages || "(keine Textnachrichten)"}

Fotos (${photoDescriptions.length} Stück):
${photoList || "(keine Fotos)"}

Erstelle den Bericht im folgenden JSON-Format (alle Felder auf Deutsch):
{
  "taetigkeiten": "Durchgeführte Arbeiten als Fließtext",
  "personal": "Erwähntes Personal / Gewerke als Aufzählung",
  "materialien": "Erwähnte Materialien / Lieferungen",
  "maschinen": "Erwähnte Maschinen / Geräte / Fahrzeuge",
  "besonderheiten": "Besonderheiten, Störungen, Sicherheitsvorfälle oder 'Keine'",
  "wetter": "Wetterbedingungen wenn erwähnt, sonst 'Nicht angegeben'"
}

Antworte NUR mit dem JSON-Objekt, kein erklärender Text.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = (response.content[0] as { type: string; text: string }).text.trim();

  let parsed: Omit<ReportContent, "datum" | "projekt">;
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
  } catch {
    parsed = {
      taetigkeiten: rawText,
      personal: "Nicht ermittelbar",
      materialien: "Nicht ermittelbar",
      maschinen: "Nicht ermittelbar",
      besonderheiten: "Keine",
      wetter: "Nicht angegeben",
    };
  }

  return {
    datum: date,
    projekt: projectName,
    ...parsed,
  };
}
