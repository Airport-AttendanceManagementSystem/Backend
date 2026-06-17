export class CreateDepartmentDto {
  deptName: string;
  supDeptId?: number;
  defaultSchId?: number;
  inLate?: number;
  outEarly?: number;
  att?: number;
  holiday?: number;
  overTime?: number;
}
