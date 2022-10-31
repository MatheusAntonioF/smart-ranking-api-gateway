import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class AuthSignInUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Invalid password',
  })
  @IsNotEmpty()
  password: string;
}
