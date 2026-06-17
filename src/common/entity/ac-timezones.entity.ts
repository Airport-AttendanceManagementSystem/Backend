import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('actimezones')
export class AcTimezones {
  @PrimaryColumn({ name: 'TimeZoneID', type: 'smallint' })
  timeZoneId: number;

  @Column({ name: 'Name', type: 'varchar', length: 30, nullable: true })
  name: string;

  @Column({ name: 'SunStart', type: 'datetime', nullable: true })
  sunStart: Date;

  @Column({ name: 'SunEnd', type: 'datetime', nullable: true })
  sunEnd: Date;

  @Column({ name: 'MonStart', type: 'datetime', nullable: true })
  monStart: Date;

  @Column({ name: 'MonEnd', type: 'datetime', nullable: true })
  monEnd: Date;

  @Column({ name: 'TuesStart', type: 'datetime', nullable: true })
  tuesStart: Date;

  @Column({ name: 'TuesEnd', type: 'datetime', nullable: true })
  tuesEnd: Date;

  @Column({ name: 'WedStart', type: 'datetime', nullable: true })
  wedStart: Date;

  @Column({ name: 'WedEnd', type: 'datetime', nullable: true })
  wedEnd: Date;

  @Column({ name: 'ThursStart', type: 'datetime', nullable: true })
  thursStart: Date;

  @Column({ name: 'ThursEnd', type: 'datetime', nullable: true })
  thursEnd: Date;

  @Column({ name: 'FriStart', type: 'datetime', nullable: true })
  friStart: Date;

  @Column({ name: 'FriEnd', type: 'datetime', nullable: true })
  friEnd: Date;

  @Column({ name: 'SatStart', type: 'datetime', nullable: true })
  satStart: Date;

  @Column({ name: 'SatEnd', type: 'datetime', nullable: true })
  satEnd: Date;
}
