import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@app/user/user.entity';
import { RegisterUserDtoTs } from '@app/user/dto/register-user.dto';

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
}
