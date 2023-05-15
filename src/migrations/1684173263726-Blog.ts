import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm"

export class Blog1684173263726 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "blog_category" ("id" character varying NOT NULL,
			"handle" character varying,
			"title" character varying NOT NULL,
			"description" character varying,
			"keywords" varchar array,
			"metadata" jsonb)`
		)
		await queryRunner.createPrimaryKey("blog_category", ["id"])

		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "blog_post" ("id" character varying NOT NULL,
			"handle" character varying,
			"title" character varying NOT NULL,
			"author" character varying,
			"published" boolean NOT NULL DEFAULT false,
			"content" character varying,
			"description" character varying,
			"keywords" varchar array,
			"category_id" character varying,
			"metadata" jsonb,
			"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
			"updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`
		)
		await queryRunner.createPrimaryKey("blog_post", ["id"])
		await queryRunner.createForeignKey("blog_post", new TableForeignKey({
			columnNames: ["category_id"],
			referencedColumnNames: ["id"],
			referencedTableName: "blog_category",
			onDelete: "CASCADE",
			onUpdate: "CASCADE"
		}))

		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "blog_tag" ("id" character varying NOT NULL,
			"value" character varying NOT NULL)`
		)
		await queryRunner.createPrimaryKey("blog_tag", ["id"])

		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "blog_tags" ("post_id" character varying NOT NULL,
			"tag_id" character varying NOT NULL)`
		)
		await queryRunner.createForeignKey("blog_tags", new TableForeignKey({
			columnNames: ["post_id"],
			referencedColumnNames: ["id"],
			referencedTableName: "blog_post",
			onDelete: "CASCADE",
			onUpdate: "CASCADE"
		}))
		await queryRunner.createForeignKey("blog_tags", new TableForeignKey({
			columnNames: ["tag_id"],
			referencedColumnNames: ["id"],
			referencedTableName: "blog_tag",
			onDelete: "CASCADE",
			onUpdate: "CASCADE"
		}))

		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "blog_product_tags" ("post_id" character varying NOT NULL,
			"product_id" character varying NOT NULL)`
		)
		await queryRunner.createForeignKey("blog_product_tags", new TableForeignKey({
			columnNames: ["post_id"],
			referencedColumnNames: ["id"],
			referencedTableName: "blog_post",
			onDelete: "CASCADE",
			onUpdate: "CASCADE"
		}))
		await queryRunner.createForeignKey("blog_product_tags", new TableForeignKey({
			columnNames: ["product_id"],
			referencedColumnNames: ["id"],
			referencedTableName: "product",
			onDelete: "CASCADE",
			onUpdate: "CASCADE"
		}))

		await queryRunner.query(
			`CREATE TABLE IF NOT EXISTS "blog_collection_tags" ("post_id" character varying NOT NULL,
			"collection_id" character varying NOT NULL)`
		)
		await queryRunner.createForeignKey("blog_collection_tags", new TableForeignKey({
			columnNames: ["post_id"],
			referencedColumnNames: ["id"],
			referencedTableName: "blog_post",
			onDelete: "CASCADE",
			onUpdate: "CASCADE"
		}))
		await queryRunner.createForeignKey("blog_collection_tags", new TableForeignKey({
			columnNames: ["collection_id"],
			referencedColumnNames: ["id"],
			referencedTableName: "product_collection",
			onDelete: "CASCADE",
			onUpdate: "CASCADE"
		}))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
		 await queryRunner.dropTable("blog_tags", true)
		 await queryRunner.dropTable("blog_product_tags", true)
		 await queryRunner.dropTable("blog_collection_tags", true)
		 await queryRunner.dropTable("blog_tag", true)
		 await queryRunner.dropTable("blog_post", true)
		 await queryRunner.dropTable("blog_category", true)
    }

}
