import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('machines')
export class Machine {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'MachineAlias', type: 'varchar', length: 20 })
  machineAlias: string;

  @Column({ name: 'ConnectType', type: 'int' })
  connectType: number;

  @Column({ name: 'IP', type: 'varchar', length: 20, nullable: true })
  ip: string;

  @Column({ name: 'SerialPort', type: 'int', default: 1 })
  serialPort: number;

  @Column({ name: 'Port', type: 'int', default: 1 })
  port: number;

  @Column({ name: 'Baudrate', type: 'int', nullable: true })
  baudrate: number;

  @Column({ name: 'MachineNumber', type: 'int', default: 1 })
  machineNumber: number;

  @Column({ name: 'IsHost', type: 'tinyint', nullable: true })
  isHost: number;

  @Column({ name: 'Enabled', type: 'tinyint', nullable: true })
  enabled: number;

  @Column({ name: 'CommPassword', type: 'varchar', length: 12, nullable: true })
  commPassword: string;

  @Column({ name: 'FirmwareVersion', type: 'varchar', length: 20, nullable: true })
  firmwareVersion: string;

  @Column({ name: 'ProductType', type: 'varchar', length: 20, nullable: true })
  productType: string;

  @Column({ name: 'Purpose', type: 'smallint', default: 1 })
  purpose: number;

  @Column({ name: 'sn', type: 'varchar', length: 20, nullable: true })
  sn: string;

  @Column({ name: 'IsAndroid', type: 'varchar', length: 1, default: '0' })
  isAndroid: string;
}
