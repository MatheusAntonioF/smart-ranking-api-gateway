import { Injectable } from '@nestjs/common';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { AuthRegisterUserDTO } from 'src/auth/dtos/auth-register-user.dto';
import { AuthSignInUserDTO } from 'src/auth/dtos/auth-sign-in-user.dto';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });
  }

  async registerUser({ name, email, password, phone }: AuthRegisterUserDTO) {
    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: phone,
          }),
          new CognitoUserAttribute({
            Name: 'name',
            Value: name,
          }),
        ],
        null,
        (error, result) => {
          if (!result || error) {
            return reject(error);
          }

          return resolve(result.user);
        },
      );
    });
  }

  async authenticateUser({ email, password }: AuthSignInUserDTO) {
    const authData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser(authData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => resolve(result),
        onFailure: (error) => reject(error),
      });
    });
  }
}
