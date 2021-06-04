import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
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
  ) {}

  private static respond(res, data) {
    if (data.statusCode !== undefined) {
      res.statusMessage = data.message;
      res.status(data.statusCode).send();
    } else {
      res.status(HttpStatus.OK).json(data).send();
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
      res.status(HttpStatus.OK).json(data).send();
    }
  }

  json_parse(payload: string) {
    try {
      return JSON.parse(payload);
    } catch (SyntaxError) {
      return {};
    }
  }

  @MessagePattern('authenticate', Transport.RMQ)
  async authenticate(@Payload() payload) {
    const data = this.json_parse(payload);

    try {
      this.jwtService.verify(data.access_token);
    } catch (error) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    const jwt_decoded: any = this.jwtService.decode(data.refresh_token);
    const user = await this.authService.data_layer_request('get_user', {
      username: jwt_decoded.username,
    });

    if ('statusCode' in user || Object.keys(user).length == 0) {
      return { statusCode: 401, message: 'Unauthorized' };
    }

    return { username: jwt_decoded.username };
  }

  @Get('api/refresh')
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

  @Post('api/login')
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

  @Post('api/logout')
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

  @Post('api/signup')
  async signup(@Body() body, @Res() res) {
    return this.authService
      .signup(body)
      .then((data) => AppController.respond(res, data));
  }
}
