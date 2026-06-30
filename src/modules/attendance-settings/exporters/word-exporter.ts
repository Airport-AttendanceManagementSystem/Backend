import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { AttendanceReportRawData } from '../interfaces/attendance-report.interface';
import * as fs from 'fs';
import * as path from 'path';

const LOGO_PATH = path.join(__dirname, '../../../assets/AASL.png');

const DARK_NAVY = '001A4D';
const WHITE = 'FFFFFF';
const LIGHT_BG = 'EEF2FF';

const noBorder = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};

function hCell(text: string): TableCell {
  return new TableCell({
    shading: { fill: DARK_NAVY },
    borders: noBorder,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, color: WHITE, size: 20 })],
      }),
    ],
  });
}

function dCell(text: string, shade: boolean): TableCell {
  return new TableCell({
    shading: shade ? { fill: LIGHT_BG } : undefined,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'CCDDEE' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCDDEE' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'CCDDEE' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'CCDDEE' },
    },
    children: [
      new Paragraph({
        children: [new TextRun({ text: String(text ?? ''), size: 18 })],
      }),
    ],
  });
}

function aaslHeaderParagraphs(
  title: string,
  filter: Record<string, any>,
): Paragraph[] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const deptName = filter.deptName ?? '';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const sectionName = filter.sectionName ?? '';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const date = filter.fromDate ?? new Date().toISOString().slice(0, 10);

  const divisionRows: Paragraph[] = [];
  if (deptName) {
    divisionRows.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'DIVISION :   ', bold: true, size: 20 }),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          new TextRun({ text: deptName, size: 20 }),
          new TextRun({ text: '\t\t\t', size: 20 }),
          new TextRun({ text: `DATE :  ${date}`, size: 20 }),
        ],
      }),
    );
  }
  if (sectionName) {
    divisionRows.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'SECTION :   ', bold: true, size: 20 }),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          new TextRun({ text: sectionName, size: 20 }),
        ],
      }),
    );
  }
  if (!deptName && !sectionName) {
    //divisionRows.push(
    //   new Paragraph({
    //    children: [new TextRun({ text: `DATE :  ${date}`, size: 20 })],
    //  }),
    // );
  }
  divisionRows.push(new Paragraph({ children: [] }));

  const logoParagraphs: Paragraph[] = [];
  try {
    const logoData = fs.readFileSync(LOGO_PATH);
    logoParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: logoData,
            transformation: { width: 130, height: 130 },
            type: 'png',
          }),
        ],
      }),
    );
  } catch {
    // logo not found, skip
  }

  return [
    ...logoParagraphs,
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: 'AIRPORT & AVIATION SERVICES (SRI LANKA) LIMITED',
          bold: true,
          color: DARK_NAVY,
          size: 28,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'BANDARANAIKE INTERNATIONAL AIRPORT', size: 22 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'KATUNAYAKE', size: 22 })],
    }),
    new Paragraph({ children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title, bold: true, size: 26 })],
    }),
    new Paragraph({ children: [] }),
    ...divisionRows,
  ];
}

function footerParagraph(): Paragraph {
  const ts = new Date().toLocaleString('en-GB').replace(',', '');
  return new Paragraph({
    children: [
      new TextRun({ text: `PRINT DATE/TIME : ${ts}`, size: 16, italics: true }),
    ],
  });
}

// ── legacy (kept for backward compat) ────────────────────────────────────────
export async function generateWord(
  records: AttendanceReportRawData[],
): Promise<Buffer> {
  return generateFormattedReportWord(records, 'daily', {});
}

// ── Main Word generator ───────────────────────────────────────────────────────
export async function generateFormattedReportWord(
  records: any[],
  reportType: string,
  filter: Record<string, any>,
): Promise<Buffer> {
  let tableNode: Table;
  let title = 'ATTENDANCE REPORT';
  let extraParagraphs: Paragraph[] = [];

  if (reportType === 'serial') {
    title = 'SERIAL / EPF REPORT';
    const headerRow = new TableRow({
      children: ['SERIAL NO', 'EPF NO', 'NAME'].map(hCell),
    });
    const dataRows = records.map(
      (r, i) =>
        new TableRow({
          children: [
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dCell(String(r.serialNo ?? ''), i % 2 === 0),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dCell(String(r.epfNo ?? ''), i % 2 === 0),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dCell(String(r.name ?? ''), i % 2 === 0),
          ],
        }),
    );
    tableNode = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...dataRows],
    });
  } else if (reportType === 'absence') {
    title = 'ABSENCE REPORT';
    if (filter.fromDate) {
      extraParagraphs = [
        new Paragraph({
          children: [
            new TextRun({
              text: `FROM : ${filter.fromDate}  TO : ${filter.toDate ?? ''}`,
              size: 20,
            }),
          ],
        }),
        new Paragraph({ children: [] }),
      ];
    }
    const headerRow = new TableRow({
      children: ['#', 'EPF NO', 'NAME'].map(hCell),
    });
    const dataRows = records.map(
      (r, i) =>
        new TableRow({
          children: [
            dCell(String(i + 1), i % 2 === 0),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dCell(String(r.badgeNumber ?? ''), i % 2 === 0),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dCell(String(r.name ?? ''), i % 2 === 0),
          ],
        }),
    );
    tableNode = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...dataRows],
    });
  } else if (reportType === 'monthly') {
    title = 'MONTHLY ATTENDANCE REPORT';
    if (filter.fromDate) {
      extraParagraphs = [
        new Paragraph({
          children: [
            new TextRun({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
              text: `MONTH : ${filter.fromDate?.slice(0, 7) ?? ''}`,
              size: 20,
            }),
          ],
        }),
        new Paragraph({ children: [] }),
      ];
    }
    const headerRow = new TableRow({
      children: ['EPF NO', 'NAME', 'MONTH', 'DAYS PRESENT'].map(hCell),
    });
    const dataRows = records.map(
      (r, i) =>
        new TableRow({
          children: [
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dCell(String(r.badgeNumber ?? ''), i % 2 === 0),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dCell(String(r.name ?? ''), i % 2 === 0),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dCell(String(r.month ?? ''), i % 2 === 0),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dCell(String(r.daysPresent ?? ''), i % 2 === 0),
          ],
        }),
    );
    tableNode = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...dataRows],
    });
  } else {
    // daily
    title = 'DAILY ATTENDANCE REPORT';
    if (filter.fromDate) {
      extraParagraphs = [
        new Paragraph({
          children: [
            new TextRun({
              text: `DATE : ${filter.fromDate ?? ''}   FROM : ${filter.fromTime ?? '00:00'}   TO : ${filter.toTime ?? '23:59'}`,
              size: 20,
            }),
          ],
        }),
        new Paragraph({ children: [] }),
      ];
    }
    const headerRow = new TableRow({
      children: ['EPF NO', 'NAME', 'DATE', 'TIME', 'TYPE'].map(hCell),
    });
    const dataRows = records.map((r, i) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const d = new Date(r.checkTime);
      return new TableRow({
        children: [
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          dCell(String(r.badgeNumber ?? r.userId ?? ''), i % 2 === 0),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          dCell(String(r.name ?? ''), i % 2 === 0),
          dCell(
            isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-GB'),
            i % 2 === 0,
          ),
          dCell(
            isNaN(d.getTime()) ? '-' : d.toLocaleTimeString('en-GB'),
            i % 2 === 0,
          ),
          dCell(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
            r.checkTypeDisplay ?? (r.checkType === 'I' ? 'I' : 'O'),
            i % 2 === 0,
          ),
        ],
      });
    });
    tableNode = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...dataRows],
    });
  }

  const doc = new Document({
    sections: [
      {
        children: [
          ...aaslHeaderParagraphs(title, filter),
          ...extraParagraphs,
          tableNode,
          new Paragraph({ children: [] }),
          footerParagraph(),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
