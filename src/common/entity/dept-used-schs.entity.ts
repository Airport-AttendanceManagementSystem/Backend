import { Entity, PrimaryColumn } from 'typeorm';

@Entity('deptusedschs')
export class DeptUsedSchs {
  @PrimaryColumn({ name: 'DeptId', type: 'int' })
  deptId: number;

  @PrimaryColumn({ name: 'SchId', type: 'int' })
  schId: number;
}
