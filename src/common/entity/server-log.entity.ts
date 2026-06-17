import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('serverlog')
export class ServerLog {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'EVENT', type: 'varchar', length: 30 })
  event: string;

  @Column({ name: 'USERID', type: 'int' })
  userId: number;

  @Column({ name: 'EnrollNumber', type: 'varchar', length: 30, nullable: true })
  enrollNumber: string;

  @Column({ name: 'parameter', type: 'smallint', nullable: true })
  parameter: number;

  @Column({ name: 'EVENTTIME', type: 'datetime' })
  eventTime: Date;

  @Column({ name: 'SENSORID', type: 'varchar', length: 5, nullable: true })
  sensorId: string;

  @Column({ name: 'OPERATOR', type: 'varchar', length: 20, nullable: true })
  operator: string;
}
