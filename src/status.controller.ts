import { Controller, Get } from '@nestjs/common';

@Controller('status')
export class StatusController {

  @Get()
  public get() {
    return { status: 200};
  }

}