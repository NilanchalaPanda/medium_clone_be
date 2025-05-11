import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tags1746968585156 implements MigrationInterface {
  name = 'Tags1746968585156';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tag"`);
  }
}
