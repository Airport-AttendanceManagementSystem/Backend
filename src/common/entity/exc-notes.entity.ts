import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('excnotes')
export class ExcNotes {
  @PrimaryColumn({ name: 'USERID', type: 'int' })
  userId: number;

  @Column({ name: 'ATTDATE', type: 'datetime', nullable: true })
  attDate: Date;

  @Column({ name: 'NOTES', type: 'varchar', length: 200, nullable: true })
  notes: string;
}
