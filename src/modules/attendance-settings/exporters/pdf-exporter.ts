// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFDocument = require('pdfkit');
import { Response } from 'express';
import { AttendanceReportRawData } from '../interfaces/attendance-report.interface';
import * as path from 'path';

const LOGO_PATH = path.join(__dirname, '../../../assets/AASL.png');

// ── legacy plain export (kept for backward compatibility) ─────────────────────
export function generatePdf(records: AttendanceReportRawData[], res: Response) {
  generateFormattedReportPdf(records, 'daily', {}, res);
}

// ── Serial / EPF record type ──────────────────────────────────────────────────
interface SerialEpfRecord {
  serialNo: number;
  epfNo: string;
  name: string;
}

// ── Shared drawing helpers ────────────────────────────────────────────────────
const LEFT = 50;
const RIGHT = 50;

function aaslHeader(doc: PDFKit.PDFDocument, title: string) {
  const tableWidth = doc.page.width - LEFT - RIGHT;
  const logoW = 130;
  const logoH = Math.round(logoW * (156 / 465)); // actual aspect ratio of AASL.png
  const logoX = (doc.page.width - logoW) / 2;

  try {
    doc.image(LOGO_PATH, logoX, 40, { width: logoW });
  } catch {
    // logo not found, skip
  }

  const afterLogoY = 40 + logoH + 8;

  doc.font('Helvetica-Bold').fontSize(13).fillColor('#001A4D');
  doc.text(
    'AIRPORT & AVIATION SERVICES (SRI LANKA) LIMITED',
    LEFT,
    afterLogoY,
    {
      align: 'center',
      width: tableWidth,
    },
  );
  doc.font('Helvetica').fontSize(10).fillColor('black');
  doc.text('BANDARANAIKE INTERNATIONAL AIRPORT', LEFT, doc.y + 2, {
    align: 'center',
    width: tableWidth,
  });
  doc.text('KATUNAYAKE', LEFT, doc.y + 2, {
    align: 'center',
    width: tableWidth,
  });
  doc.moveDown(0.6);
  doc.font('Helvetica-Bold').fontSize(12);
  doc.text(title, LEFT, doc.y, { align: 'center', width: tableWidth });
  doc.moveDown(0.8);
}

function tableHeader(
  doc: PDFKit.PDFDocument,
  y: number,
  tableWidth: number,
  cols: { label: string; width: number }[],
) {
  doc.rect(LEFT, y, tableWidth, 24).fill('#001A4D');
  doc.fillColor('white').fontSize(9).font('Helvetica-Bold');
  let x = LEFT;
  cols.forEach((c) => {
    doc.text(c.label, x + 4, y + 8, { width: c.width - 8 });
    x += c.width;
  });
  doc.fillColor('black').font('Helvetica');
  return y + 24;
}

function tableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  tableWidth: number,
  cols: { width: number }[],
  cells: string[],
  shade: boolean,
) {
  const ROW_H = 20;
  if (shade) {
    doc.rect(LEFT, y, tableWidth, ROW_H).fill('#f0f4ff').stroke('#ccddee');
  } else {
    doc.rect(LEFT, y, tableWidth, ROW_H).stroke('#ccddee');
  }
  doc.fillColor('black').fontSize(9).font('Helvetica');
  let x = LEFT;
  cells.forEach((cell, i) => {
    doc.text(cell, x + 4, y + 6, { width: cols[i].width - 8, ellipsis: true });
    x += cols[i].width;
  });
  return y + ROW_H;
}

function divisionBlock(doc: PDFKit.PDFDocument, filter: Record<string, any>) {
  const tableWidth = doc.page.width - LEFT - RIGHT;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  const deptName = (filter.deptName ?? '').trim();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  const sectionName = (filter.sectionName ?? '').trim();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const date = filter.fromDate ?? new Date().toISOString().slice(0, 10);
  const dateLabel = `DATE :  ${date}`;

  doc.fontSize(10).fillColor('black');

  const startY = doc.y;
  let textY = startY;

  if (deptName) {
    doc
      .font('Helvetica-Bold')
      .text('DIVISION :', LEFT, textY, { width: 85, lineBreak: false });
    doc.font('Helvetica').text(deptName, LEFT + 85, textY, {
      width: tableWidth - 235,
      lineBreak: false,
    });
    doc.font('Helvetica').text(dateLabel, LEFT + tableWidth - 150, textY, {
      width: 150,
      align: 'right',
      lineBreak: false,
    });
    textY += 16;
  }

  if (sectionName) {
    doc
      .font('Helvetica-Bold')
      .text('SECTION :', LEFT, textY, { width: 85, lineBreak: false });
    doc
      .font('Helvetica')
      .text(sectionName, LEFT + 85, textY, { lineBreak: false });
    if (!deptName) {
      doc.font('Helvetica').text(dateLabel, LEFT + tableWidth - 150, textY, {
        width: 150,
        align: 'right',
        lineBreak: false,
      });
    }
    textY += 16;
  }

  if (!deptName && !sectionName) {
    doc.font('Helvetica').text(dateLabel, LEFT + tableWidth - 150, textY, {
      width: 150,
      align: 'right',
      lineBreak: false,
    });
    textY += 16;
  }

  doc.y = textY + 8;
  doc.moveDown(0.4);
}

function printFooter(doc: PDFKit.PDFDocument) {
  const ts = new Date().toLocaleString('en-GB').replace(',', '');
  doc
    .fontSize(8)
    .font('Helvetica')
    .fillColor('black')
    .text(`PRINT DATE/TIME :   ${ts}`, LEFT, doc.page.height - 40);
}

// ── Main formatted PDF generator ──────────────────────────────────────────────
export function generateFormattedReportPdf(
  records: any[],
  reportType: string,
  filter: Record<string, any>,
  res: Response,
) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${reportType}-report.pdf`,
  );
  doc.pipe(res);

  const tableWidth = doc.page.width - LEFT - RIGHT;

  // ── Serial / EPF ────────────────────────────────────────────────────────────
  if (reportType === 'serial') {
    const cols = [
      { label: 'SERIAL NO', width: 90 },
      { label: 'EPF', width: 110 },
      { label: 'NAME', width: tableWidth - 200 },
    ];
    aaslHeader(doc, 'SERIAL / EPF REPORT');
    divisionBlock(doc, filter);
    let y = tableHeader(doc, doc.y, tableWidth, cols);
    records.forEach((r: SerialEpfRecord, i) => {
      if (y + 20 > doc.page.height - 60) {
        doc.addPage();
        y = tableHeader(doc, 50, tableWidth, cols);
      }
      y = tableRow(
        doc,
        y,
        tableWidth,
        cols,
        [String(r.serialNo ?? ''), String(r.epfNo ?? ''), String(r.name ?? '')],
        i % 2 === 0,
      );
    });
    printFooter(doc);
    doc.end();
    return;
  }

  // ── Absence Report ──────────────────────────────────────────────────────────
  if (reportType === 'absence') {
    const cols = [
      { label: '#', width: 50 },
      { label: 'EPF NO', width: 110 },
      { label: 'NAME', width: tableWidth - 160 },
    ];
    aaslHeader(doc, 'ABSENCE REPORT');
    divisionBlock(doc, filter);

    if (filter.fromDate) {
      doc.fontSize(10).font('Helvetica');
      doc.text(
        `FROM : ${filter.fromDate}  TO : ${filter.toDate ?? ''}`,
        LEFT,
        doc.y,
        { align: 'left' },
      );
      doc.moveDown(0.5);
    }

    let y = tableHeader(doc, doc.y, tableWidth, cols);
    records.forEach((r, i) => {
      if (y + 20 > doc.page.height - 60) {
        doc.addPage();
        y = tableHeader(doc, 50, tableWidth, cols);
      }
      y = tableRow(
        doc,
        y,
        tableWidth,
        cols,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        [String(i + 1), String(r.badgeNumber ?? ''), String(r.name ?? '')],
        i % 2 === 0,
      );
    });
    printFooter(doc);
    doc.end();
    return;
  }

  // ── Monthly Attendance ──────────────────────────────────────────────────────
  if (reportType === 'monthly') {
    const cols = [
      { label: 'EPF NO', width: 90 },
      { label: 'NAME', width: 185 },
      { label: 'MONTH', width: 100 },
      { label: 'DAYS PRESENT', width: tableWidth - 375 },
    ];
    aaslHeader(doc, 'MONTHLY ATTENDANCE REPORT');
    divisionBlock(doc, filter);

    if (filter.fromDate) {
      doc.fontSize(10).font('Helvetica');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      doc.text(`MONTH : ${filter.fromDate?.slice(0, 7) ?? ''}`, LEFT, doc.y);
      doc.moveDown(0.5);
    }

    let y = tableHeader(doc, doc.y, tableWidth, cols);
    records.forEach((r, i) => {
      if (y + 20 > doc.page.height - 60) {
        doc.addPage();
        y = tableHeader(doc, 50, tableWidth, cols);
      }
      y = tableRow(
        doc,
        y,
        tableWidth,
        cols,
        [
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          String(r.badgeNumber ?? ''),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          String(r.name ?? ''),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          String(r.month ?? ''),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          String(r.daysPresent ?? ''),
        ],
        i % 2 === 0,
      );
    });
    printFooter(doc);
    doc.end();
    return;
  }

  // ── Daily Attendance (default) ──────────────────────────────────────────────
  const cols = [
    { label: 'EPF NO', width: 80 },
    { label: 'NAME', width: 85 },
    { label: 'LOCATION', width: 85 },
    { label: 'DATE', width: 90 },
    { label: 'TIME', width: 80 },
    { label: 'TYPE', width: tableWidth - 435 },
  ];

  aaslHeader(doc, 'DAILY ATTENDANCE REPORT');
  divisionBlock(doc, filter);

  if (filter.fromTime || filter.toTime) {
    doc.fontSize(10).font('Helvetica');
    doc.text(
      `FROM : ${filter.fromTime ?? '00:00'}   TO : ${filter.toTime ?? '23:59'}`,
      LEFT,
      doc.y,
    );
    doc.moveDown(0.5);
  }

  let y = tableHeader(doc, doc.y, tableWidth, cols);
  records.forEach((r, i) => {
    if (y + 20 > doc.page.height - 60) {
      doc.addPage();
      y = tableHeader(doc, 50, tableWidth, cols);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const d = new Date(r.checkTime);
    y = tableRow(
      doc,
      y,
      tableWidth,
      cols,
      [
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        String(r.badgeNumber ?? r.userId ?? ''),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        String(r.name ?? ''),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        String(r.location ?? ''),
        isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-GB'),
        isNaN(d.getTime()) ? '-' : d.toLocaleTimeString('en-GB'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        r.checkTypeDisplay ?? (r.checkType === 'I' ? 'I' : 'O'),
      ],
      i % 2 === 0,
    );
  });
  printFooter(doc);
  doc.end();
}

// ── Serial EPF standalone (endpoint compat) ───────────────────────────────────
export function generateSerialEpfPdf(
  records: SerialEpfRecord[],
  res: Response,
) {
  generateFormattedReportPdf(records, 'serial', {}, res);
}

// ── Monthly Attendance Matrix PDF ─────────────────────────────────────────────
interface TimeEntry {
  time: string;
  type: 'I' | 'O';
}
interface MonthlyEmployee {
  badgeNumber: string;
  name: string;
  dateMap: Map<string, TimeEntry[]>;
}

function parseMonthlyEmployees(rawRecords: any[]): MonthlyEmployee[] {
  const map = new Map<string, MonthlyEmployee>();
  for (const rec of rawRecords) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const epf = String(rec.badgeNumber ?? '').trim();
    if (!epf) continue;
    if (!map.has(epf)) {
      map.set(epf, {
        badgeNumber: epf,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        name: String(rec.name ?? '').trim(),
        dateMap: new Map(),
      });
    }
    const emp = map.get(epf)!;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const d = new Date(rec.checkTime);
    if (isNaN(d.getTime())) continue;
    const dateKey = d.toISOString().slice(0, 10);
    const timeStr = d.toTimeString().slice(0, 8);
    const typeChar =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      String(rec.checkType ?? '').toUpperCase() === 'I' ? 'I' : 'O';
    if (!emp.dateMap.has(dateKey)) emp.dateMap.set(dateKey, []);
    emp.dateMap.get(dateKey)!.push({ time: timeStr, type: typeChar });
  }
  return [...map.values()].sort((a, b) =>
    a.badgeNumber.localeCompare(b.badgeNumber),
  );
}

function getAllDatesInRange(filter: Record<string, any>): string[] {
  if (!filter.fromDate || !filter.toDate) return [];
  const dates: string[] = [];
  const from = new Date(filter.fromDate + 'T00:00:00');
  const to = new Date(filter.toDate + 'T00:00:00');
  for (const d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function calcRowHeight(
  emp: MonthlyEmployee,
  dates: string[],
  entryH: number,
  minH: number,
): number {
  let maxEntries = 0;
  for (const date of dates) {
    const entries = emp.dateMap.get(date) ?? [];
    if (entries.length > maxEntries) maxEntries = entries.length;
  }
  return Math.max(minH, maxEntries * entryH + 6);
}

export function generateMonthlyMatrixPdf(
  rawRecords: any[],
  filter: Record<string, any>,
  res: Response,
) {
  const employees = parseMonthlyEmployees(rawRecords);
  const allDates = getAllDatesInRange(filter);

  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 0,
    autoFirstPage: true,
  });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=monthly-attendance.pdf',
  );
  doc.pipe(res);

  if (allDates.length === 0 || employees.length === 0) {
    doc
      .font('Helvetica')
      .fontSize(11)
      .text('No records found for the selected period.', 50, 50);
    doc.end();
    return;
  }

  // ── Layout constants ──────────────────────────────────────────────────────
  const PAGE_W = doc.page.width; // 841.89 (landscape)
  const PAGE_H = doc.page.height; // 595.28
  const ML = 40,
    MR = 40,
    MT = 28,
    MB = 38;
  const TABLE_W = PAGE_W - ML - MR; // 761.89
  const EPF_W = 65;
  const NAME_W = 135;
  const FIXED_W = EPF_W + NAME_W;
  const DATES_FIRST = 6;
  const DATES_CONT = 9;
  const DATE_COL_W_FIRST = (TABLE_W - FIXED_W) / DATES_FIRST; // ~93.6// ~84.7
  const COL_HDR_H = 24;
  const ENTRY_H = 15;
  const MIN_ROW_H = 20;

  // ── Date chunks ───────────────────────────────────────────────────────────
  const dateChunks: { dates: string[]; withFixed: boolean; colW: number }[] =
    [];
  dateChunks.push({
    dates: allDates.slice(0, DATES_FIRST),
    withFixed: true,
    colW: DATE_COL_W_FIRST,
  });
  for (let i = DATES_FIRST; i < allDates.length; i += DATES_CONT) {
    const chunk = allDates.slice(i, i + DATES_CONT);
    dateChunks.push({
      dates: chunk,
      withFixed: false,
      colW: TABLE_W / chunk.length,
    });
  }

  // ── Header height on first-chunk pages ───────────────────────────────────
  const HDR_H = 120; // logo + company header + title + division/section/month lines

  // ── Split employees into batches (based on first date chunk) ─────────────
  const firstChunkDates = dateChunks[0].dates;
  const availForData = PAGE_H - MT - HDR_H - COL_HDR_H - MB;

  const empBatches: MonthlyEmployee[][] = [];
  let batch: MonthlyEmployee[] = [];
  let batchH = 0;
  for (const emp of employees) {
    const rh = calcRowHeight(emp, firstChunkDates, ENTRY_H, MIN_ROW_H);
    if (batch.length > 0 && batchH + rh > availForData) {
      empBatches.push(batch);
      batch = [emp];
      batchH = rh;
    } else {
      batch.push(emp);
      batchH += rh;
    }
  }
  if (batch.length > 0) empBatches.push(batch);

  const totalPages = empBatches.length * dateChunks.length;
  let pageNum = 0;
  let isFirstPage = true;

  const deptName = String(filter.deptName ?? '').trim();
  const sectionName = String(filter.sectionName ?? '').trim();
  const monthLabel = filter.fromDate
    ? new Date(filter.fromDate + 'T00:00:00').toLocaleString('en', {
        month: 'long',
      })
    : '';

  // ── Generate pages ────────────────────────────────────────────────────────
  for (const empBatch of empBatches) {
    for (const { dates: dateChunk, withFixed, colW } of dateChunks) {
      pageNum++;
      if (!isFirstPage)
        doc.addPage({ size: 'A4', layout: 'landscape', margin: 0 });
      isFirstPage = false;

      let y = MT;

      // ── Header (first-chunk pages only) ────────────────────────────────
      if (withFixed) {
        try {
          const logoW = 90;
          doc.image(LOGO_PATH, (PAGE_W - logoW) / 2, y, { width: logoW });
        } catch {
          /* logo missing */
        }
        y += 45;

        doc.font('Helvetica-Bold').fontSize(11).fillColor('#001A4D');
        doc.text('AIRPORT & AVIATION SERVICES (SRI LANKA) LIMITED', ML, y, {
          align: 'center',
          width: TABLE_W,
        });
        y = doc.y + 2;

        doc.font('Helvetica').fontSize(9).fillColor('black');
        doc.text('BANDARANAIKE INTERNATIONAL AIRPORT', ML, y, {
          align: 'center',
          width: TABLE_W,
        });
        y = doc.y + 1;
        doc.text('KATUNAYAKE', ML, y, { align: 'center', width: TABLE_W });
        y = doc.y + 4;

        doc.font('Helvetica-Bold').fontSize(11).fillColor('#001A4D');
        doc.text('MONTHLY ATTENDANCE REPORT', ML, y, {
          align: 'center',
          width: TABLE_W,
        });
        y = doc.y + 3;

        doc.font('Helvetica').fontSize(9).fillColor('black');
        if (deptName) {
          doc.text(`DIVISION :  ${deptName}`, ML, y);
          y = doc.y + 2;
        }
        if (sectionName) {
          doc.text(`SECTION :  ${sectionName}`, ML, y);
          y = doc.y + 2;
        }
        if (monthLabel) {
          doc.font('Helvetica-Bold').text(`MONTH :  ${monthLabel}`, ML, y);
          doc.font('Helvetica');
          y = doc.y + 5;
        }
      } else {
        y += 8;
      }

      // ── Column header row ───────────────────────────────────────────────
      doc.rect(ML, y, TABLE_W, COL_HDR_H).fill('#001A4D');
      doc.fillColor('white').font('Helvetica-Bold').fontSize(8);
      let x = ML;
      if (withFixed) {
        doc.text('EPF NO', x + 3, y + 8, { width: EPF_W - 6 });
        x += EPF_W;
        doc.text('NAME', x + 3, y + 8, { width: NAME_W - 6 });
        x += NAME_W;
      }
      for (const date of dateChunk) {
        doc.text(date, x + 2, y + 8, { width: colW - 4, align: 'center' });
        x += colW;
      }
      y += COL_HDR_H;
      doc.fillColor('black').font('Helvetica');

      // ── Data rows ───────────────────────────────────────────────────────
      for (let ei = 0; ei < empBatch.length; ei++) {
        const emp = empBatch[ei];
        const rowH = calcRowHeight(emp, dateChunk, ENTRY_H, MIN_ROW_H);
        const shade = ei % 2 === 0;

        // Row background + border
        doc
          .rect(ML, y, TABLE_W, rowH)
          .fillAndStroke(shade ? '#f4f7ff' : '#ffffff', '#c8d8ee');

        x = ML;
        doc.fillColor('#001A4D');

        if (withFixed) {
          // EPF column
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .text(emp.badgeNumber, x + 3, y + 5, {
              width: EPF_W - 6,
              lineBreak: false,
            });
          // vertical separator
          doc
            .moveTo(x + EPF_W, y)
            .lineTo(x + EPF_W, y + rowH)
            .stroke('#c8d8ee');
          x += EPF_W;

          // NAME column
          doc
            .font('Helvetica')
            .fontSize(7.5)
            .text(emp.name, x + 3, y + 5, {
              width: NAME_W - 6,
              lineBreak: false,
            });
          doc
            .moveTo(x + NAME_W, y)
            .lineTo(x + NAME_W, y + rowH)
            .stroke('#c8d8ee');
          x += NAME_W;
        }

        // Date cells
        for (const date of dateChunk) {
          const entries = emp.dateMap.get(date) ?? [];
          let ey = y + 4;
          for (const entry of entries) {
            doc
              .font('Helvetica')
              .fontSize(7)
              .fillColor(entry.type === 'I' ? '#155724' : '#7a3800')
              .text(`${entry.time} ${entry.type}`, x + 2, ey, {
                width: colW - 4,
                lineBreak: false,
              });
            ey += ENTRY_H;
          }
          doc
            .moveTo(x + colW, y)
            .lineTo(x + colW, y + rowH)
            .stroke('#c8d8ee');
          x += colW;
        }
        doc.fillColor('black');
        y += rowH;
      }

      // ── Footer ──────────────────────────────────────────────────────────
      const ts = new Date().toLocaleString('en-GB').replace(',', '');
      doc.font('Helvetica').fontSize(8).fillColor('black');
      doc.text(`PRINT DATE/TIME   ${ts}`, ML, PAGE_H - MB + 8, {
        lineBreak: false,
      });
      doc.text(
        `${pageNum} of ${totalPages}`,
        PAGE_W - MR - 60,
        PAGE_H - MB + 8,
        {
          width: 60,
          align: 'right',
          lineBreak: false,
        },
      );
    }
  }

  doc.end();
}
