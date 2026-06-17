import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('checkinout')
export class CheckInOut {
  @PrimaryColumn({ name: 'USERID', type: 'int' })
  userId: number;

  @PrimaryColumn({ name: 'CHECKTIME', type: 'datetime' })
  checkTime: Date;

  @Column({ name: 'CHECKTYPE', type: 'varchar', length: 1, default: 'I' })
  checkType: string;

  @Column({ name: 'VERIFYCODE', type: 'int', default: 0 })
  verifyCode: number;

  @Column({ name: 'SENSORID', type: 'varchar', length: 5, nullable: true })
  sensorId: string;

  @Column({ name: 'Memoinfo', type: 'varchar', length: 30, nullable: true })
  memoInfo: string;

  @Column({ name: 'WorkCode', type: 'int', default: 0 })
  workCode: number;

  @Column({ name: 'sn', type: 'varchar', length: 20, nullable: true })
  sn: string;

  @Column({ name: 'UserExtFmt', type: 'smallint', default: 0 })
  userExtFmt: number;
}
