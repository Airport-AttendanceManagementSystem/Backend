import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { generateCsv } from './exporters/csv-exporter';
import { generatePdf } from './exporters/pdf-exporter';
import { generateWord } from './exporters/word-exporter';
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
    const { records } = await this.service.generateReport(filter);
    generatePdf(records, res);
  }

  @Get('export/word')
  async exportWord(
    @Query() filter: GetAttendanceReportDto,
    @Res() res: Response,
  ) {
    const { records } = await this.service.generateReport(filter);
    const buffer = await generateWord(records);
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
}
