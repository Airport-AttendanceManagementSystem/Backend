import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('facetemp')
export class FaceTemp {
  @PrimaryGeneratedColumn({ name: 'TEMPLATEID' })
  templateId: number;

  @Column({ name: 'USERNO', type: 'varchar', length: 24, nullable: true })
  userNo: string;

  @Column({ name: 'SIZE', type: 'int', default: 0 })
  size: number;

  @Column({ name: 'pin', type: 'int', default: 0 })
  pin: number;

  @Column({ name: 'FACEID', type: 'int', default: 0 })
  faceId: number;

  @Column({ name: 'VALID', type: 'int', default: 0 })
  valid: number;

  @Column({ name: 'RESERVE', type: 'int', default: 0 })
  reserve: number;

  @Column({ name: 'ACTIVETIME', type: 'int', default: 0 })
  activeTime: number;

  @Column({ name: 'VFCOUNT', type: 'int', default: 0 })
  vfCount: number;

  @Column({ name: 'TEMPLATE', type: 'longblob', nullable: true })
  template: Buffer;

  @Column({ name: 'UserID', type: 'int', default: 0 })
  userId: number;
}
