import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from 'docx';
import { AttendanceReportRawData } from '../interfaces/attendance-report.interface'; // Interface එක import කළා

export async function generateWord(
  records: AttendanceReportRawData[],
): Promise<Buffer> {
  const headerRow = new TableRow({
    children: ['Badge Number', 'Name', 'Check Time', 'Type'].map(
      (text) =>
        new TableCell({
          children: [
            new Paragraph({ children: [new TextRun({ text, bold: true })] }),
          ],
        }),
    ),
  });

  const dataRows = records.map((r) => {
    const displayType = r.checkType === 'I' ? 'IN' : 'OUT';
    return new TableRow({
      children: [
        r.badgeNumber || '-',
        r.employeeName || '-',
        new Date(r.checkTime).toLocaleString(),
        displayType,
      ].map(
        (text) => new TableCell({ children: [new Paragraph(String(text))] }),
      ),
    });
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: 'Attendance Report', heading: 'Heading1' }),
          new Table({ rows: [headerRow, ...dataRows] }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
