import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('userupdates')
export class UserUpdates {
  @PrimaryGeneratedColumn({ name: 'UpdateId' })
  updateId: number;

  @Column({ name: 'BadgeNumber', type: 'varchar', length: 20, nullable: true })
  badgeNumber: string;
}
