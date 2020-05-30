import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableGame1584835553648 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `game_entity` (\n' +
        '  `id` int(11) NOT NULL AUTO_INCREMENT,\n' +
        '  `name` varchar(50) NOT NULL,\n' +
        '  `developer` varchar(50) DEFAULT NULL,\n' +
        '  `editor` varchar(50) DEFAULT NULL,\n' +
        '  `releaseDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),\n' +
        '  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),\n' +
        '  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),\n' +
        '  PRIMARY KEY (`id`)\n' +
        ') ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;\n');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE game_entity');
    }

}
