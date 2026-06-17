import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('holidays')
export class Holiday {
  @PrimaryGeneratedColumn({ name: 'HOLIDAYID' })
  holidayId: number;

  @Column({ name: 'HOLIDAYNAME', type: 'varchar', length: 20, nullable: true })
  holidayName: string;

  @Column({ name: 'HOLIDAYYEAR', type: 'smallint', nullable: true })
  holidayYear: number;

  @Column({ name: 'HOLIDAYMONTH', type: 'smallint', nullable: true })
  holidayMonth: number;

  @Column({ name: 'HOLIDAYDAY', type: 'smallint', default: 1 })
  holidayDay: number;

  @Column({ name: 'STARTTIME', type: 'datetime', nullable: true })
  startTime: Date;

  @Column({ name: 'DURATION', type: 'smallint', nullable: true })
  duration: number;

  @Column({ name: 'HOLIDAYTYPE', type: 'smallint', nullable: true })
  holidayType: number;

  @Column({ name: 'XINBIE', type: 'varchar', length: 4, nullable: true })
  xinbie: string;

  @Column({ name: 'MINZU', type: 'varchar', length: 50, nullable: true })
  minzu: string;

  @Column({ name: 'DeptID', type: 'smallint', default: 1 })
  deptId: number;

  @Column({ name: 'timezone', type: 'int', default: 0 })
  timezone: number;
}
