import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDtoTs {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly bio: string;

  @IsNotEmpty()
  readonly image: string;
}
