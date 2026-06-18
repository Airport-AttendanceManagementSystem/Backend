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
      userStatus: 0, // Inactive by default — admin must activate via User Activation
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
    return this.departmentRepository.findAll();
  }

  async getUserSections(username: string) {
    const sections = await this.aaslUserSectionRepository.find({
      where: { username },
      select: ['section'],
    });
    return sections.map((s) => s.section);
  }

  async saveUserSections(dto: AaslUserSectionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete old sections for the user
      await queryRunner.manager.delete(AaslUserSection, {
        username: dto.username,
      });

      // Insert new sections
      if (dto.sections && dto.sections.length > 0) {
        const newSections = dto.sections.map((sectionId) => ({
          username: dto.username,
          section: sectionId,
        }));
        await queryRunner.manager.insert(AaslUserSection, newSections);
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
