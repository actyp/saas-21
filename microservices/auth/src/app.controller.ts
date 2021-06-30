import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private authService: AuthService) {}

  json_parse(payload: string) {
    try {
      return JSON.parse(payload);
    } catch (SyntaxError) {
      return {};
    }
  }

  @MessagePattern('refresh')
  async refresh(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.authService
      .jwt_guard(data)
      .then((data) => this.authService.refresh(data.username))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return { statusCode: 401, message: 'Unauthorized' };
        }
        this.logger.error(err);
        return { statusCode: 500, message: 'Internal server error' };
      });
  }

  @MessagePattern('login')
  async login(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.authService
      .local_guard(data)
      .then((data) => this.authService.login(data.username))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return { statusCode: 401, message: 'Unauthorized' };
        }
        this.logger.error(err);
        return { statusCode: 500, message: 'Internal server error' };
      });
  }

  @MessagePattern('logout')
  async logout(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.authService
      .jwt_guard(data)
      .then((data) => this.authService.logout(data.username))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return { statusCode: 401, message: 'Unauthorized' };
        }
        this.logger.error(err);
        return { statusCode: 500, message: 'Internal server error' };
      });
  }

  @MessagePattern('signup')
  async signup(@Payload() payload) {
    const data = this.json_parse(payload);

    return this.authService.signup(data);
  }
}
