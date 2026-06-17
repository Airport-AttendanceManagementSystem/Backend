import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('acgroup')
export class AcGroup {
  @PrimaryColumn({ name: 'GroupID', type: 'smallint' })
  groupId: number;

  @Column({ name: 'Name', type: 'varchar', length: 30, nullable: true })
  name: string;

  @Column({ name: 'TimeZone1', type: 'smallint', default: 0 })
  timeZone1: number;

  @Column({ name: 'TimeZone2', type: 'smallint', default: 0 })
  timeZone2: number;

  @Column({ name: 'TimeZone3', type: 'smallint', default: 0 })
  timeZone3: number;

  @Column({ name: 'holidayvaild', type: 'tinyint', nullable: true })
  holidayValid: number;

  @Column({ name: 'verifystyle', type: 'int', nullable: true })
  verifyStyle: number;
}
