import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('checkinoutaudit')
export class CheckInOutAudit {
  @PrimaryColumn({ name: 'USERID', type: 'int' })
  userId: number;

  @PrimaryColumn({ name: 'CHECKTIME', type: 'datetime' })
  checkTime: Date;

  @Column({ name: 'CHECKTYPE', type: 'varchar', length: 1, nullable: true })
  checkType: string;

  @Column({ name: 'VERIFYCODE', type: 'int', nullable: true })
  verifyCode: number;

  @Column({ name: 'SENSORID', type: 'varchar', length: 5, nullable: true })
  sensorId: string;

  @Column({ name: 'Memoinfo', type: 'varchar', length: 30, nullable: true })
  memoInfo: string;

  @Column({ name: 'WorkCode', type: 'int', nullable: true })
  workCode: number;

  @Column({ name: 'sn', type: 'varchar', length: 20, nullable: true })
  sn: string;

  @Column({ name: 'UserExtFmt', type: 'smallint', nullable: true })
  userExtFmt: number;

  @Column({ name: 'Modifiedby', type: 'varchar', length: 30, nullable: true })
  modifiedBy: string;

  @Column({ name: 'ModifiedDate', type: 'datetime', nullable: true })
  modifiedDate: Date;

  @Column({ name: 'CHECKTIMEModified', type: 'datetime' })
  checkTimeModified: Date;
}
