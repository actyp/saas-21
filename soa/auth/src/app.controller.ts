import {
  BeforeApplicationShutdown,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  OnApplicationBootstrap,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

const service_name = 'AUTH_SERVICE';

@Controller()
export class AppController
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  private readonly logger = new Logger(AppController.name);
  private readonly status_code = {
    200: { statusCode: 200, message: 'OK' },
    201: { statusCode: 201, message: 'Created' },
    400: { statusCode: 400, message: 'Bad request' },
    401: { statusCode: 401, message: 'Unauthorized' },
    406: { statusCode: 406, message: 'Conflict' },
    500: { statusCode: 500, message: 'Internal server error' },
  };
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    @Inject('ESB_CLIENT')
    private readonly esb_client: ClientProxy,
  ) {}

  private static respond(res, data) {
    if (data.statusCode !== undefined) {
      res.statusMessage = data.message;
      res.status(data.statusCode).send();
    } else {
      res.status(HttpStatus.OK).json(data);
    }
  }

  private static respond_to_login(res, data) {
    if (data.statusCode !== undefined) {
      res.statusMessage = data.message;
      res.status(data.statusCode).send();
    } else {
      res.cookie('refresh_token', data.refresh_token, {
        httpOnly: true,
        //        secure: true,
        expires: new Date(data.refresh_token_expiry),
      });
      delete data.refresh_token;
      delete data.refresh_token_expiry;
      res.status(HttpStatus.OK).json(data);
    }
  }

  json_parse(payload: string) {
    try {
      return JSON.parse(payload);
    } catch (SyntaxError) {
      return {};
    }
  }

  onApplicationBootstrap() {
    this.esb_client.emit('service_info', {
      name: service_name,
      status: 1,
    });
  }

  async beforeApplicationShutdown() {
    this.logger.warn('Shutting down...');
    await this.esb_client
      .emit('service_info', {
        name: service_name,
        status: 0,
      })
      .toPromise();
  }

  @EventPattern('healthcheck')
  healthcheck() {
    this.esb_client.emit('service_info', {
      name: service_name,
      status: 1,
    });
  }

  @MessagePattern('authenticate')
  async authenticate(@Payload() payload) {
    const { access_token, access_time } = this.json_parse(payload);

    try {
      const time_diff = Date.now() - access_time;
      this.logger.log(`Authenticate time difference: +${time_diff}ms`);
      this.jwtService.verify(access_token, {
        clockTimestamp: access_time / 1000,
      });
    } catch (error) {
      this.logger.error(error);
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const jwt_decoded: any = this.jwtService.decode(access_token);

    return { username: jwt_decoded.username };
  }

  @Get('api/authenticate/refresh')
  async refresh(@Request() req, @Res() res) {
    return this.authService
      .jwt_guard({ refresh_token: req.cookies.refresh_token })
      .then((data) => this.authService.refresh(data.username))
      .then((data) => AppController.respond(res, data))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return AppController.respond(res, this.status_code[401]);
        }
        this.logger.error(err);
        return AppController.respond(res, this.status_code[500]);
      });
  }

  @Post('api/authenticate/login')
  async login(@Body() body, @Res() res) {
    return this.authService
      .local_guard(body)
      .then((data) => this.authService.login(data.username))
      .then((data) => AppController.respond_to_login(res, data))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return AppController.respond(res, this.status_code[401]);
        }
        this.logger.error(err);
        return AppController.respond(res, this.status_code[500]);
      });
  }

  @Post('api/authenticate/logout')
  async logout(@Request() req, @Res() res) {
    return this.authService
      .jwt_guard({ refresh_token: req.cookies.refresh_token })
      .then((data) => this.authService.logout(data.username))
      .then((data) => AppController.respond(res, data))
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          return AppController.respond(res, this.status_code[401]);
        }
        this.logger.error(err);
        return AppController.respond(res, this.status_code[500]);
      });
  }

  @Post('api/authenticate/signup')
  async signup(@Body() body, @Res() res) {
    return this.authService
      .signup(body)
      .then((data) => AppController.respond(res, data));
  }
}
