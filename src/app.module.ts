import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettingModule } from '@modules/user-settings/user-setting.module';
import { AttendanceReportModule } from '@modules/attendance-settings/attendance-setting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASS', ''),
        database: config.get<string>('DB_NAME', 'airport_db'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    UserSettingModule,
    AttendanceReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
