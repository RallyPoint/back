import { Module } from '@nestjs/common';
import {PspService} from "./service/psp.service";

@Module({
  imports: [],
  controllers: [],
  providers: [PspService],
  exports: [PspService],
})
export class PspModule {}
