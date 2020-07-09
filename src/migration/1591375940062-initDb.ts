import {MigrationInterface, QueryRunner} from "typeorm";

export class initDb1591375940062 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("CREATE TABLE `user_entity` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `email` varchar(255) NOT NULL, `pseudo` varchar(255) NOT NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `sso` enum ('local', 'github') NOT NULL, `ssoId` varchar(32) NOT NULL, `roles` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;");
		await queryRunner.query("CREATE TABLE `categorie_live_entity` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(32) NOT NULL, `type` enum ('level', 'language') NOT NULL, UNIQUE INDEX `IDX_6e06f8ef9a134f64a58dffd226` (`type`, `name`), PRIMARY KEY (`id`)) ENGINE=InnoDB;");
		await queryRunner.query("CREATE TABLE `live_entity` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `key` varchar(32) NOT NULL, `status` tinyint NOT NULL DEFAULT 0, `userId` varchar(36) NULL, UNIQUE INDEX `REL_f7464b810d34367e0fab3ed000` (`userId`), PRIMARY KEY (`id`)) ENGINE=InnoDB;");
		await queryRunner.query("CREATE TABLE `live_entity_categories_categorie_live_entity` (`liveEntityId` varchar(36) NOT NULL, `categorieLiveEntityId` varchar(36) NOT NULL, INDEX `IDX_cce93ddd6051772dc4a78ecb0b` (`liveEntityId`), INDEX `IDX_bad0369213512b23ff9e48599f` (`categorieLiveEntityId`), PRIMARY KEY (`liveEntityId`, `categorieLiveEntityId`)) ENGINE=InnoDB;");
		await queryRunner.query("ALTER TABLE `live_entity` ADD CONSTRAINT `FK_f7464b810d34367e0fab3ed0001` FOREIGN KEY (`userId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;");
		await queryRunner.query("ALTER TABLE `live_entity_categories_categorie_live_entity` ADD CONSTRAINT `FK_cce93ddd6051772dc4a78ecb0b4` FOREIGN KEY (`liveEntityId`) REFERENCES `live_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;");
		await queryRunner.query("ALTER TABLE `live_entity_categories_categorie_live_entity` ADD CONSTRAINT `FK_bad0369213512b23ff9e48599f5` FOREIGN KEY (`categorieLiveEntityId`) REFERENCES `categorie_live_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;");
	}


	public async down(queryRunner: QueryRunner): Promise<void> {
	}

}

