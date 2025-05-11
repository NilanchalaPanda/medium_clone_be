import { DataSource, DataSourceOptions } from 'typeorm';

// This is a TypeScript file that exports a configuration object for TypeORM.
export const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Nil@_2003',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,

  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export const dataSource = new DataSource(config);
