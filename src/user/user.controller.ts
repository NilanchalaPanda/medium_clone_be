/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { RegisterUserDtoTs } from '@app/user/dto/register-user.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDtoTs } from '@app/user/dto/login-user.dto';
import { User } from '@app/user/decorators/user/user.decorator';
import { AuthGuard } from '@app/user/guards/auth/auth.guard';
import { UpdateUserDtoTs } from './dto/update-user.dto';

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
  @UseGuards(AuthGuard)
  // eslint-disable-next-line @typescript-eslint/require-await
  async currentUser(@User() user: any): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async updateUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDtoTs,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );

    return this.userService.buildUserResponse(user);
  }
}
