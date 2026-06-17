import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CheckInOut } from '@common/entity/checkinout.entity';
import { GetAttendanceReportDto } from '@modules/attendance-settings/dto/get-attendance-report.dto';

@Injectable()
export class AttendanceReportRepository extends Repository<CheckInOut> {
  constructor(private dataSource: DataSource) {
    super(CheckInOut, dataSource.createEntityManager());
  }

  async getOptimizedReport(filters: GetAttendanceReportDto): Promise<any[]> {
    const query = this.createQueryBuilder('c')
      .innerJoin('userinfo', 'u', 'u.USERID = c.USERID')
      .select([
        'c.USERID as userId',
        'u.BADGENUMBER as badgeNumber',
        'u.NAME as name',
        'c.CHECKTIME as checkTime',
        'c.CHECKTYPE as checkType',
      ]);

    if (filters.deptId) {
      query.andWhere('u.DEFAULTDEPTID = :deptId', { deptId: filters.deptId });
    }

    if (filters.badgeNumber) {
      query.andWhere('u.BADGENUMBER LIKE :epf', {
        epf: `%${filters.badgeNumber}%`,
      });
    }

    if (filters.checkType) {
      let dbCheckType = filters.checkType.toUpperCase();
      if (dbCheckType === 'IN') dbCheckType = 'I';
      if (dbCheckType === 'OUT') dbCheckType = 'O';
      query.andWhere('c.CHECKTYPE = :type', { type: dbCheckType });
    }

    if (filters.fromDate && filters.toDate) {
      const fromDateTime = `${filters.fromDate} ${filters.fromTime || '00:00:00'}`;
      const toDateTime = `${filters.toDate} ${filters.toTime || '23:59:59'}`;
      query.andWhere(
        'c.CHECKTIME >= :fromDateTime AND c.CHECKTIME <= :toDateTime',
        {
          fromDateTime,
          toDateTime,
        },
      );
    }

    query.orderBy('c.CHECKTIME', 'DESC');

    return await query.getRawMany();
  }
}
