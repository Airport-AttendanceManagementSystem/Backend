import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DEPARTMENTS')
export class Department {
  @PrimaryGeneratedColumn({ name: 'DEPTID' })
  deptId: number;

  @Column({ name: 'DEPTNAME', type: 'varchar', length: 30, nullable: true })
  deptName: string;

  @Column({ name: 'SUPDEPTID', type: 'int', default: 1 })
  supDeptId: number;

  @Column({ name: 'InheritParentSch', type: 'smallint', default: 1 })
  inheritParentSch: number;

  @Column({ name: 'InheritDeptSch', type: 'smallint', default: 1 })
  inheritDeptSch: number;

  @Column({ name: 'InheritDeptSchClass', type: 'smallint', default: 1 })
  inheritDeptSchClass: number;

  @Column({ name: 'AutoSchPlan', type: 'smallint', default: 1 })
  autoSchPlan: number;

  @Column({ name: 'InLate', type: 'smallint', default: 1 })
  inLate: number;

  @Column({ name: 'OutEarly', type: 'smallint', default: 1 })
  outEarly: number;

  @Column({ name: 'InheritDeptRule', type: 'smallint', default: 1 })
  inheritDeptRule: number;

  @Column({ name: 'MinAutoSchInterval', type: 'int', default: 24 })
  minAutoSchInterval: number;

  @Column({ name: 'RegisterOT', type: 'smallint', default: 1 })
  registerOt: number;

  @Column({ name: 'DefaultSchId', type: 'int', default: 1 })
  defaultSchId: number;

  @Column({ name: 'ATT', type: 'smallint', default: 1 })
  att: number;

  @Column({ name: 'Holiday', type: 'smallint', default: 1 })
  holiday: number;

  @Column({ name: 'OverTime', type: 'smallint', default: 1 })
  overTime: number;
}
