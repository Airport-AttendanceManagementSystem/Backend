import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auditedexc')
export class AuditedExc {
  @PrimaryGeneratedColumn({ name: 'AEID' })
  aeId: number;

  @Column({ name: 'UserId', type: 'int', nullable: true })
  userId: number;

  @Column({ name: 'CheckTime', type: 'datetime' })
  checkTime: Date;

  @Column({ name: 'NewExcID', type: 'int', nullable: true })
  newExcId: number;

  @Column({ name: 'IsLeave', type: 'smallint', nullable: true })
  isLeave: number;

  @Column({ name: 'UName', type: 'varchar', length: 20, nullable: true })
  uName: string;

  @Column({ name: 'UTime', type: 'datetime' })
  uTime: Date;
}
