import { DataSource, DataSourceOptions } from 'typeorm';

// This is a TypeScript file that exports a configuration object for TypeORM.
export const ormSeedConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Nil@_2003',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/seed/*{.ts,.js}'],
};

export const SeedDataSource = new DataSource(ormSeedConfig);
