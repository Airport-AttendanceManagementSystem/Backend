import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('aaslusersection')
export class AaslUserSection {
  @PrimaryColumn({ name: 'username', type: 'varchar', length: 100 })
  username: string;

  @Column({ name: 'section', type: 'int', nullable: true })
  section: number;
}
