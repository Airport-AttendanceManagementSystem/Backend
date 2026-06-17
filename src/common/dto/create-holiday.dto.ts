export class CreateHolidayDto {
  holidayName: string;
  holidayYear: number;
  holidayMonth: number;
  holidayDay: number;
  startTime?: Date;
  duration?: number;
  holidayType?: number;
  deptId?: number;
  timezone?: number;
}
