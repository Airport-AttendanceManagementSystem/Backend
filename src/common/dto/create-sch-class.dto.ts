export class CreateSchClassDto {
  schName: string;
  startTime: Date;
  endTime: Date;
  lateMinutes?: number;
  earlyMinutes?: number;
  checkIn?: number;
  checkOut?: number;
  checkInTime1?: Date;
  checkInTime2?: Date;
  checkOutTime1?: Date;
  checkOutTime2?: Date;
  workDay?: number;
  workMins?: number;
  sensorId?: string;
}
