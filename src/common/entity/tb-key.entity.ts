import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tbkey')
export class TbKey {
  @PrimaryColumn({ name: 'PreName', type: 'varchar', length: 12 })
  preName: string;

  @Column({ name: 'ONEKEY', type: 'int', nullable: true })
  oneKey: number;
}
