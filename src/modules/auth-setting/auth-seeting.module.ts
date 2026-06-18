import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSettingModule } from '../user-settings/user-setting.module';
import { AuthSettingController } from '@modules/auth-setting/auth-setting.controller';
import { AuthSettingService } from '@modules/auth-setting/auth-setting.service';

@Module({
  imports: [
    UserSettingModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthSettingController],
  providers: [AuthSettingService],
})
export class AuthSettingModule {}
