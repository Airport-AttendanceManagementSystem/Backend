import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users_tb')
export class UsersTb {
  @PrimaryColumn({ name: 'userName', type: 'varchar', length: 50 })
  userName: string;

  @Column({ name: 'password', type: 'nvarchar', length: 'max' as any, nullable: true })
  password: string;

  @Column({ name: 'userType', type: 'varchar', length: 50, nullable: true })
  userType: string;

  @Column({ name: 'userStatus', type: 'varchar', length: 10, nullable: true })
  userStatus: string;

  @Column({ name: 'firstName', type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ name: 'lastName', type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email: string;
}
