import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user_temp_sch')
export class UserTempSch {
  @PrimaryColumn({ name: 'USERID', type: 'int' })
  userId: number;

  @PrimaryColumn({ name: 'COMETIME', type: 'datetime' })
  comeTime: Date;

  @PrimaryColumn({ name: 'LEAVETIME', type: 'datetime' })
  leaveTime: Date;

  @Column({ name: 'OVERTIME', type: 'int', default: 0 })
  overtime: number;

  @Column({ name: 'TYPE', type: 'smallint', default: 0 })
  type: number;

  @Column({ name: 'FLAG', type: 'smallint', default: 1 })
  flag: number;

  @Column({ name: 'SCHCLASSID', type: 'int', default: -1 })
  schClassId: number;
}
