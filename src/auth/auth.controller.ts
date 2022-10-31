import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthRegisterUserDTO } from './dtos/auth-register-user.dto';
import { AuthSignInUserDTO } from './dtos/auth-sign-in-user.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly awsCognitoService: AwsCognitoService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerUser: AuthRegisterUserDTO) {
    return this.awsCognitoService.registerUser(registerUser);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async signIn(@Body() signInUser: AuthSignInUserDTO) {
    return this.awsCognitoService.authenticateUser(signInUser);
  }
}
