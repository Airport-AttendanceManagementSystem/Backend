import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user_speday')
export class UserSpeDay {
  @PrimaryColumn({ name: 'USERID', type: 'int' })
  userId: number;

  @PrimaryColumn({ name: 'STARTSPECDAY', type: 'datetime' })
  startSpecDay: Date;

  @PrimaryColumn({ name: 'DATEID', type: 'smallint' })
  dateId: number;

  @Column({ name: 'ENDSPECDAY', type: 'datetime', nullable: true })
  endSpecDay: Date;

  @Column({ name: 'YUANYING', type: 'varchar', length: 200, nullable: true })
  yuanYing: string;

  @Column({ name: 'DATE', type: 'datetime', nullable: true })
  date: Date;
}
