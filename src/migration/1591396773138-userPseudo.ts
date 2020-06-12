import {MigrationInterface, QueryRunner} from "typeorm";

export class userPseudo1591396773138 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("ALTER TABLE `user_entity` \n" +
            "ADD COLUMN `pseudo` VARCHAR(32) NOT NULL AFTER `id`,\n" +
            "ADD UNIQUE INDEX `pseudo_UNIQUE` (`liveKey` ASC);")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}


