// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
  username: configService.get<string>('DB_USERNAME', 'root'),
  password: configService.get<string>('DB_PASSWORD', ''),
  database: configService.get<string>('DB_DATABASE', 'test'),
  synchronize: configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
  logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});
