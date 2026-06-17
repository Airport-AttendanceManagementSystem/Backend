import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('temp_userinfo')
export class TempUserInfo {
  @PrimaryGeneratedColumn({ name: 'USERID' })
  userId: number;

  @Column({ name: 'BADGENUMBER', type: 'varchar', length: 24 })
  badgeNumber: string;

  @Column({ name: 'SSN', type: 'varchar', length: 20, nullable: true })
  ssn: string;

  @Column({ name: 'NAME', type: 'varchar', length: 24, nullable: true })
  name: string;

  @Column({ name: 'GENDER', type: 'varchar', length: 8, nullable: true })
  gender: string;

  @Column({ name: 'TITLE', type: 'varchar', length: 20, nullable: true })
  title: string;

  @Column({ name: 'BIRTHDAY', type: 'datetime', nullable: true })
  birthday: Date;

  @Column({ name: 'HIREDDAY', type: 'datetime', nullable: true })
  hiredDay: Date;

  @Column({ name: 'DEFAULTDEPTID', type: 'smallint', nullable: true })
  defaultDeptId: number;

  @Column({ name: 'ATT', type: 'smallint' })
  att: number;

  @Column({ name: 'PASSWORD', type: 'varchar', length: 50, nullable: true })
  password: string;

  @Column({ name: 'CardNo', type: 'varchar', length: 20, nullable: true })
  cardNo: string;

  @Column({ name: 'privilege', type: 'int', nullable: true })
  privilege: number;
}
