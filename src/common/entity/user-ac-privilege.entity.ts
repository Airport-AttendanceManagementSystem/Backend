import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('useracprivilege')
export class UserAcPrivilege {
  @PrimaryColumn({ name: 'UserID', type: 'int' })
  userId: number;

  @PrimaryColumn({ name: 'DeviceID', type: 'int' })
  deviceId: number;

  @Column({ name: 'ACGroupID', type: 'int', nullable: true })
  acGroupId: number;

  @Column({ name: 'IsUseGroup', type: 'tinyint', nullable: true })
  isUseGroup: number;

  @Column({ name: 'TimeZone1', type: 'int', nullable: true })
  timeZone1: number;

  @Column({ name: 'TimeZone2', type: 'int', nullable: true })
  timeZone2: number;

  @Column({ name: 'TimeZone3', type: 'int', nullable: true })
  timeZone3: number;

  @Column({ name: 'verifystyle', type: 'int', nullable: true })
  verifyStyle: number;
}
