export class UpdateSchClassDto {
  schName?: string;
  startTime?: Date;
  endTime?: Date;
  lateMinutes?: number;
  earlyMinutes?: number;
  checkIn?: number;
  checkOut?: number;
  workDay?: number;
  workMins?: number;
}
