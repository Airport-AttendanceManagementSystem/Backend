import { Entity, PrimaryColumn } from 'typeorm';

@Entity('aaslusersection')
export class AaslUserSection {
  @PrimaryColumn({ name: 'username', type: 'varchar', length: 100 })
  username: string;

  @PrimaryColumn({ name: 'section', type: 'int' })
  section: number;
}
