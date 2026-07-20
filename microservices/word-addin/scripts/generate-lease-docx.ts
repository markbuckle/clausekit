// Generates lease.docx from the seeded fixture, preserving exact punctuation (curly quotes, §, em-dashes) so model-proposed originalText spans match what Word.run reads back. Run with: npm run gen:docx
import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { AlignmentType, Document, LineRuleType, Packer, Paragraph, TextRun } from "docx";
import { LEASE_TITLE, leaseRecitals, leaseClauses } from "../src/fixtures/lease";

// The add-in's demo dir (sideloaded by Word) and the landing page's public dir (served by the "Run in Word" button); paths are relative to this package's root.
const OUT_PATHS = ["demo/lease.docx", "../../frontend/public/lease.docx"];

// Formatting mirrors the browser playground's document pane (playground.css) so the real-Word demo reads identically to "Run in Browser". CSS px converts to Word units: pt = px * 0.75 (96dpi), docx `size` in half-points, `spacing` in twips (pt * 20), `spacing.line` in 240ths of a line.
const SERIF = "Georgia";
const MONO = "Consolas";
const INK = "1F2430"; // playground body color
const REF_GRAY = "6B7280"; // .pg-ref color

async function main() {
  const children: Paragraph[] = [
    // .pg-doc-title — centered, bold, uppercase, 19px, 28px gap below.
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 420 },
      children: [
        new TextRun({
          text: LEASE_TITLE,
          bold: true,
          allCaps: true,
          size: 28, // 14pt ≈ 19px
          characterSpacing: 11, // ~0.04em letter-spacing
          color: INK,
          font: SERIF,
        }),
      ],
    }),
    // .pg-recitals — justified, 14px, line-height 1.75, 28px gap below.
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 420, line: 420, lineRule: LineRuleType.AUTO },
      children: [new TextRun({ text: leaseRecitals, size: 21, color: INK, font: SERIF })],
    }),
  ];

  for (const clause of leaseClauses) {
    // The ref keeps its trailing period ("§5.") so OfficeDocumentService.scrollTo, which searches for `${clauseRef}.`, can still locate the heading in real Word.
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: `${clause.ref}.`, size: 19, color: REF_GRAY, font: MONO }),
          new TextRun({ text: `  ${clause.heading}`, bold: true, size: 22, color: INK, font: SERIF }),
        ],
      })
    );
    // .pg-clause-text — justified, 14px, line-height 1.8, 22px gap below.
    children.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 330, line: 432, lineRule: LineRuleType.AUTO },
        children: [new TextRun({ text: clause.text, size: 21, color: INK, font: SERIF })],
      })
    );
  }

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);

  for (const out of OUT_PATHS) {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, buffer);
  }
  console.log(
    `Wrote ${buffer.length} bytes (${leaseClauses.length} clauses) to: ${OUT_PATHS.join(", ")}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
