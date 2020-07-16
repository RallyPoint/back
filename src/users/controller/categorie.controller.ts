import {Body, Controller, Get, Post, UnauthorizedException} from '@nestjs/common';
import {NginxRtmpExternal} from "../dto/nginx-rtmp.external";
import {CategorieService} from "../service/categorie.service";
import {CATEGORIE_TYPE} from "../../auth/constants";
import {CategoriesResponseDto} from "../dto/categorie.dto";

/**
 * @todo: ADD IP RESTRICTION !!!
 */
@Controller('categorie')
export class CategorieController {

  constructor(private readonly categorieService: CategorieService){

  }

  @Get()
  public async getAll(): Promise<CategoriesResponseDto> {
    return new CategoriesResponseDto({
      languages : await this.categorieService.getByType(CATEGORIE_TYPE.LANGUAGE),
      levels : await this.categorieService.getByType(CATEGORIE_TYPE.LEVEL)
    });
  }


}
