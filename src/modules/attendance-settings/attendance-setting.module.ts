import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInOut } from '../../common/entity/checkinout.entity';
import { UserInfo } from '../../common/entity/userinfo.entity';
import { AttendanceReportController } from '@modules/attendance-settings/attendance-setting.controller';
import { AttendanceReportService } from '@modules/attendance-settings/attendance-setting.service';
import { AttendanceReportRepository } from '@modules/attendance-settings/repository/attendance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CheckInOut, UserInfo])],
  controllers: [AttendanceReportController],
  providers: [AttendanceReportService, AttendanceReportRepository],
  exports: [AttendanceReportService],
})
export class AttendanceReportModule {}
