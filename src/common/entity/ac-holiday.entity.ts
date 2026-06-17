import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('acholiday')
export class AcHoliday {
  @PrimaryGeneratedColumn({ name: 'primaryid' })
  primaryId: number;

  @Column({ name: 'holidayid', type: 'int', nullable: true })
  holidayId: number;

  @Column({ name: 'begindate', type: 'datetime', nullable: true })
  beginDate: Date;

  @Column({ name: 'enddate', type: 'datetime', nullable: true })
  endDate: Date;

  @Column({ name: 'timezone', type: 'int', nullable: true })
  timezone: number;
}
