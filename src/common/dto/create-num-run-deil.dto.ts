export class CreateNumRunDeilDto {
  numRunId: number;
  startTime: Date;
  sDays: number;
  endTime?: Date;
  eDays?: number;
  schClassId?: number;
  overTime?: number;
}
