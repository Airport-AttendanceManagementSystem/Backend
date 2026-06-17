export interface AttendanceReportRawData {
  userId: number;
  badgeNumber: string;
  employeeName: string;
  checkTime: Date;
  checkType: string;
  sensorId: string;
  departmentId: number;
}
