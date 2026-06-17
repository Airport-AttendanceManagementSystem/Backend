import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tbsmsinfo')
export class TbSmsInfo {
  @PrimaryColumn({ name: 'REFERENCE', type: 'int' })
  reference: number;

  @Column({ name: 'SMSID', type: 'varchar', length: 16 })
  smsId: string;

  @Column({ name: 'SMSINDEX', type: 'int' })
  smsIndex: number;

  @Column({ name: 'SMSTYPE', type: 'int', nullable: true })
  smsType: number;

  @Column({ name: 'SMSCONTENT', type: 'longtext', nullable: true })
  smsContent: string;

  @Column({ name: 'SMSSTARTTM', type: 'varchar', length: 32, nullable: true })
  smsStartTm: string;

  @Column({ name: 'SMSTMLENG', type: 'int', nullable: true })
  smsTmLeng: number;

  @Column({ name: 'GENTM', type: 'varchar', length: 20, nullable: true })
  genTm: string;
}
