import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tbsmsallot')
export class TbSmsAllot {
  @PrimaryColumn({ name: 'REFERENCE', type: 'int' })
  reference: number;

  @Column({ name: 'SMSREF', type: 'int' })
  smsRef: number;

  @Column({ name: 'USERREF', type: 'int' })
  userRef: number;

  @Column({ name: 'GENTM', type: 'varchar', length: 20, nullable: true })
  genTm: string;
}
