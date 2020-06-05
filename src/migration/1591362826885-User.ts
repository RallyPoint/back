import {MigrationInterface, QueryRunner} from "typeorm";

export class User1591362826885 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
	            queryRunner.query("CREATE TABLE `user_entity` (\n" +
		                "  `id` varchar(36) NOT NULL,\n" +
				            "  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),\n" +
					                "  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),\n" +
							            "  `email` varchar(255) NOT NULL,\n" +
								                "  `firstName` varchar(255) NOT NULL,\n" +
										            "  `lastName` varchar(255) NOT NULL,\n" +
											                "  `password` varchar(255) NOT NULL,\n" +
													            "  `githubUserName` varchar(255) NOT NULL,\n" +
														                "  PRIMARY KEY (`id`),\n" +
																            "  UNIQUE KEY `IDX_1135b2556cc537fd76ae458093` (`githubUserName`)\n" +
																	                ") ENGINE=InnoDB DEFAULT CHARSET=utf8;");
																			    }

																			        public async down(queryRunner: QueryRunner): Promise<void> {
																					        queryRunner.query("DROP TABLE `rallypoint`.`user_entity`;")
																						    }

																						    }


