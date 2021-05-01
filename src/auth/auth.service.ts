import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async jwt_guard(data: any) {
    try {
      this.jwtService.verify(data.access_token);
    } catch (error) {
      throw new Error('Unauthorized');
    }

    const jwt_decoded: any = this.jwtService.decode(data.access_token);
    data.username = jwt_decoded.username;

    return data;
  }
}
