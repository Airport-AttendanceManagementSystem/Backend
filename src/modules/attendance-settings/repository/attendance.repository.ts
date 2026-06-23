import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CheckInOut } from '@common/entity/checkinout.entity';
import { GetAttendanceReportDto } from '@modules/attendance-settings/dto/get-attendance-report.dto';

@Injectable()
export class AttendanceReportRepository extends Repository<CheckInOut> {
  constructor(private dataSource: DataSource) {
    super(CheckInOut, dataSource.createEntityManager());
  }

  // ── Daily / default ──────────────────────────────────────────────────────────
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

    if (filters.section) {
      query.andWhere('u.DEFAULTDEPTID = :section', { section: filters.section });
    } else if (filters.deptId) {
      query.andWhere('u.DEFAULTDEPTID = :deptId', { deptId: filters.deptId });
    }

    if (filters.badgeNumber) {
      query.andWhere('u.BADGENUMBER LIKE :epf', { epf: `%${filters.badgeNumber}%` });
    }

    if (filters.checkType) {
      let dbCheckType = filters.checkType.toUpperCase();
      if (dbCheckType === 'IN')  dbCheckType = 'I';
      if (dbCheckType === 'OUT') dbCheckType = 'O';
      query.andWhere('c.CHECKTYPE = :type', { type: dbCheckType });
    }

    if (filters.fromDate && filters.toDate) {
      const from = `${filters.fromDate} ${filters.fromTime || '00:00:00'}`;
      const to   = `${filters.toDate}   ${filters.toTime   || '23:59:59'}`;
      query.andWhere('c.CHECKTIME >= :from AND c.CHECKTIME <= :to', { from, to });
    }

    query.orderBy('c.CHECKTIME', 'DESC');
    return query.getRawMany();
  }

  // ── Serial / EPF ─────────────────────────────────────────────────────────────
  async getSerialEpfReport(filters: GetAttendanceReportDto): Promise<any[]> {
    const query = this.dataSource
      .createQueryBuilder()
      .select('u.USERID',      'serialNo')
      .addSelect('u.BADGENUMBER', 'epfNo')
      .addSelect('u.NAME',        'name')
      .from('userinfo', 'u')
      .where('u.ATT = 1');

    if (filters.section) {
      query.andWhere('u.DEFAULTDEPTID = :section', { section: filters.section });
    } else if (filters.deptId) {
      query.andWhere('u.DEFAULTDEPTID = :deptId', { deptId: filters.deptId });
    }

    if (filters.badgeNumber) {
      query.andWhere('u.BADGENUMBER LIKE :epf', { epf: `%${filters.badgeNumber}%` });
    }

    query.orderBy('u.USERID', 'ASC');
    return query.getRawMany();
  }

  // ── Absence Report ───────────────────────────────────────────────────────────
  async getAbsenceReport(filters: GetAttendanceReportDto): Promise<any[]> {
    if (!filters.fromDate || !filters.toDate) return [];

    const fromDate = filters.fromDate;
    const toDate   = filters.toDate;

    const query = this.dataSource
      .createQueryBuilder()
      .select('u.BADGENUMBER', 'badgeNumber')
      .addSelect('u.NAME',    'name')
      .from('userinfo', 'u')
      .where('u.ATT = 1')
      .andWhere(
        `NOT EXISTS (
          SELECT 1 FROM checkinout c
          WHERE c.USERID = u.USERID
            AND CAST(c.CHECKTIME AS DATE) >= CAST(:fromDate AS DATE)
            AND CAST(c.CHECKTIME AS DATE) <= CAST(:toDate AS DATE)
            AND c.CHECKTYPE = 'I'
        )`,
        { fromDate, toDate },
      );

    if (filters.section) {
      query.andWhere('u.DEFAULTDEPTID = :section', { section: filters.section });
    } else if (filters.deptId) {
      query.andWhere('u.DEFAULTDEPTID = :deptId', { deptId: filters.deptId });
    }

    if (filters.badgeNumber) {
      query.andWhere('u.BADGENUMBER LIKE :epf', { epf: `%${filters.badgeNumber}%` });
    }

    query.orderBy('u.NAME', 'ASC');
    return query.getRawMany();
  }

  // ── Monthly Attendance ───────────────────────────────────────────────────────
  async getMonthlyReport(filters: GetAttendanceReportDto): Promise<any[]> {
    if (!filters.fromDate || !filters.toDate) return [];

    const from = `${filters.fromDate} ${filters.fromTime || '00:00:00'}`;
    const to   = `${filters.toDate}   ${filters.toTime   || '23:59:59'}`;

    const query = this.dataSource
      .createQueryBuilder()
      .select('u.BADGENUMBER',                        'badgeNumber')
      .addSelect('u.NAME',                            'name')
      .addSelect("FORMAT(c.CHECKTIME, 'yyyy-MM')",    'month')
      .addSelect('COUNT(DISTINCT CAST(c.CHECKTIME AS DATE))', 'daysPresent')
      .from('checkinout', 'c')
      .innerJoin('userinfo', 'u', 'u.USERID = c.USERID')
      .where('c.CHECKTIME >= :from AND c.CHECKTIME <= :to', { from, to })
      .andWhere("c.CHECKTYPE = 'I'");

    if (filters.section) {
      query.andWhere('u.DEFAULTDEPTID = :section', { section: filters.section });
    } else if (filters.deptId) {
      query.andWhere('u.DEFAULTDEPTID = :deptId', { deptId: filters.deptId });
    }

    if (filters.badgeNumber) {
      query.andWhere('u.BADGENUMBER LIKE :epf', { epf: `%${filters.badgeNumber}%` });
    }

    query
      .groupBy('u.USERID')
      .addGroupBy('u.BADGENUMBER')
      .addGroupBy('u.NAME')
      .addGroupBy("FORMAT(c.CHECKTIME, 'yyyy-MM')")
      .orderBy('u.NAME', 'ASC')
      .addOrderBy("FORMAT(c.CHECKTIME, 'yyyy-MM')", 'ASC');

    return query.getRawMany();
  }
}
