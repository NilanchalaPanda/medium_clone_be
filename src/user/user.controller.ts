/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { RegisterUserDtoTs } from '@app/user/dto/register-user.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDtoTs } from './dto/login-user.dto';
import { User } from '@app/user/decorators/user/user.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(ValidationPipe)
  async registerUser(
    @Body('user') registerUserDto: RegisterUserDtoTs,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.registerUser(registerUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(ValidationPipe)
  async loginUser(
    @Body('user') loginUserDto: LoginUserDtoTs,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  // eslint-disable-next-line @typescript-eslint/require-await
  async currentUser(@User() user: any): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }
}
