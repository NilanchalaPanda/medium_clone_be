import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@app/user/user.entity';
import { RegisterUserDtoTs } from '@app/user/dto/register-user.dto';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDtoTs } from './dto/login-user.dto';
import { compareSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async registerUser(registerUserDto: RegisterUserDtoTs): Promise<Users> {
    const userByEmailExists = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });

    const userByUsernameExists = await this.userRepository.findOne({
      where: { username: registerUserDto.username },
    });

    if (userByEmailExists || userByUsernameExists) {
      throw new HttpException(
        'Email or username already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new Users();
    Object.assign(newUser, registerUserDto);
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }

  async loginUser(loginUserDto: LoginUserDtoTs) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const isPassword = await compareSync(loginUserDto.password, user.password);
    if (!isPassword) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  generateJwtToken(user: Users): string {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  }

  buildUserResponse(user: Users): UserResponseInterface {
    return { user: { ...user, token: this.generateJwtToken(user) } };
  }
}
