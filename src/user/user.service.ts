import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@app/user/user.entity';
import { RegisterUserDtoTs } from '@app/user/dto/register-user.dto';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDtoTs } from './dto/login-user.dto';
import { compare } from 'bcrypt';

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

  async loginUser(loginUserDto: LoginUserDtoTs): Promise<Users> {
    console.log('Login User DTO - ', loginUserDto);
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['id', 'username', 'email', 'image', 'bio', 'password'],
    });

    console.log('User - ', user);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const isPassword = await compare(loginUserDto.password, user.password);

    console.log(loginUserDto.password, user.password, isPassword);
    if (!isPassword) {
      throw new HttpException(
        'Credentials are invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;

    return user;
  }

  async findUserById(userId: number): Promise<Users | null> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  generateJwtToken(user: Users): string {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
    };
    // !THE SECRET KEY SHOULD BE IN ENV FILE
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return sign(payload, 'topsecretkey', { expiresIn: '1h' });
  }

  buildUserResponse(user: Users): UserResponseInterface {
    return { user: { ...user, token: this.generateJwtToken(user) } };
  }
}
