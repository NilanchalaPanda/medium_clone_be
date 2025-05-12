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
import { LoginUserDtoTs } from './dto/login-user.dto';

@Controller('users')
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

  @Post('login')
  @UsePipes(ValidationPipe)
  async loginUser(
    @Body('user') loginUserDto: LoginUserDtoTs,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }
}
