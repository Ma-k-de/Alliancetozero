import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function describeImageForFilename(imagePath: string): Promise<string> {
  const imageBuffer = readFileSync(imagePath);
  const base64 = imageBuffer.toString("base64");

  const ext = imagePath.toLowerCase();
  const mediaType = ext.endsWith(".png") ? "image/png" : "image/jpeg";

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          {
            type: "text",
            text: `Beschreibe in maximal 5 deutschen Substantiven was auf diesem Baubild zu sehen ist.
Nur Hauptwörter, keine Sonderzeichen, Leerzeichen als Unterstrich, keine Umlaute (ae/oe/ue/ss).
Beispiele: "Betonierung_Decke", "Bewehrung_Bodenplatte", "Kranarbeiten_Stuetze", "Mauerwerk_Aussenwand"
Antworte NUR mit den Wörtern, kein erklärender Text.`,
          },
        ],
      },
    ],
  });

  const raw = (response.content[0] as { type: string; text: string }).text.trim();
  // Sanitize: only allow alphanumeric and underscore
  return raw.replace(/[^a-zA-Z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

export async function describeImageForReport(imagePath: string): Promise<string> {
  const imageBuffer = readFileSync(imagePath);
  const base64 = imageBuffer.toString("base64");

  const ext = imagePath.toLowerCase();
  const mediaType = ext.endsWith(".png") ? "image/png" : "image/jpeg";

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          {
            type: "text",
            text: "Beschreibe kurz und präzise (1-2 Sätze) was auf diesem Baustellenfoto zu sehen ist. Verwende Fachbegriffe aus dem Bauwesen.",
          },
        ],
      },
    ],
  });

  return (response.content[0] as { type: string; text: string }).text.trim();
}
