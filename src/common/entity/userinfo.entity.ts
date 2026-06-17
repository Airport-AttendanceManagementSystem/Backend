import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('userinfo')
export class UserInfo {
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

  @Column({ name: 'PAGER', type: 'varchar', length: 20, nullable: true })
  pager: string;

  @Column({ name: 'BIRTHDAY', type: 'datetime', nullable: true })
  birthday: Date;

  @Column({ name: 'HIREDDAY', type: 'datetime', nullable: true })
  hiredDay: Date;

  @Column({ name: 'STREET', type: 'varchar', length: 80, nullable: true })
  street: string;

  @Column({ name: 'CITY', type: 'varchar', length: 2, nullable: true })
  city: string;

  @Column({ name: 'STATE', type: 'varchar', length: 2, nullable: true })
  state: string;

  @Column({ name: 'ZIP', type: 'varchar', length: 12, nullable: true })
  zip: string;

  @Column({ name: 'OPHONE', type: 'varchar', length: 20, nullable: true })
  officePhone: string;

  @Column({ name: 'FPHONE', type: 'varchar', length: 20, nullable: true })
  familyPhone: string;

  @Column({ name: 'DEFAULTDEPTID', type: 'smallint', default: 1 })
  defaultDeptId: number;

  @Column({ name: 'ATT', type: 'smallint', default: 1 })
  att: number;

  @Column({ name: 'INLATE', type: 'smallint', default: 1 })
  inLate: number;

  @Column({ name: 'OUTEARLY', type: 'smallint', default: 1 })
  outEarly: number;

  @Column({ name: 'OVERTIME', type: 'smallint', default: 1 })
  overtime: number;

  @Column({ name: 'SEP', type: 'smallint', default: 1 })
  sep: number;

  @Column({ name: 'HOLIDAY', type: 'smallint', default: 1 })
  holiday: number;

  @Column({ name: 'PASSWORD', type: 'varchar', length: 50, nullable: true })
  password: string;

  @Column({ name: 'CardNo', type: 'varchar', length: 20, nullable: true })
  cardNo: string;

  @Column({ name: 'privilege', type: 'int', default: 0 })
  privilege: number;

  @Column({ name: 'AccGroup', type: 'int', default: 1 })
  accGroup: number;

  @Column({ name: 'Pin1', type: 'int', nullable: true })
  pin1: number;
}
