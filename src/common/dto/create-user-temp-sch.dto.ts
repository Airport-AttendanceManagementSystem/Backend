export class CreateUserTempSchDto {
  userId: number;
  comeTime: Date;
  leaveTime: Date;
  overtime?: number;
  type?: number;
  flag?: number;
  schClassId?: number;
}
