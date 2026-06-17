import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('template')
export class Template {
  @PrimaryGeneratedColumn({ name: 'TEMPLATEID' })
  templateId: number;

  @Column({ name: 'USERID', type: 'int' })
  userId: number;

  @Column({ name: 'FINGERID', type: 'int' })
  fingerId: number;

  @Column({ name: 'TEMPLATE', type: 'longblob' })
  template: Buffer;

  @Column({ name: 'USETYPE', type: 'smallint', nullable: true })
  useType: number;

  @Column({ name: 'EMACHINENUM', type: 'varchar', length: 3, nullable: true })
  eMachineNum: string;

  @Column({ name: 'Flag', type: 'smallint', default: 1 })
  flag: number;

  @Column({ name: 'DivisionFP', type: 'smallint', default: 0 })
  divisionFp: number;
}
