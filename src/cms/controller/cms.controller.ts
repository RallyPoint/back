import {
  Controller,
  Get, Param, Query, Headers
} from '@nestjs/common';
import {CmsService} from "../sevices/cms.service";

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}


  @Get('/:slug')
  public get(
      @Param('slug') slug: string,
      @Query('language') language: string,
      @Headers('Accept-Language') headerLanguage: string){
    let lang : string = language;
    if(!lang && headerLanguage){
      lang = headerLanguage.split(';')[0].split(',')[0].split('-')[0];
    }
    return this.cmsService.getBySlug(slug,(language?language:lang).toUpperCase());
  }
}
