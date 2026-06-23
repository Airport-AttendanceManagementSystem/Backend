import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('leaveclass')
export class LeaveClass {
  @PrimaryGeneratedColumn({ name: 'LeaveId' })
  leaveId: number;

  @Column({ name: 'LeaveName', type: 'varchar', length: 20 })
  leaveName: string;

  @Column({ name: 'MinUnit', type: 'float', default: 1 })
  minUnit: number;

  @Column({ name: 'Unit', type: 'smallint', default: 1 })
  unit: number;

  @Column({ name: 'RemaindProc', type: 'smallint', default: 1 })
  remaindProc: number;

  @Column({ name: 'RemaindCount', type: 'smallint', default: 1 })
  remaindCount: number;

  @Column({ name: 'ReportSymbol', type: 'varchar', length: 4, default: '-' })
  reportSymbol: string;

  @Column({ name: 'Deduct', type: 'float', default: 0 })
  deduct: number;

  @Column({ name: 'Color', type: 'int', default: 0 })
  color: number;

  @Column({ name: 'Classify', type: 'smallint', default: 0 })
  classify: number;
}
