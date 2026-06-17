import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('alarmlog')
export class AlarmLog {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'Operator', type: 'varchar', length: 20, nullable: true })
  operator: string;

  @Column({ name: 'EnrollNumber', type: 'varchar', length: 30, nullable: true })
  enrollNumber: string;

  @Column({ name: 'LogTime', type: 'datetime', nullable: true })
  logTime: Date;

  @Column({ name: 'MachineAlias', type: 'varchar', length: 20, nullable: true })
  machineAlias: string;

  @Column({ name: 'AlarmType', type: 'int', nullable: true })
  alarmType: number;
}
