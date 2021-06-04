import {
  Body,
  Controller,
  Logger,
  Post,
  Res,
  Request,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { QuestionManagementService } from './question-management/question-management.service';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';

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
    @Inject('ESB_CLIENT') private readonly esb_client: ClientProxy,
    private questionManagement: QuestionManagementService,
  ) {}

  private static parse_auth_header(hdrValue) {
    const re = /(\S+)\s+(\S+)/;
    if (typeof hdrValue !== 'string') {
      return null;
    }
    const matches = hdrValue.match(re);
    return matches && { scheme: matches[1], value: matches[2] };
  }

  private static jwt_from_header(req) {
    if (req.headers['authorization']) {
      const auth_params = AppController.parse_auth_header(
        req.headers['authorization'],
      );
      if (auth_params && auth_params.scheme.toLowerCase() === 'bearer') {
        return auth_params.value;
      }
    }
    return undefined;
  }

  async authenticate(access_token): Promise<any> {
    let re;
    this.esb_client
      .send('authenticate', JSON.stringify({ access_token: access_token }))
      .pipe(timeout(2000))
      .subscribe(
        (value: any) => {
          re = value;
        },
        (error) => {
          this.logger.error(error);
          re = this.status_code[500];
        },
      );

    return re;
  }

  private static respond(res, data) {
    if (data.statusCode !== undefined) {
      res.statusMessage = data.message;
      res.status(data.statusCode).send();
    } else {
      res.status(HttpStatus.OK).json(data).send();
    }
  }

  @Post('api/create-question')
  async create_question(@Body() body, @Request() req, @Res() res) {
    const user = await this.authenticate(AppController.jwt_from_header(req));

    if ('statusCode' in user) {
      return AppController.respond(res, user);
    }

    body.username = user.username;
    return AppController.respond(
      res,
      await this.questionManagement.create_question(body),
    );
  }

  @Post('api/create-answer')
  async create_answer(@Body() body, @Request() req, @Res() res) {
    const user = await this.authenticate(AppController.jwt_from_header(req));

    if ('statusCode' in user) {
      return AppController.respond(res, user);
    }

    body.username = user.username;
    return AppController.respond(
      res,
      await this.questionManagement.create_answer(body),
    );
  }
}
