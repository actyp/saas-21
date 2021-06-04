import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { QuestionProviderService } from './question-provider/question-provider.service';
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
    private questionProvider: QuestionProviderService,
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

  @Get('questions')
  async questions(@Query() query, @Res() res) {
    return AppController.respond(
      res,
      await this.questionProvider.questions({
        start: query.start,
        stop: query.stop,
      }),
    );
  }

  @Get('my-questions')
  async my_questions(@Request() req, @Res() res) {
    const user = await this.authenticate(AppController.jwt_from_header(req));

    if ('statusCode' in user) {
      return AppController.respond(res, user);
    }

    return AppController.respond(
      res,
      await this.questionProvider.my_questions(user.username),
    );
  }

  @Get('my-answers')
  async my_answers(@Request() req, @Res() res) {
    const user = await this.authenticate(AppController.jwt_from_header(req));

    if ('statusCode' in user) {
      return AppController.respond(res, user);
    }

    return AppController.respond(
      res,
      await this.questionProvider.my_answers(user.username),
    );
  }

  @Get('answers-per-question')
  async answers_per_question(@Query() query, @Res() res) {
    return AppController.respond(
      res,
      await this.questionProvider.answers_per_question(query.id),
    );
  }

  @Get('question-per-keyword-count')
  async question_per_keyword_count(@Res() res) {
    return AppController.respond(
      res,
      await this.questionProvider.question_per_keyword_count(),
    );
  }

  @Get('question-per-keyword-count')
  async question_per_date_count(@Res() res) {
    return AppController.respond(
      res,
      await this.questionProvider.question_per_date_count(),
    );
  }

  @Get('my-question-per-date-count')
  async my_question_per_date_count(@Request() req, @Res() res) {
    const user = await this.authenticate(AppController.jwt_from_header(req));

    if ('statusCode' in user) {
      return AppController.respond(res, user);
    }

    return AppController.respond(
      res,
      await this.questionProvider.my_question_per_date_count(user.username),
    );
  }

  @Get('my-answer-per-date-count')
  async my_answer_per_date_count(@Request() req, @Res() res) {
    const user = await this.authenticate(AppController.jwt_from_header(req));

    if ('statusCode' in user) {
      return AppController.respond(res, user);
    }

    return AppController.respond(
      res,
      await this.questionProvider.my_answer_per_date_count(user.username),
    );
  }
}
