import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usersmachines')
export class UsersMachines {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'USERID', type: 'int' })
  userId: number;

  @Column({ name: 'DEVICEID', type: 'int' })
  deviceId: number;
}
