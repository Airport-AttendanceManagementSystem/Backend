import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserSettingsService } from '@modules/user-settings/user-setting.service';
import { CreateAaslUserDto } from '@modules/user-settings/dto/create-assl-user.dto';
import { UpdateUserStatusDto } from '@modules/user-settings/dto/update-user-status.dto';
import { AaslUserSectionDto } from '@modules/user-settings/dto/aasl-user-section.dto';

@Controller('user-settings')
export class UserSettingController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Post('user')
  createUser(@Body() dto: CreateAaslUserDto) {
    return this.userSettingsService.createUser(dto);
  }

  @Get('user')
  getAllUser() {
    return this.userSettingsService.getAllUsers();
  }

  @Get('departments')
  getAllDepartment() {
    return this.userSettingsService.getAllDepartments();
  }

  @Get('user/:username')
  async getUserSections(@Param('username') username: string) {
    return await this.userSettingsService.getUserSections(username);
  }

  @Post('save')
  async saveUserSections(@Body() updateDto: AaslUserSectionDto) {
    return await this.userSettingsService.saveUserSections(updateDto);
  }

  @Delete('user/:username')
  deleteUser(@Param('username') username: string) {
    return this.userSettingsService.deleteUser(username);
  }

  @Patch('user/:username/status')
  updateStatus(
    @Param('username') username: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.userSettingsService.updateUserStatus(username, dto.userStatus);
  }
}
