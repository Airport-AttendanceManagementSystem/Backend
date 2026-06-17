import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('acunlockcomb')
export class AcUnlockComb {
  @PrimaryColumn({ name: 'UnlockCombID', type: 'smallint' })
  unlockCombId: number;

  @Column({ name: 'Name', type: 'varchar', length: 30, nullable: true })
  name: string;

  @Column({ name: 'Group01', type: 'smallint', nullable: true })
  group01: number;

  @Column({ name: 'Group02', type: 'smallint', nullable: true })
  group02: number;

  @Column({ name: 'Group03', type: 'smallint', nullable: true })
  group03: number;

  @Column({ name: 'Group04', type: 'smallint', nullable: true })
  group04: number;

  @Column({ name: 'Group05', type: 'smallint', nullable: true })
  group05: number;
}
