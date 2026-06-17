import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('attparam')
export class AttParam {
  @PrimaryColumn({ name: 'PARANAME', type: 'varchar', length: 20 })
  paraName: string;

  @Column({ name: 'PARATYPE', type: 'varchar', length: 2, nullable: true })
  paraType: string;

  @Column({ name: 'PARAVALUE', type: 'varchar', length: 100 })
  paraValue: string;
}
