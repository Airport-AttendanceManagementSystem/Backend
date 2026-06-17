import { Injectable } from '@nestjs/common';
import { AttendanceReportRepository } from '@modules/attendance-settings/repository/attendance.repository';
import { GetAttendanceReportDto } from '@modules/attendance-settings/dto/get-attendance-report.dto';

@Injectable()
export class AttendanceReportService {
  constructor(private readonly attendanceRepo: AttendanceReportRepository) {}

  async generateReport(filter: GetAttendanceReportDto) {
    const records = await this.attendanceRepo.getOptimizedReport(filter);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const enriched = records.map((r) => ({
      ...r,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      checkTypeDisplay: r.checkType === 'I' ? 'IN' : 'OUT',
    }));

    return {
      total: enriched.length,
      records: enriched,
    };
  }
}
