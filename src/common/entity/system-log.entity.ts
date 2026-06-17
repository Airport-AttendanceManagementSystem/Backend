import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('systemlog')
export class SystemLog {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'Operator', type: 'varchar', length: 20, nullable: true })
  operator: string;

  @Column({ name: 'LogTime', type: 'datetime', nullable: true })
  logTime: Date;

  @Column({ name: 'MachineAlias', type: 'varchar', length: 20, nullable: true })
  machineAlias: string;

  @Column({ name: 'LogTag', type: 'smallint', nullable: true })
  logTag: number;

  @Column({ name: 'LogDescr', type: 'varchar', length: 50, nullable: true })
  logDescr: string;
}
