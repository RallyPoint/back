import { Module } from '@nestjs/common';
import {CmsController} from "./controller/cms.controller";
import {CmsService} from "./sevices/cms.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CmsEntity} from "./entity/cms.entity";

@Module({
  imports : [TypeOrmModule.forFeature([CmsEntity])],
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService]
})
export class CmsModule {}
