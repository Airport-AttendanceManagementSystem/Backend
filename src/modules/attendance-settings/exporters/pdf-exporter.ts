// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFDocument = require('pdfkit');
import { Response } from 'express';
import { AttendanceReportRawData } from '../interfaces/attendance-report.interface';

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
const LEFT   = 50;
const RIGHT  = 50;

function aaslHeader(doc: PDFKit.PDFDocument, title: string) {
  const tableWidth = doc.page.width - LEFT - RIGHT;

  doc.font('Helvetica-Bold').fontSize(13).fillColor('#001A4D');
  doc.text('AIRPORT & AVIATION SERVICES (SRI LANKA) LIMITED', LEFT, 50, {
    align: 'center', width: tableWidth,
  });
  doc.font('Helvetica').fontSize(10).fillColor('black');
  doc.text('BANDARANAIKE INTERNATIONAL AIRPORT', LEFT, doc.y + 2, {
    align: 'center', width: tableWidth,
  });
  doc.text('KATUNAYAKE', LEFT, doc.y + 2, {
    align: 'center', width: tableWidth,
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
  cols.forEach(c => {
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
  const tableWidth  = doc.page.width - LEFT - RIGHT;
  const deptName    = (filter.deptName    ?? '').trim();
  const sectionName = (filter.sectionName ?? '').trim();
  const date        = filter.fromDate ?? new Date().toISOString().slice(0, 10);
  const dateLabel   = `DATE :  ${date}`;

  doc.fontSize(10).fillColor('black');

  const startY = doc.y;
  let   textY  = startY;

  if (deptName) {
    doc.font('Helvetica-Bold').text('DIVISION :', LEFT,          textY, { width: 85, lineBreak: false });
    doc.font('Helvetica')     .text(deptName,    LEFT + 85,      textY, { width: tableWidth - 235, lineBreak: false });
    doc.font('Helvetica')     .text(dateLabel,   LEFT + tableWidth - 150, textY, { width: 150, align: 'right', lineBreak: false });
    textY += 16;
  }

  if (sectionName) {
    doc.font('Helvetica-Bold').text('SECTION :', LEFT,     textY, { width: 85, lineBreak: false });
    doc.font('Helvetica')     .text(sectionName, LEFT + 85, textY, { lineBreak: false });
    if (!deptName) {
      doc.font('Helvetica').text(dateLabel, LEFT + tableWidth - 150, textY, { width: 150, align: 'right', lineBreak: false });
    }
    textY += 16;
  }

  if (!deptName && !sectionName) {
    doc.font('Helvetica').text(dateLabel, LEFT + tableWidth - 150, textY, { width: 150, align: 'right', lineBreak: false });
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
      { label: 'EPF',       width: 110 },
      { label: 'NAME',      width: tableWidth - 200 },
    ];
    aaslHeader(doc, 'SERIAL / EPF REPORT');
    divisionBlock(doc, filter);
    let y = tableHeader(doc, doc.y, tableWidth, cols);
    records.forEach((r: SerialEpfRecord, i) => {
      if (y + 20 > doc.page.height - 60) { doc.addPage(); y = tableHeader(doc, 50, tableWidth, cols); }
      y = tableRow(doc, y, tableWidth, cols,
        [String(r.serialNo ?? ''), String(r.epfNo ?? ''), String(r.name ?? '')], i % 2 === 0);
    });
    printFooter(doc);
    doc.end();
    return;
  }

  // ── Absence Report ──────────────────────────────────────────────────────────
  if (reportType === 'absence') {
    const cols = [
      { label: '#',      width: 50 },
      { label: 'EPF NO', width: 110 },
      { label: 'NAME',   width: tableWidth - 160 },
    ];
    aaslHeader(doc, 'ABSENCE REPORT');
    divisionBlock(doc, filter);

    if (filter.fromDate) {
      doc.fontSize(10).font('Helvetica');
      doc.text(`FROM : ${filter.fromDate}  TO : ${filter.toDate ?? ''}`, LEFT, doc.y, { align: 'left' });
      doc.moveDown(0.5);
    }

    let y = tableHeader(doc, doc.y, tableWidth, cols);
    records.forEach((r, i) => {
      if (y + 20 > doc.page.height - 60) { doc.addPage(); y = tableHeader(doc, 50, tableWidth, cols); }
      y = tableRow(doc, y, tableWidth, cols,
        [String(i + 1), String(r.badgeNumber ?? ''), String(r.name ?? '')], i % 2 === 0);
    });
    printFooter(doc);
    doc.end();
    return;
  }

  // ── Monthly Attendance ──────────────────────────────────────────────────────
  if (reportType === 'monthly') {
    const cols = [
      { label: 'EPF NO',      width: 90 },
      { label: 'NAME',        width: 185 },
      { label: 'MONTH',       width: 100 },
      { label: 'DAYS PRESENT', width: tableWidth - 375 },
    ];
    aaslHeader(doc, 'MONTHLY ATTENDANCE REPORT');
    divisionBlock(doc, filter);

    if (filter.fromDate) {
      doc.fontSize(10).font('Helvetica');
      doc.text(`MONTH : ${filter.fromDate?.slice(0, 7) ?? ''}`, LEFT, doc.y);
      doc.moveDown(0.5);
    }

    let y = tableHeader(doc, doc.y, tableWidth, cols);
    records.forEach((r, i) => {
      if (y + 20 > doc.page.height - 60) { doc.addPage(); y = tableHeader(doc, 50, tableWidth, cols); }
      y = tableRow(doc, y, tableWidth, cols,
        [String(r.badgeNumber ?? ''), String(r.name ?? ''), String(r.month ?? ''), String(r.daysPresent ?? '')],
        i % 2 === 0);
    });
    printFooter(doc);
    doc.end();
    return;
  }

  // ── Daily Attendance (default) ──────────────────────────────────────────────
  const cols = [
    { label: 'EPF NO', width: 80 },
    { label: 'NAME',   width: 185 },
    { label: 'DATE',   width: 90 },
    { label: 'TIME',   width: 80 },
    { label: 'TYPE',   width: tableWidth - 435 },
  ];

  aaslHeader(doc, 'DAILY ATTENDANCE REPORT');
  divisionBlock(doc, filter);

  if (filter.fromTime || filter.toTime) {
    doc.fontSize(10).font('Helvetica');
    doc.text(`FROM : ${filter.fromTime ?? '00:00'}   TO : ${filter.toTime ?? '23:59'}`, LEFT, doc.y);
    doc.moveDown(0.5);
  }

  let y = tableHeader(doc, doc.y, tableWidth, cols);
  records.forEach((r, i) => {
    if (y + 20 > doc.page.height - 60) { doc.addPage(); y = tableHeader(doc, 50, tableWidth, cols); }
    const d = new Date(r.checkTime);
    y = tableRow(doc, y, tableWidth, cols,
      [
        String(r.badgeNumber ?? r.userId ?? ''),
        String(r.name ?? ''),
        isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-GB'),
        isNaN(d.getTime()) ? '-' : d.toLocaleTimeString('en-GB'),
        r.checkTypeDisplay ?? (r.checkType === 'I' ? 'IN' : 'OUT'),
      ],
      i % 2 === 0,
    );
  });
  printFooter(doc);
  doc.end();
}

// ── Serial EPF standalone (endpoint compat) ───────────────────────────────────
export function generateSerialEpfPdf(records: SerialEpfRecord[], res: Response) {
  generateFormattedReportPdf(records, 'serial', {}, res);
}
