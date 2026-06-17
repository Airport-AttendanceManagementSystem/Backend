import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shift')
export class Shift {
  @PrimaryGeneratedColumn({ name: 'SHIFTID' })
  shiftId: number;

  @Column({ name: 'NAME', type: 'varchar', length: 20, nullable: true })
  name: string;

  @Column({ name: 'USHIFTID', type: 'int', default: -1 })
  uShiftId: number;

  @Column({ name: 'STARTDATE', type: 'datetime' })
  startDate: Date;

  @Column({ name: 'ENDDATE', type: 'datetime', nullable: true })
  endDate: Date;

  @Column({ name: 'RUNNUM', type: 'smallint', default: 0 })
  runNum: number;

  @Column({ name: 'SCH1', type: 'int', default: 0 })
  sch1: number;

  @Column({ name: 'SCH2', type: 'int', default: 0 })
  sch2: number;

  @Column({ name: 'SCH3', type: 'int', default: 0 })
  sch3: number;

  @Column({ name: 'CYCLE', type: 'smallint', default: 0 })
  cycle: number;

  @Column({ name: 'UNITS', type: 'smallint', default: 0 })
  units: number;
}
