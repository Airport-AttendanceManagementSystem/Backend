import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { generateCsv } from './exporters/csv-exporter';
import {
  generateFormattedReportPdf,
  generateMonthlyMatrixPdf,
} from './exporters/pdf-exporter';
import { generateFormattedReportWord } from './exporters/word-exporter';
import { GetAttendanceReportDto } from '@modules/attendance-settings/dto/get-attendance-report.dto';
import { AttendanceReportService } from '@modules/attendance-settings/attendance-setting.service';

@Controller('attendance-report')
export class AttendanceReportController {
  constructor(private readonly service: AttendanceReportService) {}

  @Get()
  generateReport(@Query() filter: GetAttendanceReportDto) {
    return this.service.generateReport(filter);
  }

  @Get('export/csv')
  async exportCsv(
    @Query() filter: GetAttendanceReportDto,
    @Res() res: Response,
  ) {
    const { records } = await this.service.generateReport(filter);
    const csv = generateCsv(records);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=attendance-report.csv',
    );
    res.send(csv);
  }

  @Get('export/pdf')
  async exportPdf(
    @Query() filter: GetAttendanceReportDto,
    @Res() res: Response,
  ) {
    const type = (filter.reportType ?? '').toLowerCase();
    if (type.includes('monthly')) {
      const rawRecords = await this.service.getMonthlyPdfRecords(filter);
      generateMonthlyMatrixPdf(rawRecords, filter as any, res);
      return;
    }
    const { records, reportType } = await this.service.generateReport(filter);
    generateFormattedReportPdf(
      records,
      reportType ?? 'daily',
      filter as any,
      res,
    );
  }

  @Get('export/word')
  async exportWord(
    @Query() filter: GetAttendanceReportDto,
    @Res() res: Response,
  ) {
    const { records, reportType } = await this.service.generateReport(filter);
    const buffer = await generateFormattedReportWord(
      records,
      reportType ?? 'daily',
      filter as any,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=attendance-report.docx',
    );
    res.send(buffer);
  }

  @Get('export/serial-epf-pdf')
  async exportSerialEpfPdf(
    @Query() filter: GetAttendanceReportDto,
    @Res() res: Response,
  ) {
    const overrideFilter = { ...filter, reportType: 'serial' };
    const { records } = await this.service.generateReport(overrideFilter);
    generateFormattedReportPdf(records, 'serial', filter as any, res);
  }
}
