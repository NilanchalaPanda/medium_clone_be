import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@app/user/user.entity';
import { RegisterUserDtoTs } from '@app/user/dto/register-user.dto';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/userResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async registerUser(registerUserDto: RegisterUserDtoTs): Promise<Users> {
    const newUser = new Users();
    Object.assign(newUser, registerUserDto);
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
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
