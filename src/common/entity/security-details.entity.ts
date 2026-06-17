import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('securitydetails')
export class SecurityDetails {
  @PrimaryGeneratedColumn({ name: 'SECURITYDETAILID' })
  securityDetailId: number;

  @Column({ name: 'USERID', type: 'int', nullable: true })
  userId: number;

  @Column({ name: 'DEPTID', type: 'smallint', nullable: true })
  deptId: number;

  @Column({ name: 'SCHEDULE', type: 'smallint', nullable: true })
  schedule: number;

  @Column({ name: 'USERINFO', type: 'smallint', nullable: true })
  userInfo: number;

  @Column({ name: 'ENROLLFINGERS', type: 'smallint', nullable: true })
  enrollFingers: number;

  @Column({ name: 'REPORTVIEW', type: 'smallint', nullable: true })
  reportView: number;

  @Column({ name: 'REPORT', type: 'varchar', length: 10, nullable: true })
  report: string;

  @Column({ name: 'ReadOnly', type: 'tinyint', nullable: true })
  readOnly: number;

  @Column({ name: 'FullControl', type: 'tinyint', nullable: true })
  fullControl: number;
}
