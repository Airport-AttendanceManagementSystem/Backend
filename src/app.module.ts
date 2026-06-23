import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettingModule } from '@modules/user-settings/user-setting.module';
import { AttendanceReportModule } from '@modules/attendance-settings/attendance-setting.module';
import { AuthSettingModule } from '@modules/auth-setting/auth-seeting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '1433'), 10),
        username: config.get<string>('DB_USER', 'sa'),
        password: config.get<string>('DB_PASS', ''),
        database: config.get<string>('DB_NAME', 'airport_db'),
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    UserSettingModule,
    AttendanceReportModule,
    AuthSettingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
