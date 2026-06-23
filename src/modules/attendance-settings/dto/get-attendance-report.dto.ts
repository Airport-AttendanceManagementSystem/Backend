import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAttendanceReportDto {
  @IsOptional()
  @IsString()
  reportType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  deptId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  section?: number;

  @IsOptional()
  @IsString()
  checkType?: string; // 'IN' or 'OUT'

  @IsOptional()
  @IsString()
  badgeNumber?: string; // EPF Number

  @IsOptional()
  @IsString()
  fromDate?: string; // 'YYYY-MM-DD'

  @IsOptional()
  @IsString()
  fromTime?: string; // 'HH:mm'

  @IsOptional()
  @IsString()
  toDate?: string; // 'YYYY-MM-DD'

  @IsOptional()
  @IsString()
  toTime?: string; // 'HH:mm'

  @IsOptional()
  @IsString()
  deptName?: string;

  @IsOptional()
  @IsString()
  sectionName?: string;
}
