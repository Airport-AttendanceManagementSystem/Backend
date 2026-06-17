export class CreateCheckInOutDto {
  userId: number;
  checkTime?: Date;
  checkType?: string;
  verifyCode?: number;
  sensorId?: string;
  memoInfo?: string;
  workCode?: number;
  sn?: string;
}
