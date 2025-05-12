import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDtoTs {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
