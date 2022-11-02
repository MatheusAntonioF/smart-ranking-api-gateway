import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Injectable } from '@nestjs/common';

/**
 * - this class will be called just by passport lib
 * - this class will not be called in another module
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // give the responsibility to check if token was expired to passport lib
      audience: process.env.AWS_COGNITO_CLIENT_ID,
      issue: process.env.AWS_COGNITO_AUTHORITY, // define the token emissor -> endpoint to get validation
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AWS_COGNITO_AUTHORITY}/.well-known/jwks.json`,
      }),
    });
  }

  /**
   * @param payload json decoded by passport
   * @return user that will be in the request context execution - request.user
   */
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
