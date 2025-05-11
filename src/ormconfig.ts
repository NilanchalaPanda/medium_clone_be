import { DataSourceOptions } from 'typeorm';

// This is a TypeScript file that exports a configuration object for TypeORM.
const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Nil@_2003',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // !Disable logging in production
  synchronize: true,
};

export default config;
