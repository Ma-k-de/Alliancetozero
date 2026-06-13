import { createWriteStream, existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const tmpDir = join(__dirname, "../../tmp");

if (!existsSync(tmpDir)) {
  mkdirSync(tmpDir, { recursive: true });
}

export function getTmpPath(filename: string): string {
  return join(tmpDir, filename);
}

export async function downloadTelegramFile(
  fileUrl: string,
  destPath: string
): Promise<void> {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Telegram file download failed: ${response.status}`);
  }
  const writer = createWriteStream(destPath);
  await pipeline(response.body as NodeJS.ReadableStream, writer);
}

export function buildImageFilename(
  date: string,
  projectName: string,
  description: string,
  index: number
): string {
  const datePart = date.replace(/-/g, "");
  const projPart = sanitize(projectName);
  const descPart = sanitize(description).slice(0, 60);
  return `${datePart}_${projPart}_${descPart}_${index + 1}.jpg`;
}

export function buildPdfFilename(date: string, projectName: string): string {
  const datePart = date.replace(/-/g, "");
  const projPart = sanitize(projectName);
  return `${datePart}_${projPart}.pdf`;
}

export function removeTmpFile(path: string): void {
  try {
    if (existsSync(path)) unlinkSync(path);
  } catch {
    // ignore cleanup errors
  }
}

function sanitize(str: string): string {
  return str
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}
