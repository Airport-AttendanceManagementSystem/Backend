import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('aasluser')
export class AaslUser {
  @PrimaryColumn({ name: 'username', type: 'varchar', length: 100 })
  username: string;

  @Column({ name: 'password', type: 'varchar', length: 100, nullable: true })
  password: string;

  @Column({ name: 'usertype', type: 'varchar', length: 50, nullable: true })
  userType: string;

  @Column({ name: 'userstatus', type: 'int', nullable: true })
  userStatus: number;

  @Column({ name: 'deptid', type: 'int', nullable: true })
  deptId: number;
}
