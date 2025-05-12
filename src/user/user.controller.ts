/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { RegisterUserDtoTs } from '@app/user/dto/register-user.dto';
import { Users } from '@app/user/user.entity';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  registerUser(
    @Body('user') registerUserDto: RegisterUserDtoTs,
  ): Promise<Users> {
    return this.userService.registerUser(registerUserDto);
  }
}
