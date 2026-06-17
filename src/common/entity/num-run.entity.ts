import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('num_run')
export class NumRun {
  @PrimaryGeneratedColumn({ name: 'NUM_RUNID' })
  numRunId: number;

  @Column({ name: 'OLDID', type: 'int', default: -1 })
  oldId: number;

  @Column({ name: 'NAME', type: 'varchar', length: 30 })
  name: string;

  @Column({ name: 'STARTDATE', type: 'datetime', nullable: true })
  startDate: Date;

  @Column({ name: 'ENDDATE', type: 'datetime', nullable: true })
  endDate: Date;

  @Column({ name: 'CYLE', type: 'smallint', default: 1 })
  cycle: number;

  @Column({ name: 'UNITS', type: 'smallint', default: 1 })
  units: number;
}
