import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { DepartmentRepository } from './repositories/department.repository';
import { CreateAsslUserRepository } from '@modules/user-settings/repositories/create-assl-user.repository';
import { UserstbRepository } from '@modules/user-settings/repositories/users-tb.repository';
import { CreateAaslUserDto } from '@modules/user-settings/dto/create-assl-user.dto';
import { AaslUserSectionRepository } from '@modules/user-settings/repositories/aasl-user-section.repository';
import { DataSource } from 'typeorm';
import { AaslUserSectionDto } from '@modules/user-settings/dto/aasl-user-section.dto';
import { AaslUserSection } from '@common/entity/aasl-user-section.entity';
import { ChangePasswordDto } from '@modules/user-settings/dto/change-password.dto';

@Injectable()
export class UserSettingsService {
  constructor(
    private readonly createAsslUserRepository: CreateAsslUserRepository,
    private readonly usersTbRepository: UserstbRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly aaslUserSectionRepository: AaslUserSectionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(dto: CreateAaslUserDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    const existing = await this.createAsslUserRepository.findByUsername(
      dto.username,
    );
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.createAsslUserRepository.create({
      username: dto.username,
      password: hashedPassword,
      userType: dto.userType,
      deptId: dto.deptId,
      userStatus: 1,
    });

    await this.usersTbRepository.create({
      userName: dto.username,
      password: hashedPassword,
      userType: dto.userType,
      userStatus: 'Inactive',
    });

    return { message: 'User created successfully', username: dto.username };
  }

  async deleteUser(username: string) {
    const existing =
      await this.createAsslUserRepository.findByUsername(username);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    await this.createAsslUserRepository.delete(username);
    await this.usersTbRepository.delete(username);

    return { message: 'User deleted successfully' };
  }

  async getAllUsers() {
    return this.createAsslUserRepository.findAll();
  }

  async getAllDepartments() {
    // Only return top-level divisions (direct children of AASL root = SUPDEPTID 1 or 0)
    const all = await this.departmentRepository.findAll();
    return all.filter(d => d.supDeptId === 1 || d.supDeptId === 0);
  }

  async getUserSections(username: string) {
    const sections = await this.aaslUserSectionRepository.find({
      where: { username },
      select: ['section'],
    });
    return sections.map((s) => s.section);
  }

  private async ensureCompositePrimaryKey(): Promise<void> {
    const pkCols: { COLUMN_NAME: string }[] = await this.dataSource.query(`
      SELECT kcu.COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
      JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
        ON kcu.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
      WHERE tc.TABLE_NAME = 'aaslusersection'
        AND tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
    `);

    const cols = pkCols.map(r => r.COLUMN_NAME.toLowerCase());
    if (cols.includes('section')) return; // already composite, nothing to do

    const constraints: { constraint_name: string }[] = await this.dataSource.query(`
      SELECT kc.name AS constraint_name
      FROM sys.key_constraints kc
      INNER JOIN sys.tables t ON kc.parent_object_id = t.object_id
      WHERE t.name = 'aaslusersection' AND kc.type = 'PK'
    `);

    if (constraints.length > 0) {
      const name = constraints[0].constraint_name;
      await this.dataSource.query(`ALTER TABLE [dbo].[aaslusersection] DROP CONSTRAINT [${name}]`);
      // section column must be NOT NULL before it can be part of a PK
      await this.dataSource.query(`ALTER TABLE [dbo].[aaslusersection] ALTER COLUMN [section] INT NOT NULL`);
      await this.dataSource.query(
        `ALTER TABLE [dbo].[aaslusersection] ADD CONSTRAINT [PK_aaslusersection] PRIMARY KEY ([username], [section])`,
      );
    }
  }

  async saveUserSections(dto: AaslUserSectionDto) {
    // Ensure DB table has composite PK (username, section) before inserting
    await this.ensureCompositePrimaryKey();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete old sections for the user
      await queryRunner.manager.delete(AaslUserSection, {
        username: dto.username,
      });

      // Insert new sections one-by-one to avoid batch insert PK issues
      for (const sectionId of dto.sections ?? []) {
        await queryRunner.query(
          `INSERT INTO [dbo].[aaslusersection] ([username], [section]) VALUES (@0, @1)`,
          [dto.username, sectionId],
        );
      }

      await queryRunner.commitTransaction();
      return { message: 'Section access updated successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateUserStatus(username: string, userStatus: string) {
    const existing =
      await this.createAsslUserRepository.findByUsername(username);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const statusInt = userStatus === 'active' ? 1 : 0;
    const statusText = userStatus === 'active' ? 'Active' : 'Inactive';

    await this.createAsslUserRepository.updateStatus(username, statusInt);
    await this.usersTbRepository.updateStatus(username, statusText);

    return { message: 'User status updated successfully', userStatus };
  }

  async getSectionsByDept(
    deptId?: number,
  ): Promise<{ sectionId: number; sectionName: string }[]> {
    if (!deptId) return [];

    const results: { deptId: number; deptName: string }[] =
      await this.dataSource
        .createQueryBuilder()
        .select('d.deptId', 'deptId')
        .addSelect('d.deptName', 'deptName')
        .from('DEPARTMENTS', 'd')
        .where('d.supDeptId = :deptId', { deptId })
        .orderBy('d.deptName', 'ASC')
        .getRawMany();

    return results.map((r) => ({
      sectionId: r.deptId,
      sectionName: r.deptName,
    }));
  }

  async changePassword(dto: ChangePasswordDto) {
    const existingUser = await this.createAsslUserRepository.findByUsername(
      dto.username,
    );

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatching = await bcrypt.compare(
      dto.currentPassword,
      existingUser.password,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.createAsslUserRepository.updatePassword(
      dto.username,
      hashedNewPassword,
    );

    await this.usersTbRepository.updatePassword(
      dto.username,
      hashedNewPassword,
    );

    return { message: 'Password updated successfully' };
  }
}
