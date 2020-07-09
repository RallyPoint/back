import {
  Body,
  Controller, Param, Put
} from '@nestjs/common';
import {ChangePasswordDto, VerifiedEmailDto, VerifiedEmailResponseDto} from "../dto/user.dto";
import {UserService} from "../service/user.service";

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}


  @Put(':userId/verify')
  public async verified(
      @Body() body: VerifiedEmailDto,
      @Param('userId')userId: string): Promise<VerifiedEmailResponseDto>{
    return this.userService.validEmail(userId,body.code).then(()=>{
      return { status: true};
    });
  }

  @Put(':userId/change-password')
  public async changePassword(
      @Body() body: ChangePasswordDto,
      @Param('userId')userId: string): Promise<boolean>{
    return !!await this.userService.changePassword(body.password,body.code);
  }
}
