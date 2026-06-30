import { Injectable } from '@nestjs/common';
import { AttendanceReportRepository } from '@modules/attendance-settings/repository/attendance.repository';
import { GetAttendanceReportDto } from '@modules/attendance-settings/dto/get-attendance-report.dto';

@Injectable()
export class AttendanceReportService {
  constructor(private readonly attendanceRepo: AttendanceReportRepository) {}

  async getMonthlyPdfRecords(filter: GetAttendanceReportDto) {
    return this.attendanceRepo.getMonthlyRawRecords(filter);
  }

  async generateReport(filter: GetAttendanceReportDto) {
    const type = (filter.reportType ?? '').toLowerCase();

    // ── Absence Report ──────────────────────────────────────────────────────
    if (type.includes('absence')) {
      const records = await this.attendanceRepo.getAbsenceReport(filter);
      return { reportType: 'absence', total: records.length, records };
    }

    // ── Monthly Attendance ──────────────────────────────────────────────────
    if (type.includes('monthly')) {
      const records = await this.attendanceRepo.getMonthlyReport(filter);
      return { reportType: 'monthly', total: records.length, records };
    }

    // ── Serial / EPF Report ─────────────────────────────────────────────────
    if (type.includes('serial')) {
      const records = await this.attendanceRepo.getSerialEpfReport(filter);
      return { reportType: 'serial', total: records.length, records };
    }

    // ── Daily Attendance / default ──────────────────────────────────────────
    const records = await this.attendanceRepo.getOptimizedReport(filter);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const enriched = records.map((r) => ({
      ...r,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      checkTypeDisplay: r.checkType === 'I' ? 'I' : 'O',
    }));
    return { reportType: 'daily', total: enriched.length, records: enriched };
  }
}
