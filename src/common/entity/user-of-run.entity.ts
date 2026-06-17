import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user_of_run')
export class UserOfRun {
  @PrimaryColumn({ name: 'USERID', type: 'int' })
  userId: number;

  @PrimaryColumn({ name: 'NUM_OF_RUN_ID', type: 'int' })
  numOfRunId: number;

  @PrimaryColumn({ name: 'STARTDATE', type: 'datetime' })
  startDate: Date;

  @PrimaryColumn({ name: 'ENDDATE', type: 'datetime' })
  endDate: Date;

  @Column({ name: 'ISNOTOF_RUN', type: 'int', default: 0 })
  isNotOfRun: number;

  @Column({ name: 'ORDER_RUN', type: 'int', nullable: true })
  orderRun: number;
}
