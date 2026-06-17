import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('aasl-delete-checkinout')
export class AaslDeleteCheckinEntity {
  @PrimaryGeneratedColumn({ name: 'USERID', type: 'int' })
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
}