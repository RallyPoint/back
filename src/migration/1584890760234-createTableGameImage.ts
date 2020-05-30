import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableGameImage1584890760234 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `game_image_entity` (\n' +
        '  `id` int(11) NOT NULL AUTO_INCREMENT,\n' +
        '  `originalName` varchar(50) NOT NULL,\n' +
        '  `fileName` varchar(50) DEFAULT NULL,\n' +
        '  `gameId` int(11) NOT NULL,\n' +
        '  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),\n' +
        '  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),\n' +
        '  PRIMARY KEY (`id`)\n,' +
        '  KEY `FK_f051d913d898ced22ec07101371` (`gameId`),\n' +
        '  CONSTRAINT `FK_f051d913d898ced22ec07101371` FOREIGN KEY (`gameId`) REFERENCES `game_entity` (`id`) ON DELETE CASCADE\n' +
        ') ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;\n');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE game_image_entity');
    }

}
