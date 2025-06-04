import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1746968585156 implements MigrationInterface {
  name = 'Seed1746968585156';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (names) VALUES ('reactjs'), ('angularjs)`,
    );
  }

  public async down(): Promise<void> {}
}
