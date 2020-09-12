import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

class ConfigService {
  constructor() { }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
        type: "mysql",
        entities: ["dist/**/*.entity{.ts,.js}"],
        migrations: ["dist/migration/!(abstract*)"],
        cli: {
            "migrationsDir": "src/migration"
        },
        synchronize: true,
        logging: true,
        ...config.get('mysql')
    }
  }
}

const configService = new ConfigService();

export {configService};
