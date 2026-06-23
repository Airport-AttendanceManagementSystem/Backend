import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schclass')
export class SchClass {
  @PrimaryGeneratedColumn({ name: 'schClassid' })
  schClassId: number;

  @Column({ name: 'schName', type: 'varchar', length: 20 })
  schName: string;

  @Column({ name: 'StartTime', type: 'datetime' })
  startTime: Date;

  @Column({ name: 'EndTime', type: 'datetime' })
  endTime: Date;

  @Column({ name: 'LateMinutes', type: 'int', nullable: true })
  lateMinutes: number;

  @Column({ name: 'EarlyMinutes', type: 'int', nullable: true })
  earlyMinutes: number;

  @Column({ name: 'CheckIn', type: 'int', default: 1 })
  checkIn: number;

  @Column({ name: 'CheckOut', type: 'int', default: 1 })
  checkOut: number;

  @Column({ name: 'CheckInTime1', type: 'datetime', nullable: true })
  checkInTime1: Date;

  @Column({ name: 'CheckInTime2', type: 'datetime', nullable: true })
  checkInTime2: Date;

  @Column({ name: 'CheckOutTime1', type: 'datetime', nullable: true })
  checkOutTime1: Date;

  @Column({ name: 'CheckOutTime2', type: 'datetime', nullable: true })
  checkOutTime2: Date;

  @Column({ name: 'Color', type: 'int', default: 16715535 })
  color: number;

  @Column({ name: 'AutoBind', type: 'smallint', default: 1 })
  autoBind: number;

  @Column({ name: 'WorkDay', type: 'float', default: 1 })
  workDay: number;

  @Column({ name: 'SensorID', type: 'varchar', length: 5, nullable: true })
  sensorId: string;

  @Column({ name: 'WorkMins', type: 'float', default: 0 })
  workMins: number;
}
