import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('emoplog')
export class EmOpLog {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'USERID', type: 'int' })
  userId: number;

  @Column({ name: 'OperateTime', type: 'datetime' })
  operateTime: Date;

  @Column({ name: 'manipulationID', type: 'int', nullable: true })
  manipulationId: number;

  @Column({ name: 'Params1', type: 'int', nullable: true })
  params1: number;

  @Column({ name: 'Params2', type: 'int', nullable: true })
  params2: number;

  @Column({ name: 'Params3', type: 'int', nullable: true })
  params3: number;

  @Column({ name: 'Params4', type: 'int', nullable: true })
  params4: number;

  @Column({ name: 'SensorId', type: 'varchar', length: 5, nullable: true })
  sensorId: string;
}
