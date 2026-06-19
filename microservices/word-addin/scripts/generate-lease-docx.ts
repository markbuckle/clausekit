/*
 * Generates demo/lease.docx from the seeded fixture — same clauses, headings,
 * and text as getLeaseFullText(), preserving exact punctuation (curly quotes, §,
 * em-dashes) so model-proposed originalText spans match what Word.run reads back.
 *
 * This is both the test document and the file to open in the "run in real Word"
 * demo. Run with: npm run gen:docx
 */
import { mkdirSync, writeFileSync } from "fs";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { LEASE_TITLE, leaseRecitals, leaseClauses } from "../src/fixtures/lease";

const OUT_PATH = "demo/lease.docx";

async function main() {
  const children: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: LEASE_TITLE, bold: true })],
    }),
    new Paragraph({ children: [new TextRun(leaseRecitals)] }),
  ];

  for (const clause of leaseClauses) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: `${clause.ref}. ${clause.heading}`, bold: true })],
      })
    );
    children.push(new Paragraph({ children: [new TextRun(clause.text)] }));
  }

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);

  mkdirSync("demo", { recursive: true });
  writeFileSync(OUT_PATH, buffer);
  console.log(`Wrote ${OUT_PATH} (${buffer.length} bytes, ${leaseClauses.length} clauses)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
