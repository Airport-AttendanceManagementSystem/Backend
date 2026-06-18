import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthSettingService } from '@modules/auth-setting/auth-setting.service';

@Controller('auth')
export class AuthSettingController {
  constructor(private readonly authService: AuthSettingService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
