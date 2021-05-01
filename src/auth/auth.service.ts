import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async jwt_guard(data: any) {
    const jwt_decoded: any = await this.jwtService.decode(data.access_token);
    if (jwt_decoded === null) {
      throw new Error('Unauthorized');
    }

    data.username = jwt_decoded.username;

    return data;
  }
}
