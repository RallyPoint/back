import {MigrationInterface, QueryRunner} from "typeorm";

export class liveStatus1591375940062 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		queryRunner.query("ALTER TABLE `rallypoint`.`user_entity` \n" +
			"ADD COLUMN `liveStatus` TINYINT NOT NULL DEFAULT 0 AFTER `githubUserName`,\n" +
			"ADD COLUMN `liveKey` VARCHAR(32) NOT NULL AFTER `liveStatus`,\n" +
			"ADD UNIQUE INDEX `liveKey_UNIQUE` (`liveKey` ASC),\n" +
			"ADD UNIQUE INDEX `id_UNIQUE` (`id` ASC),\n" +
			"ADD UNIQUE INDEX `email_UNIQUE` (`email` ASC);")
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
	}

}

