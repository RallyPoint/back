import {MigrationInterface, QueryRunner} from "typeorm";

export class addSSOToUser1591895801212 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("ALTER TABLE `user_entity` \n" +
            "DROP COLUMN `githubUserName`,\n" +
            "ADD COLUMN `sso` ENUM('github', 'local') NOT NULL AFTER `liveKey`,\n" +
            "DROP INDEX `IDX_1135b2556cc537fd76ae458093` ;")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
