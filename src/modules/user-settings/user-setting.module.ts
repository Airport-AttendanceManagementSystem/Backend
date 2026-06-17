import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AaslUser } from '@common/entity/aasl-user.entity';
import { UsersTb } from '@common/entity/users-tb.entity';
import { Department } from '@common/entity/department.entity';
import { UserSettingController } from '@modules/user-settings/user-setting.controller';
import { UserSettingsService } from '@modules/user-settings/user-setting.service';
import { CreateAsslUserRepository } from '@modules/user-settings/repositories/create-assl-user.repository';
import { UserstbRepository } from '@modules/user-settings/repositories/users-tb.repository';
import { DepartmentRepository } from '@modules/user-settings/repositories/department.repository';
import { AaslUserSectionRepository } from '@modules/user-settings/repositories/aasl-user-section.repository';
import { AaslUserSection } from '@common/entity/aasl-user-section.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AaslUser, UsersTb, Department, AaslUserSection]),
  ],
  controllers: [UserSettingController],
  providers: [
    UserSettingsService,
    CreateAsslUserRepository,
    UserstbRepository,
    DepartmentRepository,
    AaslUserSectionRepository,
  ],
})
export class UserSettingModule {}
