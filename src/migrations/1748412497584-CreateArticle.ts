import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticle1748412497584 implements MigrationInterface {
  name = 'CreateArticle1748412497584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "article" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "body" character varying NOT NULL DEFAULT '', "tagList" text NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "favorited" boolean NOT NULL DEFAULT false, "favoritesCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "article"`);
  }
}
