import { existsSync, readFileSync } from "fs";
import PdfPrinter from "pdfmake";
import type { ReportContent } from "../ai/reportGenerator.js";

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

interface PhotoEntry {
  localPath: string;
  filename: string;
  description: string;
}

export async function generatePdf(
  report: ReportContent,
  photos: PhotoEntry[]
): Promise<Buffer> {
  const photoContent: object[] = [];

  for (const photo of photos) {
    if (!existsSync(photo.localPath)) continue;
    const imgBuffer = readFileSync(photo.localPath);
    const base64 = imgBuffer.toString("base64");

    photoContent.push(
      {
        image: `data:image/jpeg;base64,${base64}`,
        width: 480,
        margin: [0, 8, 0, 4],
      },
      {
        text: `${photo.filename}\n${photo.description}`,
        style: "photoCaption",
        margin: [0, 0, 0, 16],
      }
    );
  }

  const docDefinition = {
    defaultStyle: { font: "Helvetica", fontSize: 10 },
    styles: {
      title: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] },
      subtitle: { fontSize: 12, color: "#555555", margin: [0, 0, 0, 16] },
      sectionHeader: {
        fontSize: 11,
        bold: true,
        fillColor: "#1a1a1a",
        color: "#ffffff",
        margin: [4, 6, 4, 6],
      },
      sectionBody: { margin: [4, 4, 4, 8] },
      photoCaption: { fontSize: 8, italics: true, color: "#666666" },
      footer: { fontSize: 8, color: "#999999", alignment: "center" },
    },
    content: [
      { text: "Bautagesbericht", style: "title" },
      {
        text: `Projekt: ${report.projekt}  |  Datum: ${formatDate(report.datum)}`,
        style: "subtitle",
      },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
      { text: "", margin: [0, 8] },

      buildSection("Durchgeführte Tätigkeiten", report.taetigkeiten),
      buildSection("Wetterbedingungen", report.wetter),
      buildSection("Personal / Gewerke", report.personal),
      buildSection("Materialien / Lieferungen", report.materialien),
      buildSection("Maschinen / Geräte", report.maschinen),
      buildSection("Besonderheiten / Störungen", report.besonderheiten),

      ...(photoContent.length > 0
        ? [
            {
              text: [{ text: "Fotodokumentation", style: "sectionHeader" }],
              table: {
                widths: ["*"],
                body: [[{ text: "Fotodokumentation", style: "sectionHeader" }]],
              },
              layout: "noBorders",
              margin: [0, 8, 0, 8],
            },
            ...photoContent,
          ]
        : []),
    ],
    footer: (currentPage: number, pageCount: number) => ({
      text: `Bautagesbericht ${report.projekt} vom ${formatDate(report.datum)}  –  Seite ${currentPage} von ${pageCount}`,
      style: "footer",
      margin: [40, 8],
    }),
    pageMargins: [40, 60, 40, 60] as [number, number, number, number],
  };

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = printer.createPdfKitDocument(docDefinition as Parameters<typeof printer.createPdfKitDocument>[0]);
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

function buildSection(title: string, content: string) {
  return [
    {
      table: { widths: ["*"], body: [[{ text: title, style: "sectionHeader" }]] },
      layout: "noBorders",
      margin: [0, 8, 0, 0],
    },
    { text: content || "–", style: "sectionBody" },
  ];
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}
