// Import කරන විදිය වෙනස් කළා (CommonJS ක්‍රමයට)
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFDocument = require('pdfkit');
import { Response } from 'express';
import { AttendanceReportRawData } from '../interfaces/attendance-report.interface';

export function generatePdf(records: AttendanceReportRawData[], res: Response) {
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=attendance-report.pdf',
  );

  doc.pipe(res);
  doc.fontSize(16).text('Attendance Report', { align: 'center' });
  doc.moveDown();

  records.forEach((r) => {
    const displayType = r.checkType === 'I' ? 'IN' : 'OUT';
    doc
      .fontSize(10)
      .text(
        `${r.badgeNumber || '-'} | ${r.employeeName || '-'} | ${new Date(r.checkTime).toLocaleString()} | ${displayType}`,
      );
  });

  doc.end();
}
