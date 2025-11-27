import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import dotenv from "dotenv";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization: Bearer <token>
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY!,//'SECRET_KEY',
    });
  }

  async validate(payload: any) {
    return { id: payload.id, mail: payload.mail, role: payload.role }
  }
}
