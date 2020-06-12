import {MigrationInterface, QueryRunner} from "typeorm";

export class addSSOIdToUser1591955839809 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("ALTER TABLE `user_entity` \n" +
            "ADD COLUMN `ssoId` VARCHAR(32) NOT NULL AFTER `sso`;");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
