import { Entity, PrimaryColumn } from 'typeorm';

@Entity('useracmachines')
export class UserAcMachines {
  @PrimaryColumn({ name: 'UserID', type: 'int' })
  userId: number;

  @PrimaryColumn({ name: 'Deviceid', type: 'int' })
  deviceId: number;
}
