import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('num_run_deil')
export class NumRunDeil {
  @PrimaryColumn({ name: 'NUM_RUNID', type: 'smallint' })
  numRunId: number;

  @PrimaryColumn({ name: 'STARTTIME', type: 'datetime' })
  startTime: Date;

  @PrimaryColumn({ name: 'SDAYS', type: 'smallint' })
  sDays: number;

  @Column({ name: 'ENDTIME', type: 'datetime', nullable: true })
  endTime: Date;

  @Column({ name: 'EDAYS', type: 'smallint', nullable: true })
  eDays: number;

  @Column({ name: 'SCHCLASSID', type: 'int', default: -1 })
  schClassId: number;

  @Column({ name: 'OverTime', type: 'int', nullable: true })
  overTime: number;
}
