import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class AuthRegisterUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * - At least 8 characters
   * - At least One uppercase letter
   * - At least One lowercase letter
   * - At least One number
   */
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Invalid password',
  })
  @IsNotEmpty()
  password: string;

  @IsMobilePhone('pt-BR')
  @IsNotEmpty()
  phone: string;
}
