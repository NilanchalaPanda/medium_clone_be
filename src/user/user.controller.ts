/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { RegisterUserDtoTs } from '@app/user/dto/register-user.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async registerUser(
    @Body('user') registerUserDto: RegisterUserDtoTs,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.registerUser(registerUserDto);
    return this.userService.buildUserResponse(user);
  }
}
